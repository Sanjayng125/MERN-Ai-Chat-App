import React, { useRef } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import { FaPaperclip } from "react-icons/fa";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;
const server = import.meta.env.VITE_SERVER_URL;

const authenticator = async () => {
  try {
    const response = await fetch(`${server}/api/upload`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setImage }) => {
  const uploadRef = useRef(null);

  const onError = (err) => {
    console.log("Error", err);
    setImage((prev) => ({ ...prev, isLoding: false }));
  };

  const onSuccess = (res) => {
    setImage((prev) => ({ ...prev, isLoding: false, dbData: res }));
  };

  // const onUploadProgress = (progress) => {
  //   console.log("Progress", progress);
  // };

  const onUploadStart = (evt) => {
    const file = evt?.target?.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage((prev) => ({
        ...prev,
        isLoding: true,
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="file.jpg"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        // onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={uploadRef}
      />
      {
        <label
          onClick={() => uploadRef.current.click()}
          className="rounded-full bg-[#605e68] border-none p-2 flex items-center justify-center cursor-pointer"
        >
          <FaPaperclip className="-rotate-45" />
        </label>
      }
    </IKContext>
  );
};

export default Upload;
