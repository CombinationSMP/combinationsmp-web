import type { NextPage } from "next";

const Submitted: NextPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        backdropFilter: "brightness(80%)",
        width: "100%",
        height: "100%",
      }}
    >
      <h1>Your application has been submitted!</h1>
      <p>You can expect to hear back from us in a couple days.</p>
    </div>
  );
};

export default Submitted;
