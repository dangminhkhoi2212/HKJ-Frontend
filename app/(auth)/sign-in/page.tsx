import React from "react";
import SignInLeft from "./ui/SignInLeft";
import SignInRight from "./ui/SignInRight";

const SignInPage = () => {
  return (
    <div className=" bg-cover bg-no-repeat w-8/12 h-3/4 drop-shadow-2xl  rounded-xl overflow-hidden grid grid-cols-2 gap-4 backdrop-blur-sm bg-white/40">
      <SignInLeft />
      <SignInRight />
    </div>
  );
};

export default SignInPage;
