/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";

//next button
const Next = ({onClick}) => {
  return (
    <div className="absolute z-10 top-0 right-0 bg-[rgb(0,0,0,0.5)] rounded h-[inherit]">
      <button className="w-[3em] xl:w-[5em] h-[100%]" onClick={onClick}><img src='/images/left-arrow.svg' className="rotate-180" /></button>
    </div>
  );
};

//previous button
const Prev = ({onClick}) => {
  return (
    <div className="absolute z-10 top-0 left-0 bg-[rgb(0,0,0,0.5)] rounded h-[inherit]">
      <button className="w-[3em] xl:w-[5em] h-[100%]" onClick={onClick}><img src='/images/left-arrow.svg' /></button>
    </div>
  );
};

//scroll items
const ScrollItem = ({ src, bg, classes }) => {
  return (
    <div
      className={`${classes} relative overflow-hidden rounded-md h-[100%] bg-[orange] flex-none w-[calc((100%/4)-1%)] lg:w-[calc((100%/6)-1%)]`}
    >
      <div className="absolute top-[10px] left-[10px]">
        <img src={src} className="w-[5%]" />
      </div>
      <div className="relative flex justify-center font-bold text-[5em] items-center h-[inherit]">
        {bg}
      </div>
    </div>
  );
};

//scroll indicator
const Span = ({ id, bgSpan }) => {
  return (
    <span
      className={`${
        bgSpan[id] || "bg-[rgb(60,60,60)]"
      } rounded w-[1em] h-[3px] transition-all duration-[0.4s] ease-in-out`}
    ></span>
  );
};

//scroll component
const ScrollNav = ({ data }) => {
  const { dvWidth, isPC } = useSelector((state) => state.dvWidth);
  const [list] = useState([...data[0].movies]);
  // const [count,setCount] = useState(0)
  const [count,setCount] = useState(`${isPC?5:3}`*1)
  // const [dynaList,setDynaList] = useState([...data[0].movies])
  const [children, setChildren] = useState([]);
  const [bgSpan, setBgSpan] = useState(null);
  const scrollRef = useRef();
  

  useEffect(() => {
    const movieList = [...data[0].movies];
    const scrollChildren = [];

    movieList.forEach((item, index) =>
      index * 1 < movieList.length / `${isPC ? 6 : 4}`
        ? `${
            isPC && index === 0
              ? scrollChildren.push(5)
              : isPC
              ? scrollChildren.push(scrollChildren[index - 1] + 6)
              : !isPC && index === 0
              ? scrollChildren.push(3)
              : scrollChildren.push(scrollChildren[index - 1] + 4)
          }`
        : null
    );

    setChildren([...scrollChildren]);
    setBgSpan({
      [`${data[0]._id}_id_${scrollChildren[0]}`]: "bg-[rgb(160,160,160)]"
    });
  }, []);

  console.log(count,"scrollNav")

  const nextHandler = ()=>{
//handle next button
isPC?scrollRef.current.children[count+6].scrollIntoView({behavior:"smooth", block:"start"}):scrollRef.current.children[count+4].scrollIntoView({behavior:"smooth",block:"start"})
isPC?setCount((prev)=> prev + 6):setCount((prev)=> prev + 4)
  }



  const prevHandler = ()=>{
//handle prev button
scrollRef.current.scrollTo({behavior:"smooth", left:`${scrollRef.current.scrollLeft - dvWidth}` * 1})
if(isPC){
  if(count-6 < 0){
    setCount(5);
    return;
  }
  setCount((prev)=> prev - 6)
}else{
  if(count-4 < 0){
    setCount(3);
    return;
  }
  setCount((prev)=> prev - 4)
}
// isPC?setCount((prev)=> prev - 6):setCount((prev)=> prev - 4)

  }


//handle scroll event start
  const scrollHandler = () => {
    //add every scroll child divisor to a list
    children.forEach((item) => {
      var nthChild = document.getElementsByClassName(
        `${data[0]._id}_id_${item}`
      );
      //update the proper span indicator for every child divisor that comes into view
      for(var child of nthChild){
        var position = child.getBoundingClientRect().right * 1 - 2  ;
        if(position > 0 && position < dvWidth * 1){
          setBgSpan((prev)=> ({...prev, [`${data[0]._id}_id_${item}`]:"bg-[rgb(160,160,160)]"}));
          break;
        }else{
          setBgSpan((prev)=> ({...prev, [`${data[0]._id}_id_${item}`]:"bg-[rgb(60,60,60)]"}))
        }
      
      }
    });

    //add first and last scroll children to variables
    var lastChild =
      scrollRef.current.lastChild.getBoundingClientRect().right * 1 - 1;
    var firstChild =
      scrollRef.current.firstChild.getBoundingClientRect().left * 1 + 1;
    //make scroll continuous when scroll reaches last item
    if (lastChild < dvWidth * 1) {
      list.splice(list.length, 0, ...list.slice(0, 12));
    }
    //make scroll continuous when scroll reaches first item
    if (firstChild > 0){
      console.log('first child')
      // list.splice(0, 0, ...list.slice(0, 12));
      // setList([...list.slice(`${isPC?-6:-4}`),...list.slice(0,`${isPC?-6:-4}`)])
      // setList((prev)=> [...prev.slice(`${isPC?-6:-4}`),...prev.slice(0,`${isPC?-6:-4}`)])

      // setList((prev)=> [...prev.slice(-12),...prev.slice(0)])
    }

  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <p className="mb-2 font-bold px-5 md:px-10 xl:px-[4em] lg:text-xl">
          {data[0].title}
        </p>
        <div className="flex flex-row gap-2 px-5 items-end py-2">
          {
            //scroll indicator
            children.map((item) => (
              <Span
                key={item}
                id={`${data[0]._id}_id_${item}`}
                bgSpan={bgSpan}
              />
            ))
          }
        </div>
      </div>

      <div className="relative h-[8em] lg:h-[6em] xl:h-[8em]">
        {
        <>
        <Next onClick={nextHandler} />
        <Prev onClick={prevHandler} />
        </>
        }

        <div
          ref={scrollRef}
          onScroll={scrollHandler}
          id="scrollNav"
          className="flex relative flex-row gap-[1%] lg:gap-[1%] h-[100%] w-[auto] w-[100%] overflow-scroll"
        >
          {list.map((item,index) => (
            <ScrollItem
              key={index}
              classes={`${data[0]._id}_id_${item.id}`}
              src={item.logo}
              bg={item.bg}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ScrollNav;
