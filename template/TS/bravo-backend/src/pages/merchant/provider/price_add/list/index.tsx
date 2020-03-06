import React, { Component } from 'react'
import { Divider, Table, message, Input, Form, DatePicker } from 'antd'
import Query from './query'
import { CustBreadcrumb } from '@/components/CustComponents'
import PriceSetModal from '@/components/PriceSetModal'
import { getLocalePrice, getTimestamp, limitWord, optimizePic } from '@/shared/common/utils'
import { TempProduct, StrategyCreateRequest } from '@xmly/cbp-spec/lib/portal/service/oss/TempStrategyService'
import { AJAX_STATUS } from '@/shared/common/constants'
import { PriceModalType, EditType } from '@/components/PriceModal/type'
import FormItemDecorator from '@/components/FormItemDecorator'
import { FormComponentProps } from 'antd/lib/form'
import Regex from '@/shared/common/regex'
import { Price } from '@/components/PriceSetModal/helper'
import TextArea from 'antd/lib/input/TextArea'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ProductQueryRequest } from '@xmly/cbp-spec/lib/portal/service/oss/ChannelStrategyService'
import { UserActionType } from '@/components/PriceSetModal/type'
import GenneralDataCompo from '@/hoc/GenneralDataCompo'
import './index.scss'
import API from '@/api'

const { RangePicker } = DatePicker

type P = FormComponentProps & RouteComponentProps<{ uid: string }> & { roleList: Array<any> }
type S = {
  merchantInfo: any
  visible: boolean
  total: number
  searchParams: ProductQueryRequest
  dataSource: Array<TempProduct>
  loading: boolean
  curRows: any
  curDataSource: Array<TempProduct>
  nextIndex: number
  editType: EditType
}

@(withRouter as any)
class PriceAdd extends Component<P, S> {
  state: S = {
    visible: false,
    loading: false,
    searchParams: {
      pageIndex: 1,
      pageSize: 10,
      productId: null,
      characterId: null,
    },
    total: 0,
    nextIndex: 0,
    curRows: null,
    merchantInfo: null,
    dataSource: [],
    curDataSource: [],
    editType: null,
  }

  componentDidMount() {
    this.initialRequest()
  }

  initialRequest = () => {
    const {
      match: { params },
    } = this.props
    const developerId = +params.uid
    this.getMerchantList(developerId)
  }

  onSubmit = (values: ProductQueryRequest) => {
    const { merchantInfo } = this.state
    const params = {
      pageIndex: 1,
      pageSize: 10,
      productId: +values.productId || null,
      characterId: merchantInfo ? merchantInfo.role : null,
    }
    this.getSpecialPriceProducts(params)
  }

  // 获取商户列表
  getMerchantList = async developerId => {
    const searchParams = {
      developerId,
      companyName: '',
      agentDistrict: '',
      contractNo: '',
      startTs: null,
      endTs: null,
      role: null,
      pageNum: 1,
      pageSize: 10,
    }
    try {
      const res = await API.account.searchAccount(searchParams)
      if (res) {
        if (res.code === AJAX_STATUS.SUCCESS) {
          const resData: any = res.data
          const roleData = resData.list[0]
          this.setState(
            {
              merchantInfo: {
                ...roleData,
                name: this.getCurrentRole(roleData.role),
              },
            },
            () => {
              const { merchantInfo } = this.state
              const params = {
                ...this.state.searchParams,
                characterId: merchantInfo ? merchantInfo.role : null,
              }
              this.getSpecialPriceProducts(params)
            },
          )
        } else {
          message.error(res.message)
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  getCurrentRole = (id: number) => {
    const { roleList } = this.props
    const role = roleList.find(item => id === item.id)
    return role ? role.name : ''
  }

  getSpecialPriceProducts = async (params: ProductQueryRequest) => {
    this.setState({
      loading: true,
      dataSource: [],
    })
    const res = await API.channel.queryProducts(params)
    if (res.code === AJAX_STATUS.SUCCESS) {
      const resData = res.data
      this.setState({
        dataSource: Price.getFilteredPriceList(resData.data),
        total: resData.total,
        loading: false,
        searchParams: {
          ...params,
          pageIndex: resData.current,
        },
      })
    } else {
      message.error(res.message)
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  handleConfirm = () => {
    this.updateDataSource(UserActionType.BTN_CONFIRM)
  }

  // 设置特殊价
  setSpecialPrice = row => {
    const skuList = row.items.map((item, index) => {
      return {
        ...item,
        index,
      }
    })
    const curDataSource = [
      {
        ...row,
        items: skuList,
      },
    ]
    const newSkuList = curDataSource[0].items

    this.setState({
      curDataSource,
      curRows: newSkuList[0],
      editType: EditType.SPECIAL,
      visible: true,
    })
  }

  // 更新价格数据
  updateDataSource = (type: UserActionType) => {
    const { curDataSource } = this.state
    setTimeout(() => {
      if (type === UserActionType.BTN_CONFIRM) {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const validMoment = values['validTime']
            const specialPriceList = curDataSource.map(row => {
              const rowData = { ...row }
              rowData.remark = values.remark || ''
              rowData.approvalId = values.approvalId || ''
              rowData.startTime = validMoment && getTimestamp(validMoment[0])
              rowData.endTime = validMoment && getTimestamp(validMoment[1])
              const skuList = rowData.items

              return {
                ...rowData,
                items: skuList
                  ? skuList.map(sku => {
                      const skuData = { ...sku }
                      const fields = Object.keys(values).filter(item => ~item.indexOf(`tempPrice`))
                      const matchStr = `tempPrice-${skuData.itemId}`
                      if (~fields.indexOf(matchStr)) {
                        const index = fields.indexOf(matchStr)
                        const key = fields[index]
                        skuData.tempPrice = values[key]
                      }
                      return skuData
                    })
                  : [],
              }
            })

            if (type === UserActionType.BTN_CONFIRM) {
              const savePriceParams = this.getSavePriceParams(specialPriceList)
              this.createStrategy(savePriceParams[0])
            }
          }
        })
      }
    })
  }

  getSavePriceParams = dataSource => {
    const { merchantInfo } = this.state
    const saveList: any = []
    const skuPriceList = []
    dataSource.forEach((rows: any) => {
      rows.items.forEach(sku => {
        if (sku.tempPrice) {
          const skuPriceItem = {
            itemId: sku.itemId,
            strategyPrice: sku.tempPrice,
          }
          skuPriceList.push(skuPriceItem)
        }
      })
      saveList.push({
        productId: rows.id,
        userId: merchantInfo && merchantInfo.uid,
        remark: rows.remark,
        startTime: rows.startTime,
        endTime: rows.endTime,
        approvalId: rows.approvalId || '',
        characterId: merchantInfo && merchantInfo.role,
        items: skuPriceList,
      })
    })
    return saveList
  }

  createStrategy = async (params: StrategyCreateRequest) => {
    const { searchParams } = this.state
    const res = await API.tempStrategy.createStrategy(params)
    if (res.code === AJAX_STATUS.SUCCESS) {
      this.setState({
        visible: false,
      })
      message.success('特殊价设置成功')
      this.getSpecialPriceProducts(searchParams)
    } else {
      message.error(res.message)
    }
  }

  handleSetSpecialPrice = rows => {
    this.updatePriceNoClose()
    this.setState({
      curRows: rows,
      editType: EditType.SPECIAL,
    })
  }

  updatePriceNoClose = () => {
    const { curDataSource } = this.state
    const { getFieldValue } = this.props.form
    const { curRows } = this.state
    const fieldName = `tempPrice-${curRows.id}`
    const fieldValue = getFieldValue(fieldName)

    curDataSource.map(rows => {
      rows.remark = ''
      rows.approvalId = ''
      rows.startTime = null
      rows.endTime = null
      const skuList = rows.items
      return {
        ...rows,
        items: skuList.map(sku => {
          const matchStr = `tempPrice-${sku.itemId}`
          if (matchStr === fieldName) {
            sku.tempPrice = fieldValue
          }
          return sku
        }),
      }
    })

    const skuList = curDataSource[0].items
    let curNextIndex = this.state.nextIndex
    const nextIndex = curNextIndex < skuList.length - 1 ? ++curNextIndex : 0

    this.setState({
      curRows: skuList[nextIndex],
      nextIndex,
    })
  }

  getTableProps = () => {
    const { dataSource } = this.state
    const columns = [
      {
        title: '商品',
        dataIndex: 'productInfo',
        key: 'productInfo',
        render: (info: any, rows: TempProduct) => {
          return (
            <div className="product">
              <div className="cover">
                <img src={optimizePic(rows.coverPath)} />
              </div>
              <div className="info">
                <p>{limitWord(rows.productName, 18)}</p>
                <p>商品ID: {rows.productId}</p>
              </div>
            </div>
          )
        },
      },
      {
        title: '原价',
        dataIndex: 'price',
        key: 'price',
        render: (curVal: string) => {
          return getLocalePrice(curVal)
        },
      },
      {
        title: '价盘价',
        dataIndex: 'channelPrice',
        key: 'channelPrice',
        render: (curVal: string) => {
          return getLocalePrice(curVal)
        },
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        render: (val, row) => {
          return (
            <>
              <a onClick={() => this.setSpecialPrice(row)}>设置特殊价</a>
            </>
          )
        },
      },
    ]
    return { dataSource, columns, rowKey: 'productId' }
  }

  getTableColumns = () => {
    const columns = [
      {
        title: '商品',
        dataIndex: 'productInfo',
        key: 'productInfo',
      },
      {
        title: '原价',
        dataIndex: 'price',
        key: 'price',
        render: (curVal: string) => {
          return getLocalePrice(curVal)
        },
      },
      {
        title: '价盘价',
        dataIndex: 'channelPrice',
        key: 'channelPrice',
        render: (curVal: string) => {
          return getLocalePrice(curVal)
        },
      },
      {
        title: '特殊价',
        dataIndex: 'tempPrice',
        key: 'tempPrice',
        render: (price: string, rows: any) => {
          const { curRows, editType } = this.state
          const autoFocus = curRows ? curRows.id === rows.id : true
          const isEdit = curRows && curRows.id === rows.id && editType === EditType.SPECIAL

          return !isEdit ? (
            <div className="price-text" onClick={() => this.handleSetSpecialPrice(rows)}>
              <span>{getLocalePrice(rows.tempPrice) || '设置'}</span>
            </div>
          ) : (
            <FormItemDecorator
              form={this.props.form}
              label=""
              field={`tempPrice-${rows.id}`}
              options={{
                initialValue: price,
                rules: [
                  {
                    required: true,
                    message: '你还未输入特殊价',
                  },
                  {
                    pattern: Regex.money,
                    message: '特殊价格式不正确',
                  },
                ],
              }}
            >
              <Input
                style={{ width: '90%' }}
                addonBefore={'¥'}
                autoFocus={autoFocus}
                onPressEnter={this.updatePriceNoClose}
                onFocus={() => {
                  this.setState({
                    curRows: rows,
                    nextIndex: rows.index,
                  })
                }}
              />
            </FormItemDecorator>
          )
        },
      },
      {
        title: '特殊价有效期',
        dataIndex: 'validDate',
        key: 'validDate',
        render: () => {
          return (
            <FormItemDecorator
              form={this.props.form}
              label=""
              field="validTime"
              options={{
                rules: [
                  {
                    required: true,
                    message: '你还未选择特殊价有效期',
                  },
                ],
              }}
            >
              <RangePicker style={{ width: '90%' }} format={'YYYY-MM-DD HH:mm:ss'} showTime />
            </FormItemDecorator>
          )
        },
      },
    ]
    return columns
  }

  renderExtralInfo = () => {
    return (
      <div className="extra-info">
        <div className="approval">
          <FormItemDecorator
            required
            form={this.props.form}
            field="approvalId"
            label="钉钉审批号"
            options={{
              rules: [
                {
                  required: true,
                  message: '你还未填写钉钉审批号',
                },
              ],
            }}
          >
            <Input style={{ width: 280 }} placeholder="请输入审批编号"></Input>
          </FormItemDecorator>
        </div>
        <div className="remark">
          <FormItemDecorator form={this.props.form} field="remark" label="备注">
            <TextArea placeholder="请输入内容" autoSize={{ minRows: 4, maxRows: 4 }}></TextArea>
          </FormItemDecorator>
        </div>
      </div>
    )
  }

  render() {
    const { merchantInfo } = this.state
    const { curDataSource, loading, total, searchParams } = this.state
    const developId = merchantInfo && merchantInfo.developerId
    const routes = [
      // { path: '/business/provider', name: '商户管理' },
      { path: '/business/provider', name: '商户列表' },
      { path: `/business/provider/specialPrice/${developId}`, name: '设置特殊价' },
      { path: '', name: '新增特殊价' },
    ]

    return (
      <div className="price-add">
        <CustBreadcrumb routes={routes}></CustBreadcrumb>
        <h2>新增特殊价</h2>
        <Query onSubmit={this.onSubmit} />
        <Divider />
        {/* <div className="stastic">
          共 <span className="total"> {total} </span>条数据
        </div> */}
        <Table
          className="table-list"
          scroll={{ x: 1300 }}
          {...this.getTableProps()}
          loading={{ spinning: loading, tip: '数据加载中...' }}
          pagination={{
            total,
            current: searchParams.pageIndex,
            pageSize: searchParams.pageSize,
            showTotal: total => `共 ${total} 条数据`,
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: (current, pageSize) => {
              const searchParams = {
                ...this.state.searchParams,
                pageIndex: 1,
                pageSize,
              }
              this.getSpecialPriceProducts(searchParams)
              this.setState({
                searchParams,
              })
            },
            onChange: pageIndex => {
              const searchParams = {
                ...this.state.searchParams,
                pageIndex,
              }
              this.getSpecialPriceProducts(searchParams)
              this.setState({
                searchParams,
              })
            },
          }}
        />
        <PriceSetModal
          visible={this.state.visible}
          title="设置特殊价"
          width={932}
          type={PriceModalType.SPECIAL}
          columns={this.getTableColumns()}
          dataSource={curDataSource}
          currentRole={merchantInfo}
          onConfirm={this.handleConfirm}
          onCancel={this.handleCancel}
          extral={this.renderExtralInfo()}
          destroyOnClose
        />
      </div>
    )
  }
}

export default Form.create()(GenneralDataCompo(PriceAdd))
