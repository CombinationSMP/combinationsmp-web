import styles from "./text.module.scss";
import type { InputHTMLAttributes } from "react";

interface IProps {
  placeholder: string;
  name: string;
  required?: boolean;
  similarTextType?: InputHTMLAttributes<HTMLInputElement>["type"];
  props?: JSX.IntrinsicElements["input"];
  multiline?: boolean;
  multilineProps?: JSX.IntrinsicElements["textarea"];
}

const TextInput: React.FC<IProps> = ({
  placeholder,
  name,
  required,
  similarTextType,
  props,
  multiline,
  multilineProps,
}) => {
  if (multiline) {
    return (
      <textarea required={required} placeholder={placeholder} name={name} className={styles.text} {...multilineProps} />
    );
  }
  return (
    <input
      required={required}
      type={similarTextType ?? "text"}
      placeholder={placeholder}
      name={name}
      className={styles.text}
      {...props}
    />
  );
};

export default TextInput;
