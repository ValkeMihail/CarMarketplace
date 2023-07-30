import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import tagsSVG from "../../assets/tag.svg";
import user_default from "../../assets/user_default.svg";

import { Car } from "../../../types";
import { AuthContext } from "../../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEuroSign,
  faExpand,
  faHeart,
  faLocationDot,
  faMessage,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { showToolTip } from "../Navigation/Footer";
import { createChat } from "../../Helpers";

import {
  getDoc,
  doc,
  db,
  getDocs,
  collection,
  arrayRemove,
  updateDoc,
  auth,
  arrayUnion,
} from "../../firebase";

export const CarAd = () => {
  const { user, setUSER } = useContext(AuthContext);
  const { carID } = useParams<{ carID: string }>();
  const [carAd, setCarAd] = useState<any>(null);
  const navigate = useNavigate();
  const [curSlide, setCurSlide] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);
  const [isfullScreen, setFullScreen] = useState(false);

  const messageUser = async (recipientId: string) => {
    const chatId: string = await createChat(
      recipientId,
      `${window.location.origin}/ad/${carID}`,
      carAd?.images[0]
    );
    if (chatId != "") {
      navigate(`/chats/chat/${chatId}`);
    } else {
      showToolTip("Error creating chat", "red");
    }
  };

  useEffect(() => {
    const CarsRef = collection(db, "cars");

    const getCarFromDB = async () => {
      const carDoc = await getDoc(doc(CarsRef, carID));
      if (carDoc.exists()) {
        const carData = carDoc.data() as Car;
        const updatedCarData = {
          ...carData,
          id: carID,
          userPhoto: (await getUserPhoto(carData.userID)) || user_default,
        };
        setMaxSlide(carDoc.data().images.length - 1);
        setCarAd(updatedCarData);
      }
    };
    getCarFromDB();
  }, [carID]);

  const isFavourite = (carID: string) => {
    return user?.favouriteAds?.includes(carID);
  };
  const addToFavourites = (carID: string) => {
    const userDocRef = doc(db, "users", auth.currentUser!.uid);
    if (user?.favouriteAds?.includes(carID)) {
      updateDoc(userDocRef, { favouriteAds: arrayRemove(carID) });
      setUSER &&
        setUSER({
          ...user,
          favouriteAds: user.favouriteAds.filter((adID) => adID !== carID),
        });
      showToolTip("Your selected ad has been removed from favourites", "red");
    } else {
      updateDoc(userDocRef, { favouriteAds: arrayUnion(carID) });
      setUSER &&
        setUSER({ ...user, favouriteAds: [...user?.favouriteAds!, carID] });
      showToolTip("Your selected ad has been added to favourites", "green");
    }
  };

  const getUserPhoto = async (userID: string) => {
    const userDoc = await getDocs(collection(db, "users"));
    const userDocs = userDoc.docs;
    const user = userDocs.find((userDoc) => userDoc.id === userID);
    return user?.data().photoURL as string;
  };

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
    <div className="container">
      <div className="adContainer">
        <div
          className={
            isfullScreen
              ? "imageContainer fullScreenImageCont"
              : "imageContainer"
          }
        >
          <div className="slider">
            {carAd?.images.map((imageURL: string, index: number) => (
              <div className="slide" key={index} style={slideStyle(index)}>
                <img src={imageURL} alt="car" />
              </div>
            ))}

            <button onClick={nextSlide} className="btn btn-next">
              <FontAwesomeIcon
                icon={faArrowRight}
                className="fontAwesomeIcon"
              />
            </button>
            <button onClick={prevSlide} className="btn btn-prev">
              <FontAwesomeIcon icon={faArrowLeft} className="fontAwesomeIcon" />
            </button>
          </div>
          {isfullScreen ? (
            <div
              className="close-FullScreen-btn"
              onClick={() => setFullScreen(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </div>
          ) : (
            <div
              className="fullScreen-enter"
              onClick={() => setFullScreen(true)}
            >
              <FontAwesomeIcon icon={faExpand} />
            </div>
          )}
        </div>
        <div className="ad">
          <div className="tagsWrap">
            <div className="title">
              <h3>Tags</h3>
              <img src={tagsSVG} alt="tag" />
            </div>

            <div className="tags">
              {carAd?.tags.map((tag: string) => (
                <div className="tag" key={tag}>
                  <h4>{tag}</h4>
                </div>
              ))}
            </div>
          </div>
          <div className="userDisplay">
            <div id="emailOverlay">
              <h3></h3>
            </div>

            <div
              onClick={() =>
                navigate(`/user/${carAd.userID}`, {
                  state: { userID: carAd.userID },
                })
              }
              className="accountPhoto"
            >
              <img src={carAd?.userPhoto} alt="User" />
            </div>
            <h3 id="phoneNr">{carAd?.phoneNr}</h3>
            <p id="ShortDescription">{carAd?.shortDescription}</p>
            <div className="AdWrapButtonsPrice">
              <div className="adButtons">
                <div
                  className="adButton"
                  onClick={() => addToFavourites(carAd?.id)}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={
                      isFavourite(carAd?.id)
                        ? "fontAwesomeRed"
                        : "fontAwesomeIcon"
                    }
                  />
                </div>
                <div
                  className="adButton"
                  onClick={() => messageUser(carAd?.userID)}
                >
                  <FontAwesomeIcon icon={faMessage} />
                </div>
              </div>
              <div className="carInfoHeader_PriceWrap">
                <h3>{carAd?.price}</h3>
                <FontAwesomeIcon
                  icon={faEuroSign}
                  className="fontAwesomeIcon"
                />
              </div>
            </div>
          </div>

          <div className="AdDetails">
            <h3>General</h3>
            <div className="grid-item">
              <p>Make:</p>
              <p>{carAd?.make}</p>
            </div>
            <div className="grid-item">
              <p>Model:</p>
              <p>{carAd?.model}</p>
            </div>
            <div className="grid-item">
              <p>Version:</p>
              <p>{carAd?.version}</p>
            </div>
            <div className="grid-item">
              <p>Generation:</p>
              <p>{carAd?.generation}</p>
            </div>
            <div className="grid-item">
              <p>Year:</p>
              <p>{carAd?.madeYear}</p>
            </div>
            <div className="grid-item">
              <p>Fuel:</p>
              <p>{carAd?.fuelType}</p>
            </div>
            <h3>Technical</h3>
            <div className="grid-item">
              <p>Transmission:</p>
              <p>{carAd?.transmission}</p>
            </div>
            <div className="grid-item">
              <p>
                {carAd?.fuelType == "electric"
                  ? "Battery Capacity"
                  : "Cilinder Capacity"}
              </p>
              <div className="unitWrap">
                <p>{carAd?.capacity}</p>
                <b>{carAd?.fuelType == "kwh" ? "" : "cm3"}</b>
              </div>
            </div>
            <div className="grid-item">
              <p>Polution Category:</p>
              <p>{carAd?.EmmisionStandard}</p>
            </div>
            <div className="grid-item">
              <p>CO2 Emmisions:</p>
              <div className="unitWrap">
                <p>{carAd?.c02Emission}</p>
                <b>g/Km</b>
              </div>
            </div>
            <div className="grid-item">
              <p>Drivetrain Type:</p>
              <p>{carAd?.driveTrain}</p>
            </div>
            <div className="grid-item">
              <p>Power:</p>
              <div className="unitWrap">
                <p>{carAd?.power}</p>
                <b>HP</b>
              </div>
            </div>
            <h3>Bodywork</h3>
            <div className="grid-item">
              <p>Bodywork:</p>
              <p>{carAd?.bodyWork}</p>
            </div>
            <div className="grid-item">
              <p>Number of Doors:</p>
              <p>{carAd?.DoorNumber}</p>
            </div>
            <div className="grid-item">
              <p>Color:</p>
              <p>{carAd?.color}</p>
            </div>
          </div>
          <div className="optionalInfo">
            <div className="optionalInfoItem">
              <p>Condition:</p>
              <p>{carAd?.condition}</p>
            </div>
            <div className="optionalInfoItem">
              <p>Milage:</p>
              <div className="unitWrap">
                <p>{carAd?.milage}</p>
                <b>Km</b>
              </div>
            </div>
            <div className="optionalInfoItem">
              <p>Coutry of Origin:</p>
              <p>{carAd?.countryOfOrigin}</p>
            </div>
            <div className="optionalInfoItem">
              <p>VIN:</p>
              <p>{carAd?.vin}</p>
            </div>
            <div className="optionalInfoItem">
              <p>Waranty for :</p>
              <p>{carAd?.warrantyKm}</p>
            </div>
            <div className="optionalInfoItem">
              <p>Date of first registration:</p>
              <p>{carAd?.dayOfFirstRegistration}</p>
              <p>/</p>
              <p>{carAd?.monthOfFirstRegistration}</p>
              <p>/</p>
              <p>{carAd?.yearOfFirstRegistration}</p>
            </div>
            <div className="optionalInfoItem">
              <p>Video Link:</p>
              <p>{carAd?.youtubeLink}</p>
            </div>
          </div>
          <div className="adDescription">
            <p>{carAd?.longDescription}</p>
          </div>
          <div className="otherInfo">
            <div className="locationWrap">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="fontAwesomeIcon"
              />
              <h5>
                {carAd?.country},{carAd?.city}
              </h5>
            </div>
            <div className="dateWrap">
              <h5>{carAd?.createdAt.toDate().toLocaleDateString()}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
