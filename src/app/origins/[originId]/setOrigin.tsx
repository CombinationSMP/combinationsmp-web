import Button from "@/app/_components/button";
import MCUsername from "@/app/apply/_mcusername";
import axios from "axios";
import { useState } from "react";
import { type ZodError } from "zod";

interface IProps {
  originId: string;
}

type OriginResponse =
  | {
      issues: ZodError[];
      success: undefined;
    }
  | {
      success: "true";
    };

const SetOrigin: React.FC<IProps> = ({ originId }) => {
  const [selected, setSelected] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<ZodError[]>();
  const [loading, setLoading] = useState(false);

  const handleSelect = () => {
    setSelected(true);
    setSuccess(false);
  };

  const handleChange = (value: string, valid: boolean) => {
    setUsername(value);
    setIsValid(valid);
  };

  const handleSet = async () => {
    setLoading(true);
    const res = await axios.put<OriginResponse>(`/api/origin`, {
      username,
      originId,
    });

    console.log(res.data);

    if (res.data.success === undefined) {
      setLoading(false);
      return setErrors(res.data.issues);
    }

    setSelected(false);
    setSuccess(true);
    setLoading(false);
    setErrors(undefined);
  };

  if (selected) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginTop: "2rem", display: "flex", gap: ".5rem" }}>
          <div style={{ height: "100%" }}>
            <MCUsername
              debouncedChange={handleChange}
              errorMessage={<></>}
              style={{ width: "400px", height: "48px" }}
              disabled={loading}
            />
          </div>
          <Button disabled={loading ?? !isValid} onClick={handleSet} style={{ height: "24px" }}>
            Set
          </Button>
        </div>
        {errors ? <p style={{ color: "#ff5555" }}>{errors.map((error) => error.message).join(", ")}</p> : <></>}
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <Button onClick={handleSelect}>Use This Origin</Button>
      {success && <p>Successfully set origin.</p>}
    </div>
  );
};

export default SetOrigin;
