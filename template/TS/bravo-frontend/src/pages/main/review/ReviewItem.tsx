import React, { FC } from "react";

export const enum ReviewStatus {
  AUDIT_WAITING, // 审核中
  AUDIT_REJECT, //审核被拒接
  ACCOUNT_DISABLED, //账号停用
  UNKNOWN //未知错误
}

export interface IReviewItem {
  type: ReviewStatus;
  title: string;
  desc: string;
}

const iconIndex = {
  [ReviewStatus.AUDIT_WAITING]: "icon-waiting",
  [ReviewStatus.AUDIT_REJECT]: "icon-reject",
  [ReviewStatus.ACCOUNT_DISABLED]: "icon-failed",
  [ReviewStatus.UNKNOWN]: "icon-failed"
};

type P = {
  item: IReviewItem;
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
