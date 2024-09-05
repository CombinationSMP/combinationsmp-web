"use client";

import { type DOMAttributes, type HTMLAttributes, useState } from "react";
import styles from "./button.module.scss";
import classNames from "classnames";
import { useRouter } from "next/navigation";

interface IProps {
  disabled?: boolean;
  href?: string;
  openInNewTab?: boolean;
  onClick?: DOMAttributes<HTMLButtonElement>["onClick"];
  style?: HTMLAttributes<HTMLButtonElement>["style"];
}

const Button: React.FC<React.PropsWithChildren<IProps>> = ({
  disabled,
  children,
  href,
  openInNewTab,
  onClick,
  style,
}) => {
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

  const openHref = () => {
    if (!disabled && href) {
      if (openInNewTab) {
        open(href, "_blank");
      } else {
        router.push(href);
      }
    }
  };

  const onMouseDown = () => {
    setClicked(true);
    if (!disabled && href) {
      router.prefetch(href);
    }
  };

  const onMouseUp = () => {
    setClicked(false);
  };

  return (
    <button
      disabled={disabled}
      className={classNames(styles.btn, clicked ? styles.mousedown : undefined, disabled ? styles.disabled : undefined)}
      style={style}
      onClick={href ? openHref : onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {children}
    </button>
  );
};

export default Button;
