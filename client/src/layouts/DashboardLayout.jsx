import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ChatList from "../components/ChatList";
import { useStore } from "../context/ZustandStore";
import { useAuth } from "@clerk/clerk-react";

const DashboardLayout = () => {
  const { showSideBar } = useStore();
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex w-full h-full bg-slate-800 relative">
      <div
        className={`h-full bg-slate-900 z-10 transition duration-500 overflow-hidden md:w-fit max-md:absolute max-md:top-0 max-md:left-0 ${
          showSideBar
            ? "max-md:translate-x-0 max-md:border-r"
            : "max-md:-translate-x-full"
        }`}
      >
        <ChatList />
      </div>
      <div className="w-full md:flex-[4] my-2">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
