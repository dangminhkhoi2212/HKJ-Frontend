import Logo from "@/components/logo";
import SignInForm from "./SignInForm";

const SignInRight = () => {
  return (
    <div className="col-span-1 px-5 bg-white/50 w-full">
      <div className="m-10">
        <h1 className="text-2xl font-bold my-2">Đăng nhập</h1>

        <SignInForm className="" />
      </div>
    </div>
  );
};

export default SignInRight;
