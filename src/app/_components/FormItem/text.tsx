import styles from "./text.module.scss";
import type { InputHTMLAttributes } from "react";

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
}) => {
  if (multiline) {
    return (
      <div className={styles.container}>
        {leftAdornment}
        <textarea maxLength={maxLength} required={required} placeholder={placeholder} name={name} {...multilineProps} />
        {rightAdornment}
      </div>
    );
  }
  return (
    <div className={styles.container}>
      {leftAdornment}
      <input
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
