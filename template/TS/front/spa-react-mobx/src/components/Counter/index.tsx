import React, { FC, useState } from "react";
import { Input } from "antd";
import classnames from "classnames";

import "./index.scss";

type P = {
  disabled?: boolean;
  defaultValue?: number; //默认值
  max?: number; //	最大值
  min?: number; //最小值
  step?: number; //每次改变步数，可以为小数
  onChange?(val: number);
  //onPressEnter?(val: number);
};
const enum StepDirection {
  SUB,
  ADD
}

const Counter: FC<P> = props => {
  const _step = props.step || 1;
  const _max = props.max || Infinity;
  const _min = props.min || 0;

  const [value, setValue] = useState(props.defaultValue || 0);
  const [displayValue, setDisplayValue] = useState(props.defaultValue || 0);
  const [_addDisabled, _setAddDisabled] = useState(
    props.disabled || value >= _max
  );
  const [_subDisabled, _setSubDisabled] = useState(
    props.disabled || value <= _min
  );

  const handleStep = (direction: StepDirection) => {
    let tempValue = 0;
    if (StepDirection.ADD === direction) {
      tempValue = value + _step;
    } else {
      tempValue = value - _step;
    }
    validatorValue(tempValue);
  };

  const resetDisabled = (value: number) => {
    _setAddDisabled(props.disabled || value >= _max);
    _setSubDisabled(props.disabled || value <= _min);
  };

  const inputChange = e => {
    let { value } = e.target;
    setDisplayValue(value);
  };

  const onPressEnter = e => {
    let { value } = e.target;
    setDisplayValue(value);
  };

  const onblur = e => {
    let val = e.target.value;
    if (!isNaN(val) && /^-?\\d+$/.test(val)) {
      validatorValue(Number(val));
    } else {
      validatorValue(val);
    }
  };

  const validatorValue = (value: number) => {
    try {
      if (value >= _max) {
        value = _max;
      } else if (value <= _min) {
        value = _min;
      }
      setValue(value);
      setDisplayValue(value);
      resetDisabled(value);
      props.onChange && props.onChange(value);
    } catch (error) {
      console.log({ error });
      setValue(_min);
    }
  };

  return (
    <div className="cust-counter">
      <a
        className={classnames({
          "counter-disabled": _subDisabled
        })}
        onClick={() => {
          !_subDisabled && handleStep(StepDirection.SUB);
        }}
      >
        -
      </a>
      <Input
        value={displayValue}
        onChange={inputChange}
        onPressEnter={onPressEnter}
        onBlur={onblur}
        disabled={props.disabled}
      />
      <a
        className={classnames({
          "counter-disabled": _addDisabled
        })}
        onClick={() => {
          !_addDisabled && handleStep(StepDirection.ADD);
        }}
      >
        +
      </a>
    </div>
  );
};

export default Counter;
