import React, { FC } from "react";

export enum ReviewStatus {
  AUDIT_WAITING = 0, // 审核中
  AUDIT_REJECT = 1, //审核被拒接
  AUDIT_FAILED = 2 //审核失败
}

export type ReviewItemType = {
  type: ReviewStatus;
  title: string;
  desc: string;
};

const iconIndex = {
  [ReviewStatus.AUDIT_WAITING]: "icon-waiting",
  [ReviewStatus.AUDIT_REJECT]: "icon-reject",
  [ReviewStatus.AUDIT_FAILED]: "icon-failed"
};

type P = {
  item: ReviewItemType;
};

const ReviewItem: FC<P> = props => {
  return (
    <div className="review-item">
      <div className={`review-item-icon  ${iconIndex[props.item.type]}`}></div>
      <div className="review-item-content">
        <h4 className="review-item-content-title">{props.item.title}</h4>
        <div className="review-item-content-desc">{props.item.desc}</div>
      </div>
    </div>
  );
};

export default ReviewItem;
