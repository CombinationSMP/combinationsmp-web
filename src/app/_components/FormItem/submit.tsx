"use client";

import classNames from "classnames";
import { useState } from "react";
import styles from "../button.module.scss";

interface IProps {
  children: string;
  style?: JSX.IntrinsicElements["input"]["style"];
}

const SubmitButton: React.FC<IProps> = ({ children, style }) => {
  const [clicked, setClicked] = useState(false);

  const onMouseDown = () => {
    setClicked(true);
  };

  const onMouseUp = () => {
    setClicked(false);
  };

  return (
    <input
      type="submit"
      value={children}
      className={classNames(styles.btn, clicked ? styles.mousedown : undefined)}
      style={style}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    />
  );
};

export default SubmitButton;
