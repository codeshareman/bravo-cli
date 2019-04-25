// 文档地址 https://www.kancloud.cn/wangfupeng/wangeditor3/332599

import React, { Component } from "react";
import WangEditor from "wangeditor";
import uploadImg from "../../../utils/uploadImg";

type IProps = {
  value?: any;
  onChange?(html: any);
};

type IState = {};

export default class EditorComp extends Component<IProps, IState> {
  editRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const { onChange, value } = this.props;
    const editor = new WangEditor(this.editRef.current);
    //配置菜单
    editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      //'emoticon',  // 表情
      "image", // 插入图片
      "table", // 表格
      //'video',  // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    //监听内容变化
    editor.customConfig.onchange = html => {
      onChange(html);
    };
    //增加图片本地上传
    //editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器

    // files 是 input 中选中的文件列表 , insert 是获取图片 url 后，插入到编辑器的方法
    editor.customConfig.customUploadImg = function(files, insert) {
      if (files && files.length > 0) {
        files.forEach(file => {
          uploadImg(file, res => {
            if (res && res.url) {
              insert(res.url);
            }
          });
        });
      }
    };

    //实例化富文本编辑框
    editor.create();
    //设置默认值
    editor.txt.html(value);
  }

  render() {
    return <div className="wws-cust-edit" ref={this.editRef} />;
  }
}
