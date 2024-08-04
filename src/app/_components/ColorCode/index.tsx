import { useEffect, useMemo, useState } from "react";
import getHTML from "./getHTML";

interface IProps {
  children: string;
}

const ColorCode: React.FC<IProps> = ({ children }) => {
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

  return <span dangerouslySetInnerHTML={{ __html: message }}></span>;
};

export default ColorCode;
