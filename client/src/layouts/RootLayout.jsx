import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaBars, FaRobot } from "react-icons/fa";
import { useStore } from "../context/ZustandStore";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

const RootLayout = () => {
  const { showSideBar, setShowSideBar } = useStore();
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <div className="w-full h-screen flex flex-col p-3 md:py-4 md:px-10 bg-slate-900 text-white">
          <header className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
              <button
                className="bg-slate-800 p-2 rounded-md md:hidden"
                onClick={() => setShowSideBar(!showSideBar)}
              >
                <FaBars />
              </button>
              <Link
                to="/"
                className="flex gap-2 items-center justify-center text-xl"
              >
                <FaRobot className="text-4xl" />
                <h1 className="font-bold">MERN AI</h1>
              </Link>
            </div>
            <div>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main className="h-full overflow-hidden">
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
