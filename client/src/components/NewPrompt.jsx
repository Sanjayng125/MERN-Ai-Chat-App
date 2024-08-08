import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { IKImage } from "imagekitio-react";
import MarkDown from "react-markdown";
import model from "../lib/Gemini";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Upload from "./Upload";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [image, setImage] = useState({
    isLoding: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  const messagesEndRef = useRef(null);
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const chat = model.startChat({
    history: [
      ...(data.history
        ? data?.history?.map(({ role, parts }) => ({
            role,
            parts: [{ text: parts[0].text }],
          }))
        : []),
    ],
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, image.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_SERVER_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          image: image.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef?.current?.reset();
          setQuestion("");
          setAnswer("");
          setImage({
            isLoding: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (prompt, isInitial = false) => {
    if (!isInitial) setQuestion(prompt);
    setLoading(true);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(image.aiData).length ? [image.aiData, prompt] : [prompt]
      );
      let streamingText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        streamingText += chunkText;
        setAnswer(streamingText);
      }

      mutation.mutate();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = e.target?.question?.value;

    if (!prompt || prompt?.trim().length === 0 || prompt?.trim() === "") {
      return;
    }

    if (!loading) {
      add(prompt);
    }
  };

  // IN PRODUCTION WE DON'T NEED THIS
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    if (data?.history?.length === 1) {
      add(data?.history[0]?.parts[0]?.text, true);
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {image?.isLoding && <div>Loading...</div>}
      {image?.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={image?.dbData?.filePath}
          width={400}
          transformation={[{ width: 400 }]}
        />
      )}
      {question && (
        <div className="message user bg-slate-900 rounded-[20px] max-w-[80%] self-end p-5 break-all">
          {question}
        </div>
      )}
      {answer && (
        <div className="message p-5 break-all">
          <MarkDown>{answer}</MarkDown>
        </div>
      )}
      <div ref={messagesEndRef} className="endChat"></div>
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="max-w-full sticky bottom-0 bg-slate-900 rounded-xl flex items-center justify-between gap-2 px-5 mt-auto"
      >
        <Upload setImage={setImage} />
        <input type="file" multiple={false} hidden id="file" />
        <input
          type="text"
          name="question"
          placeholder="Ask me anything..."
          autoComplete="off"
          className="w-full p-5 border-none outline-none bg-transparent text-[#ececec]"
        />
        <button className="w-max bg-[#605e68] rounded-full border-none cursor-pointer p-2 flex items-center justify-center">
          <FaArrowUp />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
