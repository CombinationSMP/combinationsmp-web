"use client";

import { pbAuth } from "@/atoms";
import pb from "@/pb";
import { Collections } from "@/types";
import { Button, Container, TextField, Typography } from "@mui/material";
import { type NextPage } from "next";
import { useRouter } from "next/navigation";
import { type ChangeEventHandler, type FormEventHandler, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth] = useRecoilState(pbAuth);

  useEffect(() => {
    if (auth.token) {
      router.push("/admin");
    }
  }, [auth, router]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    try {
      await pb.collection(Collections.Admins).authWithPassword(email, password);
      router.push("/admin");
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };

  const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setEmail(evt.target.value);
  };

  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setPassword(evt.target.value);
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" component="h1">
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
          <TextField
            disabled={loading}
            required
            variant="filled"
            label="Email"
            type="email"
            onChange={handleEmailChange}
          />
          <TextField
            disabled={loading}
            inputProps={{ minLength: 5 }}
            required
            variant="filled"
            label="Password"
            type="password"
            onChange={handlePasswordChange}
          />
          <Button type="submit" sx={{ alignSelf: "flex-end" }} variant="contained" disabled={loading}>
            Login
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default Login;
