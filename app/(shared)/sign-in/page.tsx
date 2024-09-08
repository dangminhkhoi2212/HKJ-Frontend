"use client";
import React from "react";
import { Button } from "antd";
import { signIn } from "next-auth/react";
import { routes } from "@/routes";
import { Diamond, Gem, BellRing, Star } from "lucide-react"; // Importing Lucide icons
import Logo from "@/shared/Logo";

const SignInPage: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={` flex items-center justify-center bg-gradient-to-b from-white to-gray-200 ${className} rounded-md`}
    >
      <div className="bg-white shadow-lg rounded-md p-10 w-full max-w-md text-center relative">
        {/* Jewelry Themed Background Icon */}
        <div className="absolute top-0 left-0 right-0 mx-auto -mt-12 w-24 h-24">
          <Diamond className="mx-auto w-16 h-16 text-gray-200 opacity-30" />
        </div>
        <div className="flex justify-center">
          <Logo />
        </div>
        {/* Inspiring Quote */}
        <div className="mt-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 italic">
            &quot;Sự sang trọng không phải là nổi bật mà là được ghi nhớ.&quot;
          </h2>
        </div>

        {/* Login Button */}
        <Button
          className="w-full bg-blue-600 text-white font-bold py-2  hover:bg-blue-700 transition duration-300"
          onClick={() => signIn("keycloak", { callbackUrl: routes.home })}
        >
          Đăng nhập
        </Button>

        {/* Decorative Icons */}
        <div className="flex justify-center mt-8 space-x-4">
          <Gem className="w-10 h-10 text-gray-400" />
          <BellRing className="w-10 h-10 text-gray-400" />
          <Star className="w-10 h-10 text-gray-400" />
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-gray-600 text-sm">
          <p>
            Khám phá sự sang trọng vượt thời gian của bộ sưu tập độc quyền của
            chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
