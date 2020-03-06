import React, { Component } from 'react'
import Form, { FormComponentProps } from 'antd/lib/form'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import GenneralDataCompo from '@/hoc/GenneralDataCompo'
import './style.scss'
import CustBreadcrumb from '@/components/CustComponents/CustBreadcrumb'
import FormItemDecorator from '@/components/FormItemDecorator'
import { Input, Select, Tooltip, InputNumber, DatePicker, Button, message } from 'antd'
import { RIGHT_TYPE, RIGHT_TYPE_DICT } from '../constants'
import questionIcon from '@/assets/images/ico_tips_question@2x.png'
import { getTimestamp } from '@/shared/common/utils'
import API from '@/api'
import { AJAX_STATUS } from '@/shared/common/constants'
import moment from 'moment'
import arrowIcon from '@/assets/images/ico_arrow_blue@2x.png'

interface AddActivityProps extends FormComponentProps, RouteComponentProps {}
interface AddActivityState {
  businessList: Array<any>
}
const SelectOption = Select.Option

@(withRouter as any)
class AddActivity extends Component<AddActivityProps, AddActivityState> {
  constructor(props: AddActivityProps) {
    super(props)
    this.state = {
      businessList: [],
    }
  }
  componentDidMount() {
    this.getFirstChannel()
  }
  getFirstChannel = async () => {
    try {
      const res = await API.firstChannel.getFirstChannel()
      if (res.code === AJAX_STATUS.SUCCESS) {
        this.setState({
          businessList: [...res.data],
        })
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }
  onSubmit = () => {
    const { businessList } = this.state
    const record = this.props.location.state ? this.props.location.state.record : {}
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const params = { ...values }
        // params.startActivityDate = params.dateList&&params.dateList.length > 0 && getTimestamp(params.dateList[0])
        // params.endActivityDate = params.dateList&&params.dateList.length > 0 && getTimestamp(params.dateList[1])
        params.startActivityDate = params.beginDate && getTimestamp(params.beginDate)
        params.endActivityDate = params.endDate && getTimestamp(params.endDate)
        if (values.channelId) {
          businessList.forEach(e => {
            if (e.id === values.channelId) {
              params.channelName = e.name
            }
          })
        }
        params.activityId = record.activityId ? record.activityId : ''
        delete params.dateList
        try {
          const res = await API.reward.saveActivity(params)
          if (res.code === AJAX_STATUS.SUCCESS) {
            this.onCancle()
          } else {
            message.info(res.message, 2, null)
          }
        } catch (e) {
          throw new Error(e.message)
        }
      }
    })
  }
  onCancle = () => {
    this.props.history.push('/award/activity/list')
  }
  blurUID = e => {
    const value = e.target.value
    if (!value) return
    this.props.form.validateFields(['uid'], async err => {
      if (!err) {
        try {
          const res = await API.reward.checkUid(value)
          if (res.code !== AJAX_STATUS.SUCCESS) {
            message.info(res.message, 2, null)
          }
        } catch (e) {
          throw new Error(e.message)
        }
      }
    })
  }
  // validatorDateLiist = (rule, value, callback) => {
  //     const record = this.props.location.state?this.props.location.state.record:{}
  //     const {activityId, endActivityDate, startActivityDate} = record
  //     if(activityId){
  //         const startDate = value&&value.length > 0 && getTimestamp(value[0])
  //         const endDate = value&&value.length > 0 && getTimestamp(value[1])
  //         const now = new Date().valueOf();
  //         if(now <= endActivityDate && now >= startActivityDate){
  //             if(now>endDate){
  //                 callback("结束时间需要晚于当前时间")
  //             }
  //             if(startDate !== startActivityDate){
  //                 callback("进行中的活动，开始时间不能修改")
  //             }
  //         }else if(now < startActivityDate){
  //             if(now>startDate){
  //                 callback("开始和结束时间不能早于当前时间")
  //             }
  //         }
  //     }
  //     callback()
  // }
  render() {
    const routes = [
      {
        path: '/award/activity/list',
        name: '拉新活动列表',
      },
      {
        path: '',
        name: '编辑拉新活动',
      },
    ]
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    const record = this.props.location.state ? this.props.location.state.record : {}
    const {
      activityId,
      activityName,
      channelId,
      presentType,
      commodityId,
      allNumber,
      startActivityDate,
      endActivityDate,
      uid,
      opsActivityId,
      activityUrl,
    } = record
    const { form } = this.props
    const { businessList } = this.state
    const rightType = form.getFieldValue('presentType')
    const templateID = rightType === RIGHT_TYPE_DICT.many ? 1875 : 1810
    const tryAndSmall = rightType === RIGHT_TYPE_DICT.try || rightType === RIGHT_TYPE_DICT.small ? true : false
    const runningFlag = activityId && moment().valueOf() < endActivityDate && moment().valueOf() > startActivityDate
    return (
      <div className="award-add-activity">
        <CustBreadcrumb routes={routes} showCurrentPosition />
        <div className="title-wrapper">
          <div className="title">{`${activityId ? '编辑' : '新增'}拉新活动`}</div>
          <div className="msg-wrapper">
            <a className="msg" href="https://shimo.im/docs/XHTwc9gpCwtVqCpp" target="_block">
              查看使用说明
            </a>
            <img className="icon" src={arrowIcon} alt="arrow" />
          </div>
        </div>
        <Form className="form-wrapper" {...formItemLayout} colon={false}>
          <FormItemDecorator
            form={form}
            field="activityName"
            label="活动名称"
            required={true}
            options={{
              initialValue: activityName && activityName,
              rules: [
                {
                  required: true,
                  message: '请输入活动名称',
                },
                {
                  max: 40,
                  message: '最多支持40个字符',
                },
              ],
            }}
          >
            <Input style={{ width: 400 }} placeholder="请输入活动名称" />
          </FormItemDecorator>
          <FormItemDecorator
            form={form}
            field="channelId"
            label="活动所属业务"
            required={true}
            options={{
              initialValue: channelId && channelId,
              rules: [
                {
                  required: true,
                  message: '请选择活动所属业务',
                },
              ],
            }}
          >
            <Select style={{ width: 400 }} placeholder="请选择活动所属业务" allowClear disabled={activityId && true}>
              {businessList.map(e => {
                return (
                  <SelectOption key={e.id} value={e.id}>
                    {e.name}
                  </SelectOption>
                )
              })}
            </Select>
          </FormItemDecorator>
          <FormItemDecorator
            form={form}
            field="presentType"
            label="权益类型"
            required={true}
            options={{
              initialValue: presentType && presentType,
              rules: [
                {
                  required: true,
                  message: '请选择权益类型',
                },
              ],
            }}
          >
            <Select style={{ width: 400 }} placeholder="请选择权益类型" allowClear disabled={activityId && true}>
              {RIGHT_TYPE.map(e => {
                return (
                  <SelectOption key={e.value} value={e.value}>
                    {e.label}
                  </SelectOption>
                )
              })}
            </Select>
          </FormItemDecorator>
          {rightType && (
            <FormItemDecorator
              form={form}
              field="commodityId"
              label={tryAndSmall ? '商品ID' : '礼包编号'}
              required={true}
              options={{
                initialValue: commodityId && commodityId,
                rules: [
                  {
                    required: true,
                    message: `请填写${tryAndSmall ? '商品ID' : '礼包编号'}`,
                  },
                ],
              }}
            >
              <Input.TextArea
                disabled={activityId && true}
                style={{ width: 400 }}
                placeholder={tryAndSmall ? '只支持输入一个会员商品ID' : '请输入礼包编号，每个礼包编号间用英文“,”隔开'}
                autoSize={{ minRows: 4, maxRows: 4 }}
              />
            </FormItemDecorator>
          )}
          {rightType && (
            <FormItemDecorator form={form} field="templateID" label="模板活动ID" required={true}>
              <span>
                {templateID}
                <Tooltip title="模板活动ID为“通用营销后台”的模板H5活动页面">
                  <img className="icon" src={questionIcon} alt="question" />
                </Tooltip>
              </span>
            </FormItemDecorator>
          )}
          <Form.Item label="活动参与人数">
            {form.getFieldDecorator('activityNumber', {
              initialValue: allNumber && allNumber,
              rules: [
                {
                  required: true,
                  message: '请输入活动限制人数',
                },
              ],
            })(
              <InputNumber
                style={{ width: 400 }}
                min={1}
                autoComplete="off"
                placeholder="请输入活动限制人数"
                max={9999999}
              />,
            )}
            <Tooltip
              style={{ display: 'inline-block' }}
              title="活动参与人数是指该活动可参与的总人数，每个人仅可以参加1次。活动参与人数可小于或者等于会员权益的申请数量"
            >
              <img className="icon" src={questionIcon} alt="question" />
            </Tooltip>
          </Form.Item>
          <Form.Item label="活动时间" required={true} style={{ marginBottom: 0 }}>
            {/* {form.getFieldDecorator('dateList', {
                            initialValue: startActivityDate&&endActivityDate&&[moment(startActivityDate), moment(endActivityDate)],
                            rules: [
                                {
                                    required: true,
                                    message: '请选择活动时间',
                                },
                                {
                                    validator: this.validatorDateLiist,
                                }
                            ],
                        })(
                            <DatePicker.RangePicker allowClear style={{width: 400}} showTime/>
                        )} */}
            <Form.Item style={{ display: 'inline-block', width: 190 }}>
              {form.getFieldDecorator('beginDate', {
                initialValue: startActivityDate && moment(startActivityDate),
                rules: [
                  {
                    required: true,
                    message: '请选择活动起始时间',
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (runningFlag) {
                        callback()
                        return
                      }
                      if (moment(value).valueOf() < moment().valueOf()) {
                        callback('起始时间不得小于当前时间')
                      }
                      callback()
                    },
                  },
                ],
              })(<DatePicker disabled={runningFlag && true} showTime allowClear />)}
            </Form.Item>
            <span style={{ display: 'inline-block', textAlign: 'center', margin: '0px 2px 0px 7px' }}>~</span>
            <Form.Item style={{ display: 'inline-block', width: 190 }}>
              {form.getFieldDecorator('endDate', {
                initialValue: endActivityDate && moment(endActivityDate),
                rules: [
                  {
                    required: true,
                    message: '请选择活动结束时间',
                  },
                  {
                    validator: (rule, value, callback) => {
                      const beginDate = this.props.form.getFieldValue('beginDate')
                      if (moment(value).valueOf() < moment().valueOf()) {
                        callback('结束时间不得小于当前时间')
                      }
                      if (moment(value).valueOf() < moment(beginDate).valueOf()) {
                        callback('结束时间不得小于开始时间')
                      }
                      callback()
                    },
                  },
                ],
              })(<DatePicker showTime allowClear />)}
            </Form.Item>
            <Tooltip title="活动时间范围可小于或者等于会员权益的申请时间">
              <img className="icon" style={{ marginLeft: 7 }} src={questionIcon} alt="question" />
            </Tooltip>
          </Form.Item>
          <Form.Item label="商户UID">
            {form.getFieldDecorator('uid', {
              initialValue: uid && uid,
              rules: [
                {
                  required: true,
                  message: '请输入商户UID',
                },
                {
                  pattern: /^\d+$/,
                  message: '请输入数字',
                },
              ],
            })(
              <Input
                disabled={activityId && true}
                style={{ width: 400 }}
                placeholder="请输入商户UID"
                onBlur={e => {
                  this.blurUID(e)
                }}
              />,
            )}
            <Tooltip title="商户开发者ID可在商户管理的商户列表查询">
              <img className="icon" src={questionIcon} alt="question" />
            </Tooltip>
          </Form.Item>
          <Form.Item label="OPS活动ID">
            {form.getFieldDecorator('opsActivityId', {
              initialValue: opsActivityId && opsActivityId,
              rules: [
                {
                  required: true,
                  message: '请输入OPS活动ID',
                },
                {
                  pattern: /^[a-zA-Z0-9]+$/,
                  message: '仅支持字母和数字',
                },
              ],
            })(
              <Input
                disabled={activityId && true}
                style={{ width: 400 }}
                placeholder="请输入对应ops上创建的活动，仅支持字母和数字"
              />,
            )}
            <Tooltip title="该字段用于标识ops上创建的活动，仅支持字母和数字">
              <img className="icon" src={questionIcon} alt="question" />
            </Tooltip>
          </Form.Item>
          {/* <FormItemDecorator
                        form={form}
                        field="opsActivityId"
                        label="OPS活动ID"
                        required={true}
                        options={{
                            initialValue: opsActivityId&&opsActivityId,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入OPS活动ID',
                                },
                            ],
                        }}
                    >
                        <Input disabled={activityId&&true} style={{width: 400}} placeholder="请输入对应ops上创建的活动，仅支持字母和数字"/>
                    </FormItemDecorator> */}
          <FormItemDecorator
            form={form}
            field="activityUrl"
            label="活动链接"
            required={true}
            options={{
              initialValue: activityUrl && activityUrl,
              rules: [
                {
                  required: true,
                  message: '请输入活动链接',
                },
              ],
            }}
          >
            <Input disabled={activityId && true} style={{ width: 400 }} placeholder="请输入活动链接" />
          </FormItemDecorator>
          <div className="ant-col ant-form-item-label ant-col-xs-24 ant-col-sm-4" />
          <div className="ant-col ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-20 button-wrapper">
            <Button type="primary" style={{ marginRight: 10, width: 72 }} onClick={() => this.onSubmit()}>
              保存
            </Button>
            <Button style={{ width: 72 }} onClick={this.onCancle}>
              取消
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default Form.create<AddActivityProps>()(GenneralDataCompo(AddActivity))
