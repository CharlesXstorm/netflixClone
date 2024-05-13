/* eslint-disable react/prop-types */
// import React from 'react'
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import ItemModal from "./ItemModal";

//motionVariants
/////////////////////////////////////////////////////////////////////////////////////
const slideVariants = {
  right: {
    hidden: {
      opacity: 0.5,
      x: "100%"
    },
    visible: {
      opacity: 1,
      x: 0
    },
    exit: {
      opacity: 0.5,
      x: "-100%"
    }
  },
  left: {
    hidden: {
      opacity: 0.5,
      x: "-100%"
    },
    visible: {
      opacity: 1,
      x: 0
    },
    exit: {
      opacity: 0.5,
      x: "100%"
    }
  }
};

//next button Component
/////////////////////////////////////////////////////////////////////////////////////////////
const Next = ({setPage, viewLength, setDirection, setBgSpan }) => {
  const nextHandler = () => {
    setDirection("right");
    setPage((prev) => {
      if (prev === viewLength - 1) {
        setBgSpan({0:"bg-[rgb(160,160,160)]"})
        return 0;
      }
      setBgSpan({[`${prev+1}`]:"bg-[rgb(160,160,160)]"})
      return prev + 1;
    });
    
  };
  return (
    <div className="absolute z-10 top-0 right-0 bg-[rgb(0,0,0,0.5)] rounded h-[inherit]">
      <button className="w-[3em] xl:w-[5em] h-[100%]" onClick={nextHandler}>
        <img src="/images/left-arrow.svg" className="rotate-180" />
      </button>
    </div>
  );
};

//prev button Component
/////////////////////////////////////////////////////////////////////////////////////////
const Prev = ({ setPage, viewLength, setDirection,setBgSpan }) => {
  const prevHandler = () => {
    setDirection("left");
    setPage((prev) => {
      if (prev === 0) {
        setBgSpan({[`${viewLength - 1}`]:"bg-[rgb(160,160,160)]"})
        return viewLength - 1;
      }
      setBgSpan({[`${prev - 1}`]:"bg-[rgb(160,160,160)]"})
      return prev - 1;
    });
  };
  return (
    <div className="absolute z-10 top-0 left-0 bg-[rgb(0,0,0,0.5)] rounded h-[inherit]">
      <button className="w-[3em] xl:w-[5em] h-[100%]" onClick={prevHandler}>
        <img src="/images/left-arrow.svg" />
      </button>
    </div>
  );
};

//scroll indicator Component
///////////////////////////////////////////////////////////////////////////////////////
const Span = ({ id, bgSpan }) => {
  console.log(id, bgSpan[id]);
  return (
    <span
      className={`${bgSpan[id] || "bg-[rgb(60,60,60)]"} rounded w-[1em] h-[3px] transition-all duration-[0.4s] ease-in-out`}
    ></span>
  );
};

//scroll Item Component
////////////////////////////////////////////////////////////////////////////////
const ScrollItem = ({ src, bg }) => {
  const [hover, setHover] = useState(false);
  const [itemInfo, setItemInfo] = useState({})

  const mouseOverHandler = (e) => {
    setItemInfo({
      bottom: Math.floor(e.target.getBoundingClientRect().bottom),
      height: Math.floor(e.target.getBoundingClientRect().height),
      left: Math.floor(e.target.getBoundingClientRect().left),
      right: Math.floor(e.target.getBoundingClientRect().right),
      top: Math.floor(e.target.getBoundingClientRect().top),
      width: Math.floor(e.target.getBoundingClientRect().width),
      x: e.target.getBoundingClientRect().x,
      y: e.target.getBoundingClientRect().y,
    })
    setHover(true);
  };

  const mouseOutHandler = () => {
    setHover(false);
  };
  return (
    <div
      onMouseOver={mouseOverHandler}
      onMouseOut={mouseOutHandler}
      className={`relative rounded-md h-[100%] bg-[orange] flex-none w-[calc((100%/4)-1%)] lg:w-[calc((100%/6)-1%)] border `}
    >
      {/* <div className="w-[300px] h-[300px] absolute z-[30] top-0 left-0 bg-[white] border-[4px] border-[blue]"></div> */}
      {
      hover && (
        <ItemModal 
        onMouseOut={mouseOutHandler} 
        setHover={setHover}
        itemInfo={itemInfo}
        />
      )}
      <div className={`relative rounded-md h-[100%] bg-[orange] flex-none w-[100%]  border `}>
        <div className="absolute top-[10px] left-[10px]">
          <img src={src} className="w-[5%]" />
        </div>
        <div className="relative flex justify-center font-bold text-[5em] items-center h-[inherit]">
          {bg}
        </div>
      </div>

    </div>
  );
};

//scroll element Component
/////////////////////////////////////////////////////////////////////////////
const FramerScroll = ({ data }) => {
  const [list] = useState([...data[0].movies]);
  const [step, setStep] = useState(null);
  const [page, setPage] = useState(0);
  const [bgSpan,setBgSpan] = useState({0:"bg-[rgb(160,160,160)]"})
  const [direction, setDirection] = useState("right");

  const [children, setChildren] = useState([]);

  const { isPC } = useSelector((state) => state.dvWidth);

  useEffect(() => {
    if (isPC) {
      setStep(6);
    }
    if (!isPC) {
      setStep(4);
    }

    const scrollChildren = [];

    list.forEach((item, index) =>
      index * 1 < list.length / `${isPC ? 6 : 4}`
        ? `${
            isPC && index === 0
              ? scrollChildren.push(6)
              : isPC
              ? scrollChildren.push(scrollChildren[index - 1] + 6)
              : !isPC && index === 0
              ? scrollChildren.push(4)
              : scrollChildren.push(scrollChildren[index - 1] + 4)
          }`
        : null
    );

    setChildren([...scrollChildren]);
    setBgSpan({0:"bg-[rgb(160,160,160)]"})
    setPage(0);
  }, [isPC]);


  return (
    <div className="border w-[100%] mt-4 mb-4">
      <div className="flex flex-row justify-between">
        <p className="mb-2 font-bold px-5 md:px-10 xl:px-[4em] lg:text-xl">
          Title
        </p>
        <div className="flex flex-row gap-2 px-5 items-end py-2">
          {
            //scroll indicator
            children.map((item,index) => (
              <Span
                key={item}
                id={index}
                bgSpan={bgSpan}
              />
            ))
          }
        </div>
      </div>

      <div className="relative w-[inherit] h-[8em] lg:h-[6em] xl:h-[8em]">
        <Next
          setPage={setPage}
          viewLength={children.length}
          setDirection={setDirection}
          setBgSpan={setBgSpan}
        />
        <Prev
          setPage={setPage}
          viewLength={children.length}
          setDirection={setDirection}
          setBgSpan={setBgSpan}
        />

        <div className="flex flex-row w-[100%] h-[8em] lg:h-[6em] xl:h-[8em] border-[5px] border-green-600 overflow-x-clip overflow-y-visible">
          <AnimatePresence mode="wait">
            {children.map((item) => {
  
              return (
                step + (item - step) === children[page] && (
                  <motion.div
                  className="flex flex-row gap-[1%] lg:gap-[1%] w-[100%] h-[100%] justify-center items-center border-[6px] border-red-600"
                    key={item}
                    variants={slideVariants.direction}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "linear", duration: 0.1 }}
                    
                  >
                    {list.slice(item - step, item).map((item, index) => (
                      <ScrollItem
                        key={`${index}_${children[page]}`}
                        src={item.logo}
                        bg={item.bg}
                      />
                    ))}
                    {/* <div className="relative bg-[orange] w-[20%] h-[inherit] rounded ">

                    </div>
                    <div className="relative bg-[orange] w-[20%] h-[inherit] rounded ">
                    </div>
                    <div className="relative bg-[orange] w-[20%] h-[inherit] rounded ">
                      <div className="absolute z-[30] top-[4em] left-[1em] w-[16em] h-[16em] bg-green-500 rounded border-[4px]"></div>
                    </div>
                    <div className="relative bg-[orange] w-[20%] h-[inherit] rounded ">
                    </div>
                    <div className="relative bg-[orange] w-[20%] h-[inherit] rounded ">
                    </div>
                    <div className="relative bg-[orange] w-[20%] h-[inherit] rounded ">
                    </div> */}

                  </motion.div>
                )
              );
            })}
          </AnimatePresence>
        </div>

        </div>

    </div>
  );
};

export default FramerScroll;
