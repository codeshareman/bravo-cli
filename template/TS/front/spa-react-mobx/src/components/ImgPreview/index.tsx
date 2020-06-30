import React, { FC, useState } from "react";
import { Modal } from "antd";

import "./index.scss";

type P = {
  style?: object;
  src: string;
  alt?: string;
};

const ImgPreview: FC<P> = props => {
  const [preview, setPreview] = useState(false);

  return (
    <>
      <img
        src={props.src}
        alt={props.alt}
        style={props.style || {}}
        onClick={() => {
          setPreview(true);
        }}
      />
      {preview && (
        <Modal
          closable
          width={750}
          visible={preview}
          footer={null}
          onCancel={() => {
            setPreview(false);
          }}
        >
          <img src={props.src} alt={props.alt} className="img-preview" />
        </Modal>
      )}
    </>
  );
};

export default ImgPreview;
