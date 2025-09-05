import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Canvas from "./components/canvas";
import data from "./data";
import LocomotiveScroll from "locomotive-scroll";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function App() {
  const cursorRef = useRef(null);
  const cursorPointRef = useRef(null);
  const titleRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false); // Track hover state
  const [isDark, setIsDark] = useState(false);
  const [isRed, setIsRed] = useState(false);
  const audioBtnRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlay, setIsPlay] = useState(false);
  const isFlagRef = useRef(0); // new ref to track the actual latest flag

  const themeChange = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      document.documentElement.classList.toggle("dark", newTheme);
      return newTheme;
    });
  };

  const activeRed = () => {
    setIsRed((prev) => {
      const newTheme = !prev;
      document.documentElement.classList.remove("dark", newTheme);
      document.body.classList.toggle("red", newTheme);
      return newTheme;
    });
  };

  useGSAP(() => {
    gsap.from(".char", {
      opacity: 0,
      y: 200,
      duration: 0.3,
      ease: "sine",
      stagger: 0.05,
    });
  });

  const handleMouseMove = (e) => {
    if (
      titleRef.current.offsetTop <= e.clientY + window.scrollY &&
      titleRef.current.offsetTop + titleRef.current.offsetHeight >=
        e.clientY + window.scrollY
    ) {
      console.log(titleRef.current.offsetTop);
      handleTitleMouseEnter();
    } else {
      handleTitleMouseLeave();
    }
    let height = cursorPointRef.current.offsetHeight;
    let width = cursorPointRef.current.offsetWidth;
    gsap.to(cursorRef.current, {
      x: e.clientX + window.scrollX - width / 2,
      y: e.clientY + window.scrollY - height / 2,
      duration: 1,
      ease: "power3.out",
    });
  };

  const handleTitleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleTitleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleAudio = (e) => {
    isFlagRef.current = 1
    e.stopPropagation();
    if (audioRef.current.paused) {
      setIsPlay(true);
      audioRef.current.play();
    } else {
      setIsPlay(false);
      audioRef.current.pause();
    }
  };

  const clickHandler = () => {
    if (isFlagRef.current === 0) {
        isFlagRef.current = 1;
        if (audioRef.current.paused) {
          setIsPlay(true);
          audioRef.current.play();
        }
    }
  };

  useEffect(() => {
    const locomotiveScroll = new LocomotiveScroll();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", clickHandler);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", clickHandler);

      if (locomotiveScroll.destroy) {
        locomotiveScroll.destroy();
      }
    };
  }, []);
  return (
    <>
      <div
        ref={cursorRef}
        className="cursor pointer-events-none inline-flex gap-1 items-center absolute top-0 left-0 z-[10] text-red-500 uppercase text-[12px] font-[PPNeueMontreal-Medium]"
      >
        <div
          ref={cursorPointRef}
          className={`cursor pointer-events-none rounded-full before:content before:h-full before:w-full before:absolute before:top-1/2 before:left-1/2 before:-translate-1/2 before:bg-[url(./pepper.png)] before:bg-center before:bg-no-repeat before:bg-cover transition-all duration-300 ease-linear 
                ${isHovering ? "h-20 w-20" : "h-5 w-5 before:hidden"}
                ${isRed ? "bg-white" : "bg-red-500"}
            `}
        ></div>
        { isFlagRef.current || isHovering ? "" : "Click for sound"}
      </div>
      <div className="w-full relative">
        {/* this will load all arrays from data */}
        {/* {data.map((item, index) => (
          <div key={index}>
            {item.map((canvas, index) => (
              <Canvas details={canvas} />
            ))}
          </div>
        ))} */}

        {data[0].map((canvas, index) => (
          <Canvas key={index} details={canvas} redprop={isRed} />
        ))}

        <div className="w-full px-2">
          <nav
            className={`w-full py-3 flex items-center border-b border-gray-100 dark:border-gray-800/80 
                    ${isRed ? "border-gray-800/10" : ""}
           `}
          >
            <div className="logo-wrap pr-4 basis-1/4">
              <a href="#" className="brand text-sm">
                Thirtysixstudios
              </a>
            </div>
            <div className="toggle-switch basis-1/3">
              <button
                className="cursor-pointer text-sm border px-1.5 rounded-2xl"
                onClick={themeChange}
              >
                Theme
              </button>
            </div>
            <ul className="links flex gap-10 basis-1/3">
              {[
                "What we do",
                "Who we are",
                "How we give back",
                "Talk to us",
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    title={link}
                    className="text-sm hover:text-gray-500 dark:hover:text-gray-300 transition-all duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            <div className="audio-wrapper relative flex-1">
              <div className="video-control-btn text-right">
                <button
                  className="cursor-pointer h-8 w-8 audio-btn rounded-full border border-black dark:border-white p-2"
                  ref={audioBtnRef}
                  onClick={handleAudio}
                  title={`${isPlay ? "Pause Sound" : "Play Sound"}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`pause-icon fill-black dark:fill-white ${
                      isPlay ? "hidden" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12Z"
                        fill="inherit"
                      ></path>{" "}
                      <path
                        d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                        fill="inherit"
                      ></path>{" "}
                      <path
                        d="M21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z"
                        fill="inherit"
                      ></path>{" "}
                    </g>
                  </svg>
                  <svg
                    className={`play-icon fill-black dark:fill-white ${
                      isPlay ? "" : "hidden"
                    }`}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M13,4V20a1,1,0,0,1-2,0V4a1,1,0,0,1,2,0ZM8,5A1,1,0,0,0,7,6V18a1,1,0,0,0,2,0V6A1,1,0,0,0,8,5ZM4,7A1,1,0,0,0,3,8v8a1,1,0,0,0,2,0V8A1,1,0,0,0,4,7ZM16,5a1,1,0,0,0-1,1V18a1,1,0,0,0,2,0V6A1,1,0,0,0,16,5Zm4,2a1,1,0,0,0-1,1v8a1,1,0,0,0,2,0V8A1,1,0,0,0,20,7Z"></path>
                    </g>
                  </svg>
                </button>
              </div>
              <audio
                loop
                id="bg-music"
                className="bg-music absolute"
                ref={audioRef}
              >
                <source
                  src={`${ isRed ? "https://thirtysixstudio.com/audio/world2.mp3" : "https://thirtysixstudio.com/audio/world1.mp3"}`}
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          </nav>
          <div className="text-container relative px-[25.5%] py-6 mb-[18vh] mt-6">
            <div className="text-content">
              <h3 className="text-[34px] w-[45%] font-normal mb-6 leading-[1.075]">
                At Thirtysixstudio, we build digital assets and immersive
                experiences for purposeful brands.
              </h3>
              <p className="text-[15px] w-[52%] leading-tight">
                We're a boutique production studio focused on design, animation,
                and technology, constantly rethinking what digital craft can do
                for present-day ads and campaigns.
              </p>
              <p className="text-md mt-8">Scroll</p>
            </div>
            <div className="rotate-text-wrap absolute top-[35%] -translate-x-[50%] right-[20vw]">
              <div className="rotate-text inline-block origin-center tracking-[0.6px]">
                <svg width="180" height="180">
                  <path
                    id="curve"
                    d="M 20 90 A 70 70 0 1 1 20 91"
                    className="fill-transparent"
                  ></path>
                  <text className="text text-sm uppercase font-[PPNeueMontreal-Medium]">
                    <textPath
                      className="fill-black dark:fill-white"
                      href="#curve"
                    >
                      ThirtySixStudio -- for all things digital production --
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
          <div
            ref={titleRef}
            className="title-wrap text-center overflow-hidden"
            onClick={activeRed}
          >
            <span className="char-wrap inline-block text-[15.5vw] leading-tight">
              <span className="char inline-block">T</span>
              <span className="char inline-block">h</span>
              <span className="char inline-block">i</span>
              <span className="char inline-block">r</span>
              <span className="char inline-block">t</span>
              <span className="char inline-block">y</span>
              <span className="char inline-block">s</span>
              <span className="char inline-block">i</span>
              <span className="char inline-block">x</span>
              <span className="char inline-block">s</span>
              <span className="char inline-block">t</span>
              <span className="char inline-block">u</span>
              <span className="char inline-block">d</span>
              <span className="char inline-block">i</span>
              <span className="char inline-block">o</span>
            </span>
          </div>
        </div>
      </div>
      {/* <div className="w-full relative min-h-screen text-white">
        {data[1].map((canvas, index) => (
          <Canvas key={index} details={canvas} />
        ))}
      </div>
      <div className="w-full relative min-h-screen text-white">
        {data[2].map((canvas, index) => (
          <Canvas key={index} details={canvas} />
        ))}
      </div> */}
    </>
  );
}

export default App;
