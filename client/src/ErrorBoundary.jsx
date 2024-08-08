import { useEffect } from "react";
import { Link, useNavigate, useRouteError } from "react-router-dom";

export default function ErrorBoundary({ children }) {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      if (
        error?.error?.message?.includes("/sign-in/sso-callback") ||
        error?.message?.includes("/sign-in/sso-callback")
      ) {
        navigate("/sign-up", { replace: true });
      }
    }
  }, [error, navigate]);

  if (
    error &&
    !(
      error?.error?.message?.includes("/sign-in/sso-callback") ||
      error?.message?.includes("/sign-in/sso-callback")
    )
  ) {
    return (
      <div className="flex flex-col items-center justify-normal">
        <h1 className="text-xl text-center">Something went wrong!</h1>
        <div className="flex items-center justify-center gap-2">
          <Link to={"/sign-in"} className="hover:underline">
            Sign In
          </Link>
          <Link to={"/sign-up"} className="hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    );
  } else {
    <div className="flex flex-col items-center justify-normal">
      <h1 className="text-xl text-center">
        Account not found! please sign up...
      </h1>
      <div className="flex items-center justify-center gap-2">
        <Link to={"/sign-in"} className="hover:underline">
          Sign In
        </Link>
        <Link to={"/sign-up"} className="hover:underline">
          Sign Up
        </Link>
      </div>
    </div>;
  }
  return children;
}
