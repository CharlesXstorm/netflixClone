/* eslint-disable react/prop-types */
// import ReactDOM from 'react-dom'
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

//next button component /////////////////////////////////////////////////////////
const Next = ({ setCount, scrollRef, isPC, dvWidth }) => {
  const nextHandler = () => {
    scrollRef.current.scrollTo({
      behavior: "smooth",
      left: `${scrollRef.current.scrollLeft + dvWidth}` * 1
    });

    if (isPC) {
      setCount((prev) => prev + 6);
    } else {
      setCount((prev) => prev + 4);
    }
  };

  return (
    <div className="absolute z-10 top-0 right-0 bg-[rgb(0,0,0,0.5)] rounded h-[100%]">
      <button
        className="w-[3em] xl:w-[5em] h-[100%] flex justify-center items-center"
        onClick={nextHandler}
      >
        <img src="/images/left-arrow.svg" className="rotate-180 w-[1.5em]" />
      </button>
    </div>
  );
};

//previous button component //////////////////////////////////////////////////////
const Prev = ({ count, setCount, scrollRef, isPC, dvWidth }) => {
  const prevHandler = () => {
    //handle prev button
    scrollRef.current.scrollTo({
      behavior: "smooth",
      left: `${scrollRef.current.scrollLeft - dvWidth}` * 1
    });
    if (isPC) {
      if (count - 6 < 0) {
        setCount(5);
        return;
      }
      setCount((prev) => prev - 6);
    } else {
      if (count - 4 < 0) {
        setCount(3);
        return;
      }
      setCount((prev) => prev - 4);
    }
  };

  return (
    <div className="absolute z-10 top-0 left-0 bg-[rgb(0,0,0,0.5)] rounded h-[100%]">
      <button
        className="w-[3em] xl:w-[5em] h-[100%] flex justify-center items-center"
        onClick={prevHandler}
      >
        <img src="/images/left-arrow.svg" className="w-[1.5em]" />
      </button>
    </div>
  );
};

//scroll items component ///////////////////////////////////////////////////////////////////
const ScrollItem = ({ bg, classes, $id, groupType, movieType }) => {
  const [loaded, setLoaded] = useState(true);

  const navigate = useNavigate();
  const data = { groupType, movieType };

  const handleClick = () => {
    navigate(`/browse/${$id}`, { state: data });
  };
  return (
    <div
      id={$id}
      className={`${classes} relative rounded-md h-[13em] flex-none w-[calc((100%/3)-1%)] md:w-[calc((100%/4)-1%)] lg:w-[calc((100%/5)-1%)] overflow-hidden`}
    >
      {loaded && <Loader />}

      <div
        onClick={handleClick}
        className="relative flex justify-center font-bold text-[5em] items-center h-[inherit] overflow-clip"
      >
        <img
          src={
            bg
              ? `https://image.tmdb.org/t/p/w300/${bg}`
              : "/images/nullPoster.jpg"
          }
          className="w-[100%] absolute top-0 left-0"
          alt="bgImage"
          onLoad={() => setLoaded(false)}
        />
      </div>

      <div className="absolute top-[10px] left-[10px]">
        <img src={"images/LOGO_C.svg"} className="w-[5%]" />
      </div>
    </div>
  );
};

//scroll indicator component ////////////////////////////////////////////////////////////////
const Span = ({ id, bgSpan }) => {
  return (
    <span
      className={`${
        // bgSpan[id] ||
        "bg-[rgb(60,60,60)]"
      } rounded w-[1em] h-[3px] transition-all duration-[0.4s] ease-in-out`}
    ></span>
  );
};

//scroll Nav component /////////////////////////////////////////////////////////////////////////
const NavScroll = ({ data, position, $id, hover, setHover }) => {
  const { dvWidth, isPC } = useSelector((state) => state.dvWidth);
  const [list, setList] = useState();
  const [movieList, setMovieList] = useState();
  const [count, setCount] = useState(5);
  // const [count, setCount] = useState(`${isPC ? 5 : 2}` * 1);
  const [page, setPage] = useState(1);
  const [children, setChildren] = useState();
  const [bgSpan, setBgSpan] = useState(null);
  const [initScrollPos, setInitScrollPos] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(null);
  const [scrollID, setScrollID] = useState();
  const [scrollTimeOut, setScrollTimeOut] = useState(null);
  const scrollRef = useRef();

  // console.log('data',data.title,data)
  // console.log("initScrollPos", initScrollPos);

  useEffect(() => {
    if (data.movies) {
      setList([...data.movies]);
      setMovieList([...data.movies]);
      setChildren([...Array(Math.floor(data.movies.length / count)).keys()]);
      setScrollID(
        Array(data.movies.length)
          .fill(`scrollID_${$id}`)
          .map((item, ind) => `${item}_${ind}`)
      );
    }
  }, []);

  useEffect(() => {
    
    if(scrollDirection === 'left'){
      let viewElement = document.getElementById(scrollID[count+4])
      scrollRef.current.scrollTo({behavior: "smooth",
        left: `${viewElement.getBoundingClientRect().right}` * 1
      });
    }
    if(scrollDirection === 'right'){
      let viewElement = document.getElementById(scrollID[count-5])
      scrollRef.current.scrollTo({behavior: "smooth",
        left: `${viewElement.getBoundingClientRect().left}` * 1
      });
    }
   
  },[scrollDirection])

  const scrollHandler = () => {

    if (scrollTimeOut != null) {
      clearTimeout(scrollTimeOut);
      setScrollTimeOut(null);
    }

    let viewElement = document.getElementById(scrollID[count+4])
    if(scrollRef.current.scrollLeft*1 >= (Math.floor(viewElement.getBoundingClientRect().right*1)-20) ){
        console.log('scrollEnded')
        setScrollDirection(null)
      }

    if (initScrollPos < scrollRef.current.scrollLeft) {
      setScrollDirection("left");
    } else {
      setScrollDirection("right");
    }

    const timeOutId = setTimeout(() => {
      setInitScrollPos(scrollRef.current.scrollLeft);
    }, 150);

    setScrollTimeOut(timeOutId);
  };

 

  if (data.movies) {
    return (
      <>
        {movieList && children && scrollID && (
          <div
            className={`${position || "relative"} w-full ${
              $id === 0 ? "pt-6" : ""
            }`}
          >
            <div className="flex flex-row justify-between">
              <p className="mb-2 font-bold px-5 md:px-10 xl:px-[4em] md:text-xl">
                {data.title}
              </p>
              <div className="flex flex-row gap-2 px-5 items-end py-2">
                {
                  //scroll indicator
                  children.map((item) => (
                    <Span
                      key={item}
                      // id={`${data._id}_${$id}_${movieList[item].id}`}
                      bgSpan={bgSpan}
                    />
                  ))
                }
              </div>
            </div>

            <div className="relative">
              {
                <>
                  <Next
                    count={count}
                    setCount={setCount}
                    scrollRef={scrollRef}
                    isPC={isPC}
                    dvWidth={dvWidth}
                  />
                  <Prev
                    count={count}
                    setCount={setCount}
                    scrollRef={scrollRef}
                    isPC={isPC}
                    dvWidth={dvWidth}
                  />
                </>
              }

              <div
                ref={scrollRef}
                onScroll={scrollHandler}
                id="scrollNav"
                className="flex relative flex-row gap-[1%] lg:gap-[1%] h-[100%] w-[auto] w-[100%] overflow-scroll"
              >
                {list.map((item, index) => (
                  <ScrollItem
                    key={index}
                    $id={scrollID[index]}
                    groupType={data.type}
                    movieType={item["media_type"]}
                    // classes={`${data._id}_${$id}_${item.id}`}
                    src={"item.logo"}
                    bg={item["poster_path"]}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <div
        className={`${position || "relative"} w-full ${
          $id === 0 ? "pt-6" : ""
        }`}
      >
        <div className="flex flex-row justify-between">
          <p className="mb-2 font-bold px-5 md:px-10 xl:px-[4em] md:text-xl">
            {data.title}
          </p>
        </div>

        <div className="flex item-center justify-center bg-[rgb(120,120,120,0.5)] relative h-[12em] md:h-[20em] lg:h-[6em] xl:h-[10em] w-full">
          <p className="flex items-center text-lg lg:text-xl font-bold">
            Add movies to your list to see them here
          </p>
        </div>
      </div>
    );
  }
};

export default NavScroll;