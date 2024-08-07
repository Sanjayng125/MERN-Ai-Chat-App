import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex items-center gap-24 h-full max-lg:flex-col max-lg:gap-0 overflow-hidden relative">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent max-xl:text-6xl">
          MERN AI
        </h1>
        <h4 className="text-xs max-w-[70%] max-lg:w-full">
          by{" "}
          <a
            href="https://www.youtube.com/@LamaDev"
            target="_blank"
            className="hover:underline hover:text-blue-600"
          >
            Lama Dev
          </a>
          . Improved (Responsiveness) by{" "}
          <a
            href="https://github.com/Sanjayng125"
            target="_blank"
            className="hover:underline hover:text-blue-600"
          >
            Me
          </a>
        </h4>
        <h2 className="text-xl font-semibold">
          Supercharge your creativity and productivity
        </h2>
        <h3 className="font-normal max-w-[70%] max-lg:w-full">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rerum minima
          delectus illum qui excepturi sunt adipisci mollitia ea quis.
        </h3>
        <Link
          to={"/dashboard"}
          className="py-3 px-6 bg-blue-600 text-white rounded-2xl text-sm mt-5 hover:bg-white hover:text-blue-600 font-semibold"
        >
          Get Started
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img
          src="/logo.png"
          alt=""
          className="w-3/5 object-contain animate-pulse"
        />
      </div>
    </div>
  );
};

export default HomePage;
