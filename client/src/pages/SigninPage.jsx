import { SignIn } from "@clerk/clerk-react";
import React from "react";

const SigninPage = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <SignIn
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl={"/dashboard"}
      />
    </div>
  );
};

export default SigninPage;
