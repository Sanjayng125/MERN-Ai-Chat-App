import React from "react";
import NewPrompt from "../components/NewPrompt";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { data, isPending, error } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_SERVER_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="w-full h-full flex flex-col items-center relative p-5 overflow-x-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full flex justify-center px-2">
        <div className="w-full flex flex-col gap-5">
          {isPending ? (
            <div className="flex justify-center items-center text-2xl font-semibold">
              Loading...
            </div>
          ) : (
            data?.history?.map((message, i) => (
              <div key={i} className="w-full flex flex-col">
                {message?.image && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.image}
                    height={"300"}
                    width={"400"}
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                  />
                )}
                <div
                  className={
                    message?.role === "user"
                      ? "message user bg-slate-900 rounded-[20px] max-w-[80%] self-end p-5"
                      : "message p-5"
                  }
                  key={i}
                >
                  <Markdown>{message?.parts[0]?.text}</Markdown>
                </div>
              </div>
            ))
          )}
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
