import React, { FC } from "react";
import { Button } from "antd";
import MainLayout from "@/layout";
import ReviewItem, { ReviewStatus, ReviewItemType } from "./ReviewItem";
import "./index.scss";

type P = {};

const tips: ReviewItemType[] = [
  {
    type: ReviewStatus.AUDIT_WAITING,
    title: "审核中",
    desc: "审核结果将在1-3个工作日发至您的邮箱"
  },
  {
    type: ReviewStatus.AUDIT_REJECT,
    title: "您的账号已被停用",
    desc: "停用原因：涉嫌违规，账户封停！"
  },
  {
    type: ReviewStatus.AUDIT_FAILED,
    title: "审核失败",
    desc: "驳回原因：保证金未到账"
  }
];

const Review: FC<P> = props => {
  const item = tips[2];
  const showBtn = ReviewStatus.AUDIT_FAILED === item.type;
  return (
    <MainLayout hideMenu={true}>
      <div className="review">
        <ReviewItem item={item} />
        <br />
        {showBtn ? <Button type="primary">重新申请</Button> : null}
      </div>
    </MainLayout>
  );
};

export default Review;
