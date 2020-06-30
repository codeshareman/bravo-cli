import React, { Component } from 'react'
import { Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ClampUpload } from '../CustComponents'
import { UploadType } from '../CustComponents/ClampUpload'
import { IUploadData } from '../CustComponents/ClampUpload/ClampUpload'

import './index.scss'

type IProps = {
  data?: IUploadData
  limitCount?: number //最大上传数量, 超过时将隐藏上传按钮
  id?: string
  form?: FormComponentProps
  value?: any
  options?: any
  onChange?(v: any)
}

type IStates = {
  fileList: any[]
}

export default class InputWarpperUpload extends Component<IProps, IStates> {
  state = {
    fileList: [],
  }

  UNSAFE_componentWillMount() {
    this.setFileList(this.props.value)
  }

  setFileList = value => {
    let url = ''
    if (value && typeof value === 'string') {
      url = value
    } else if (value instanceof Array && value.length > 0) {
      url = value[0]
    }
    if (url) {
      const arr = url.split('/')
      const file = {
        uid: Math.random()
          .toString(36)
          .substring(2),
        name: arr[arr.length - 1],
        status: 'done',
        url,
      }
      this.setState({
        fileList: [file],
      })
    }
  }

  shouldComponentUpdate(nextProps) {
    const preProps = this.props
    return nextProps.value !== preProps.value
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const preProps = this.props
    if (nextProps.value !== preProps.value) {
      this.setFileList(nextProps.value)
    }
  }

  handleUploadSuccess = fileInfo => {
    const { fileList } = this.state
    fileList.push(fileInfo)
    this.setState({
      fileList,
    })
    this.props.onChange(fileInfo.url)
  }
  handleRemoveImg = current => {
    const { fileList } = this.state
    const files = fileList.filter(file => current.uid !== file.uid)
    this.setState({
      fileList: files,
    })
    //清除value值
    this.props.onChange('')
  }
  render() {
    const { id, value, limitCount = 0, data = {} } = this.props
    let { options = {} } = this.props
    const { fileList } = this.state
    const tempData = Object.assign({}, { uploadType: UploadType.PICTURE }, data)
    options = Object.assign(
      {},
      {
        accept: 'image/*',
        listType: 'picture-card',
        fileList,
        onRemove: this.handleRemoveImg,
      },
      options,
    )

    const hiddenUploadBtn = limitCount ? fileList.length > limitCount : false
    return (
      <div className={`input-warpper-upload ${hiddenUploadBtn ? 'hidden-upload-btn' : ''}`}>
        <Input type="hidden" name={`${id}`} id={`${id}`} value={value} />
        <ClampUpload data={tempData} options={options} onSuccess={this.handleUploadSuccess} needProgress />
      </div>
    )
  }
}
