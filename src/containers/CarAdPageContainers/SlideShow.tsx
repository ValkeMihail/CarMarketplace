
import { faArrowLeft, faArrowRight, faExpand, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type SlideShowProps = {
  carDoc: {
    images: string[];
  }
};


export function SlideShow({
  carDoc,
}: SlideShowProps) {

  const maxSlide = carDoc.images.length - 1;
  const [curSlide, setCurSlide] = useState(0);
  const [isfullScreen, setFullScreen] = useState(false);


  const prevSlide = () => {
    setCurSlide(curSlide === 0 ? maxSlide : curSlide - 1);
  };

  const nextSlide = () => {
    setCurSlide(curSlide === maxSlide ? 0 : curSlide + 1);
  };

  const slideStyle = (index: number) => {
    const position = 100 * (index - curSlide);
    return { transform: `translateX(${position}%)` };
  };




  return (
    <div className={isfullScreen ? "imageContainer fullScreenImageCont" : "imageContainer"}>
      <div className="slider">
        {carDoc?.images.map((imageURL: string, index: number) => <div className="slide" key={index} style={slideStyle(index)}>
            <img src={imageURL} alt="car" />
          </div>)}

        <button onClick={nextSlide} className="btn btn-next">
          <FontAwesomeIcon icon={faArrowRight} className="fontAwesomeIcon" />
        </button>
        <button onClick={prevSlide} className="btn btn-prev">
          <FontAwesomeIcon icon={faArrowLeft} className="fontAwesomeIcon" />
        </button>
      </div>
      {isfullScreen ? <div className="close-FullScreen-btn" onClick={() => setFullScreen(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </div> : <div className="fullScreen-enter" onClick={() => setFullScreen(true)}>
          <FontAwesomeIcon icon={faExpand} />
        </div>}
    </div>
  );
}
  