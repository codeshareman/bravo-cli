import React, { FC } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Button } from "antd";
import ReviewItem, { ReviewStatus, IReviewItem } from "./ReviewItem";
import { ApplyStatus } from "@/shared/common/constants";

import "./index.scss";

type P = RouteComponentProps & {
  type: ReviewStatus;
  item: IReviewItem;
};

const Review: FC<P> = props => {
  if (!props.type && props.type !== 0) {
    return null;
  }
  const showBtn = ReviewStatus.AUDIT_REJECT === props.type;
  return (
    <div className="review">
      <ReviewItem item={props.item} />
      <br />
      {showBtn ? (
        <Button
          type="primary"
          onClick={() => {
            props.history.push({
              pathname: "/apply",
              state: {
                applyStatus: ApplyStatus.RE_APPLY
              }
            });
          }}
        >
          重新申请
        </Button>
      ) : null}
    </div>
  );
};

export default withRouter(Review);
