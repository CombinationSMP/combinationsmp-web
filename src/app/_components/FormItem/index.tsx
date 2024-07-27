import palette from "@/styles/vars.module.scss";

interface IProps {
  index: number;
  question: string | JSX.Element;
  required?: boolean;
}

const FormItem: React.FC<React.PropsWithChildren<IProps>> = ({ children, index, question, required }) => {
  return (
    <>
      {index !== 0 && <hr style={{ borderColor: palette.secondary, borderStyle: "solid" }} />}
      <div style={{ margin: "1rem 0" }}>
        <div style={{ display: "flex", gap: ".25rem" }}>
          <p>{index + 1}.</p>
          <p style={{ paddingBottom: ".25rem" }}>
            {question}
            {required && <span style={{ color: "#ff0000" }}>*</span>}
          </p>
        </div>
        {children}
      </div>
    </>
  );
};

export default FormItem;
