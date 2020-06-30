import React, { FC, useState, useEffect, useRef } from "react";
import BScroll from "better-scroll";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { Icon } from "antd";
import classnames from "classnames";

import "./index.scss";

const enum ScrollXDirection {
  PRE,
  Next
}
type P = {
  dataSource: any[];
};
type S = {
  currentImgIndex: number;
  currentImgSrc: string;
  originImgs: any[];
  disabledPre: boolean;
  disabledNext: boolean;
};

const Gallery: FC<P> = props => {
  const galleryWrapper = useRef(null);
  const [_scroll, _setScroll] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [disabledPre, setDisabledPre] = useState(true);
  const [disabledNext, setDisabledNext] = useState(true);
  const [currentImgSrc, setCurrentImgSrc] = useState(props.dataSource[0] || "");

  useEffect(() => {
    const initScroll = props.dataSource.length > 6;
    // 初始化_scroll
    if (initScroll && !_scroll) {
      _setScroll(
        new BScroll(galleryWrapper.current, {
          scrollX: true
        })
      );
    }
    initEvent();
  }, []);

  //初始化按钮
  useEffect(() => {
    resetBtnDisabled();
  }, [_scroll]);

  const handleClick = currentIndex => {
    setCurrentIndex(currentIndex);
    setCurrentImgSrc(props.dataSource[currentIndex] || "");
  };

  const getMaskOffset = (offset = 0) => {
    if (offset <= 106) {
      offset = 0;
    } else if (offset >= 318) {
      offset = 212;
    } else {
      offset = offset - 106;
    }
    return offset;
  };

  const initEvent = () => {
    const eventMask = document.getElementById("eventMask");
    //鼠标监听事件
    fromEvent(eventMask, "mousemove")
      .pipe(throttleTime(50))
      .subscribe((e: MouseEvent) => {
        const { offsetX = 0, offsetY = 0 } = e;

        //可视区域遮罩层
        const visibleAreaMask = document.getElementById("visibleAreaMask");

        const maskOffsetX = getMaskOffset(offsetX);
        const maskOffsetY = getMaskOffset(offsetY);

        visibleAreaMask.style.display = "block";
        visibleAreaMask.style.left = `${maskOffsetX}px`;
        visibleAreaMask.style.top = `${maskOffsetY}px`;

        //用于预览的大图（原图）
        const originalImage = document.getElementById("originalImage");
        //包裹大图的外层div, 用于显示或隐藏 预览图
        const originalImageWarp = document.getElementById("originalImageWarp");
        originalImageWarp.style.display = "block";

        //预览图left
        const originalImageLeft = `${-maskOffsetX * 2}px`;
        //预览图top
        const originalImageTop = `${-maskOffsetY * 2}px`;

        originalImage.style.left = originalImageLeft;
        originalImage.style.top = originalImageTop;
      });
    //鼠标离开事件
    fromEvent(eventMask, "mouseout").subscribe((e: MouseEvent) => {
      //包裹大图的外层div, 用于显示或隐藏 预览图
      const originalImageWarp = document.getElementById("originalImageWarp");
      //可视区域遮罩层
      const visibleAreaMask = document.getElementById("visibleAreaMask");
      visibleAreaMask.style.display = "none";
      originalImageWarp.style.display = "none";
    });
  };

  //滚动
  const scrollXTo = (direction: ScrollXDirection) => {
    if (!_scroll) return;
    const { minScrollX = 0, maxScrollX = 0, x = 0 } = _scroll || {};
    let distance = 0;
    if (ScrollXDirection.Next === direction && _scroll) {
      distance = x - 364 > maxScrollX ? -364 : maxScrollX;
    } else if (ScrollXDirection.PRE === direction && _scroll) {
      distance = x + 364 < minScrollX ? 364 : minScrollX;
    }
    _scroll.scrollTo(distance, 0, 500);
    resetBtnDisabled();
  };

  //重制向前向后按钮显示状态
  const resetBtnDisabled = () => {
    if (!_scroll) return;
    const { minScrollX = 0, maxScrollX = 0, x = 0 } = _scroll || {};
    const disabledPre = minScrollX <= x;
    const disabledNext = maxScrollX >= x;
    setDisabledPre(disabledPre);
    setDisabledNext(disabledNext);
  };

  const showScroll = props.dataSource.length > 6;
  const originImgs = props.dataSource || [];

  return (
    <div className="cbp-gallery">
      <div className="cbp-gallery-view">
        <div className="cbp-gallery-view-warp">
          <img src={currentImgSrc} alt="当前预览图片" />
          <div id="visibleAreaMask" className="cbp-gallery-area-mask"></div>
          <div id="eventMask" className="cbp-gallery-event-mask"></div>
        </div>
        <div id="originalImageWarp" className="cbp-gallery-original-image-warp">
          <img id="originalImage" src={currentImgSrc} alt="" />
        </div>
      </div>
      <div
        className="cbp-gallery-list"
        style={showScroll ? { padding: "0 33px" } : {}}
      >
        {showScroll && (
          <div
            key="pre"
            className={classnames("gallery-pre", { disabled: disabledPre })}
            onClick={() => {
              !disabledPre && scrollXTo(ScrollXDirection.PRE);
            }}
          >
            <Icon type="left" />
          </div>
        )}

        <div className="wrapper" ref={galleryWrapper}>
          <ul className="cbp-gallery-list-warp content">
            {originImgs &&
              originImgs.length &&
              originImgs.map((src, index) => {
                return (
                  <li
                    key={index}
                    className={currentIndex === index ? "active" : ""}
                    onClick={() => {
                      handleClick(index);
                    }}
                    onMouseOver={() => {
                      handleClick(index);
                    }}
                  >
                    <img src={src} alt="" />
                  </li>
                );
              })}
          </ul>
        </div>
        {showScroll && (
          <div
            key="next"
            className={classnames("gallery-next", { disabled: disabledNext })}
            onClick={() => {
              !disabledNext && scrollXTo(ScrollXDirection.Next);
            }}
          >
            <Icon type="right" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
