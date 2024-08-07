import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_SERVER_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      }).then((res) => res.json());
    },
    onSuccess: (chatId) => {
      queryClient.invalidateQueries({ queryKey: ["userchats"] });
      navigate(`/dashboard/chats/${chatId}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target?.text?.value;

    if (!text || text?.trim().length === 0) {
      return;
    }

    mutation.mutate(text);
  };

  return (
    <div className="dashboardPage h-full flex flex-col items-center">
      <div className="texts flex-1 flex flex-col items-center justify-center w-2/4 gap-12">
        <div className="logo flex items-center gap-5 opacity-20">
          <img src="/logo.png" alt="" className="w-16 h-16" />
          <h1 className="text-[64px] font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Mern AI
          </h1>
        </div>
        <div className="options flex w-full items-center justify-between gap-12">
          <div className="option border border-[#555] rounded-[20px] flex-1 flex flex-col gap-2 font-light text-sm p-5">
            <img src="/chat.png" alt="" className="w-10 h-10 object-cover" />
            <span>Create a new chat</span>
          </div>
          <div className="option border border-[#555] rounded-[20px] flex-1 flex flex-col gap-2 font-light text-sm p-5">
            <img src="/image.png" alt="" className="w-10 h-10 object-cover" />
            <span>Analize Images</span>
          </div>
          <div className="option border border-[#555] rounded-[20px] flex-1 flex flex-col gap-2 font-light text-sm p-5">
            <img src="/code.png" alt="" className="w-10 h-10 object-cover" />
            <span>Help me with my code</span>
          </div>
        </div>
      </div>
      <div className="formContainer mt-auto w-2/4 bg-[#2c2937] rounded-[20px] flex">
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex items-center justify-between gap-5 mb-3"
        >
          <input
            type="text"
            placeholder="Aske me anything..."
            name="text"
            autoComplete="off"
            className="flex-1 p-5 bg-transparent border-none outline-none"
          />
          <button className="bg-[#605e68] rounded-full border-none cursor-pointer p-2 flex items-center justify-center mr-5">
            <img src="/arrow.png" alt="" className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
