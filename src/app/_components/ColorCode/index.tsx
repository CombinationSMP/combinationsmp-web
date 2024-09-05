import { type CSSProperties, useEffect, useMemo, useState } from "react";
import getHTML from "./getHTML";

interface IProps {
  useParagraph?: boolean;
  children: string;
  elementStyle?: CSSProperties;
}

const ColorCode: React.FC<IProps> = ({ useParagraph, children, elementStyle }) => {
  const [message, setMessage] = useState<string>(children);

  useEffect(() => {
    if (children.includes("§")) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        setMessage(await getHTML(children));
      })();
    }
  }, [children]);

  useMemo(() => {
    setMessage(children);
  }, [children]);

  if (useParagraph) {
    return <p style={elementStyle} dangerouslySetInnerHTML={{ __html: message }} />;
  }

  return <span style={elementStyle} dangerouslySetInnerHTML={{ __html: message }} />;
};

export default ColorCode;
