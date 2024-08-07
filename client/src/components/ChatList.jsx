import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";

const ChatList = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["userchats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_SERVER_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="w-full h-full flex flex-col px-2">
      <h1 className="font-semibold">DASHBOARD</h1>
      <Link to={"/dashboard"} className="hover:bg-[#656174] p-2 rounded-md">
        Create a new chat
      </Link>
      <Link to={"/"} className="hover:bg-[#656174] p-2 rounded-md">
        Explore Mern AI
      </Link>
      <Link to={"/"} className="hover:bg-[#656174] p-2 rounded-md">
        Contact
      </Link>
      <hr className="border-none h-[2px] bg-slate-200 opacity-10 rounded-md my-5" />
      <span className="title font-semibold mb-2">RECENT CHATS</span>
      <div className="flex flex-col overflow-y-auto">
        {isPending
          ? "Loading..."
          : data?.map((chat) => (
              <Link
                to={`/dashboard/c/${chat._id}`}
                key={chat._id}
                className="p-2 rounded-lg hover:bg-[#2c2937]"
              >
                {chat.title}
              </Link>
            ))}
      </div>
      <hr className="border-none h-[2px] bg-slate-200 opacity-10 rounded-md my-5" />
      <div className="upgrade mt-auto flex items-center gap-2 text-xs mb-5">
        <FaRobot className="text-3xl" />
        <div className="texts flex flex-col">
          <span className="title font-semibold">Upgrade to Mern AI Pro</span>
          <span className="text-[#888]">
            Get unlimited access to all Mern AI features
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
