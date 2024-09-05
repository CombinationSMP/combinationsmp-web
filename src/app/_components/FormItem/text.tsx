import classNames from "classnames";
import styles from "./text.module.scss";
import type { CSSProperties, InputHTMLAttributes } from "react";

interface IProps {
  placeholder: string;
  name?: string;
  required?: boolean;
  maxLength?: number;
  similarTextType?: InputHTMLAttributes<HTMLInputElement>["type"];
  props?: JSX.IntrinsicElements["input"];
  multiline?: boolean;
  multilineProps?: JSX.IntrinsicElements["textarea"];
  leftAdornment?: JSX.Element;
  rightAdornment?: JSX.Element;
  containerStyle?: CSSProperties;
  disabled?: boolean;
}

const TextInput: React.FC<IProps> = ({
  placeholder,
  name,
  required,
  maxLength,
  similarTextType,
  props,
  multiline,
  multilineProps,
  leftAdornment,
  rightAdornment,
  containerStyle,
  disabled,
}) => {
  if (multiline) {
    return (
      <div className={classNames(styles.container, disabled ? styles.disabled : undefined)} style={containerStyle}>
        {leftAdornment}
        <textarea
          disabled={disabled}
          maxLength={maxLength}
          required={required}
          placeholder={placeholder}
          name={name}
          {...multilineProps}
        />
        {rightAdornment}
      </div>
    );
  }
  return (
    <div className={classNames(styles.container, disabled ? styles.disabled : undefined)} style={containerStyle}>
      {leftAdornment}
      <input
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        type={similarTextType ?? "text"}
        placeholder={placeholder}
        name={name}
        {...props}
      />
      {rightAdornment}
    </div>
  );
};

export default TextInput;
