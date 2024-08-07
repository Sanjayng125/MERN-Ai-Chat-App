import { SignUp } from "@clerk/clerk-react";
import React from "react";

const SignupPage = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <SignUp path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
};

export default SignupPage;
