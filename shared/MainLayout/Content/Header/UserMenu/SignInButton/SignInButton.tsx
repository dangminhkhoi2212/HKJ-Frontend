import { Button } from "antd";
import { signIn } from "next-auth/react";

type Props = {};
const SignInButton: React.FC<Props> = () => {
  return (
    <Button type="primary" onClick={() => signIn("keycloak")}>
      Sign in
    </Button>
  );
};

export default SignInButton;
