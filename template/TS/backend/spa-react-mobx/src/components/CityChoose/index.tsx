import React, { Component } from 'react'
import { Modal, Tag, Row, Col } from 'antd'

import './style.scss'
import { selectedInfo, selectAreaType } from './type'
import { getDictInfoByCode, getDictDataByFirstLetter } from './utils'

interface CityChoosProps {
  type?: selectAreaType
  tagData: Array<any>
  onOk(values: selectedInfo): void
  onCancel(e: any): void
  visible: boolean
}
interface CityChooseState {
  tagValues: Array<any>
  chooseCityType: string
  dictData: any
}

const PinYinList = [
  '热门城市',
  'A B C',
  'D E F G',
  'H I',
  'J K',
  'L M N',
  'O P Q R',
  'S T U',
  'V W X',
  'Y Z',
  '所有城市',
]
const InitCityType = PinYinList[0]

class CityChoose extends Component<CityChoosProps, CityChooseState> {
  constructor(props: CityChoosProps) {
    super(props)
    this.state = {
      tagValues: [],
      chooseCityType: InitCityType,
      dictData: {},
    }
  }

  componentDidMount() {
    this.getData()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.tagData !== this.props.tagData) {
      this.setState({
        tagValues: nextProps.tagData,
      })
    }
  }

  getData = (type = PinYinList[0]) => {
    // 获取数据，平铺数据
    this.setState({
      dictData: getDictDataByFirstLetter(type),
    })
  }

  handleOk = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    const { tagValues } = this.state
    const selectedDicts = []

    // 计算去重后的所有城市code
    tagValues.forEach(item => {
      const tagInfo = getDictInfoByCode(item.code)
      selectedDicts.push(tagInfo)
    })

    this.props.onOk({
      selectedDicts,
    })
  }

  changeCityType = (value: string) => {
    this.getData(value)
    this.setState({
      chooseCityType: value,
    })
  }

  chooseCity = city => {
    let { tagValues } = this.state
    const { type } = this.props
    const code = city.code
    const name = city.name
    const tagCodes = tagValues.map(item => item.code)
    const index = tagCodes.indexOf(code)

    if (type === selectAreaType.MULTI) {
      if (~tagCodes.indexOf('00')) {
        tagValues = [{ code: '00', name: '全国' }]
      } else {
        tagValues = []
        if (index === -1) {
          tagValues.push({ code, name })
        } else {
          tagValues.splice(index, 1)
        }
      }
    }

    this.setState({
      tagValues,
    })
  }

  closeTag = index => {
    const { tagValues } = this.state
    tagValues.splice(index, 1)
    this.setState({
      tagValues,
    })
  }

  render() {
    const { tagValues, chooseCityType, dictData } = this.state
    return (
      <Modal
        title="选择地区"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleOk}
        width={800}
        className="city-choose-wrapper"
        maskClosable={false}
      >
        <div className="city-choose-content">
          {tagValues.length > 0 && (
            <div className="tag-wrapper">
              {tagValues.map((item, index) => {
                const tagInfo = getDictInfoByCode(item.code)
                return (
                  <Tag closable onClose={() => this.closeTag(index)} key={item.code}>
                    {tagInfo.name}
                  </Tag>
                )
              })}
            </div>
          )}
          <Row>
            <Col span={3} className="left-wrapper">
              {PinYinList.map((e, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => this.changeCityType(e)}
                    className={`city-type-nochoose ${chooseCityType === e ? 'city-type-choose' : null}`}
                  >
                    {e}
                  </div>
                )
              })}
            </Col>
            <Col span={21} className="right-wrapper">
              {dictData[chooseCityType] &&
                dictData[chooseCityType].map(e => {
                  const code = e.code
                  const tagCodes = tagValues.map(item => item.code)
                  return (
                    <Col className="tag-item" span={6} key={code}>
                      <span
                        className={`city-nochoose ${tagCodes.indexOf(code) === -1 ? '' : 'city-choose'}`}
                        onClick={() => this.chooseCity(e)}
                      >
                        {e.name}
                      </span>
                    </Col>
                  )
                })}
            </Col>
          </Row>
        </div>
      </Modal>
    )
  }
}

export default CityChoose
