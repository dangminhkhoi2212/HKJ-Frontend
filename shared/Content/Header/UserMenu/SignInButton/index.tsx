import { Button } from "antd";
import { signIn } from "next-auth/react";
import React from "react";

const SignInButton = () => {
  return (
    <Button type="primary" onClick={() => signIn("keycloak")}>
      Sign in
    </Button>
  );
};

export default SignInButton;
