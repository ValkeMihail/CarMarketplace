import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth/AuthContext";
import { useContext } from "react";
import { createChat, showToolTip } from "../../utils/helpers";
import { arrayRemove, arrayUnion, auth, db, doc, updateDoc } from "../../utils/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuroSign, faHeart, faMessage } from "@fortawesome/free-solid-svg-icons";
import placeHolderCar from "../../assets/placeHolderCar.png";

type UserDetailsContainerProps = {
  carDoc: {
    id?: string;
    userID?: string;
    images?: string[];
    userPhoto?: string;
    phoneNr?: string;
    shortDescription?: string;
    price?: number;
  }
}


export function UserDetailsContainer({
  carDoc,
}: UserDetailsContainerProps){

  const { user, setUSER } = useContext(AuthContext);
  const navigate = useNavigate();

  const messageUser = async (recipientId?: string) => {
    if (!recipientId) {
      showToolTip("Error sending message", "red");
      return;
    }

    const chatId: string = await createChat(
      recipientId,
      `${window.location.origin}/ad/${carDoc.id}`,
      carDoc?.images ? carDoc?.images[0] : placeHolderCar
    );
    if (chatId != "") {
      navigate(`/chats/chat/${chatId}`);
    } else {
      showToolTip("Error creating chat", "red");
    }
  };

  const isFavourite = (carID?: string) => {
    if (!carID) return false;
    return user?.favouriteAds?.includes(carID);
  };

  const addToFavourites = (carID?: string) => {
    if (!auth.currentUser) {
      showToolTip("You need to be logged in to add ads to favourites", "red");
      return;
    }
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    if (!carID) {
      showToolTip(
        "Error adding ad to favourites, This ad no longer exists",
        "red"
      );
      return;
    }
    if (user?.favouriteAds?.includes(carID)) {
      updateDoc(userDocRef, { favouriteAds: arrayRemove(carID) });
      setUSER({
        ...user,
        favouriteAds: user.favouriteAds.filter((adID) => adID !== carID),
      });
      showToolTip("Your selected ad has been removed from favourites", "red");
    } else {
      if (!user) {
        showToolTip("You need to be logged in", "red");
        return;
      }
      if (user.favouriteAds) {
        updateDoc(userDocRef, { favouriteAds: arrayUnion(carID) });
        setUSER({ ...user, favouriteAds: [...user.favouriteAds, carID] });
      } else {
        updateDoc(userDocRef, { favouriteAds: [carID] });
        setUSER({ ...user, favouriteAds: [carID] });
      }
      showToolTip("The selected ad has been added to favourites", "green");
    }
  };


  return (
    <div className="userDisplay">
      <div id="emailOverlay">
        <h3></h3>
      </div>
      <div onClick={() => navigate(`/user/${carDoc?.userID}`, {state: {  userID: carDoc?.userID}})} className="accountPhoto">
        <img src={carDoc?.userPhoto} alt="User" />
      </div>
      <h3 id="phoneNr">{carDoc?.phoneNr}</h3>
      <p id="ShortDescription">{carDoc?.shortDescription}</p>
      <div className="AdWrapButtonsPrice">
        <div className="adButtons">
          <div className="adButton" onClick={() => addToFavourites((carDoc?.id))}>
            <FontAwesomeIcon icon={faHeart} className={isFavourite((carDoc?.id)) ? "fontAwesomeRed" : "fontAwesomeIcon"} />
          </div>
          <div className="adButton" onClick={() => messageUser((carDoc?.userID))}>
            <FontAwesomeIcon icon={faMessage} />
          </div>
        </div>
        <div className="carInfoHeader_PriceWrap">
          <h3>{carDoc?.price}</h3>
          <FontAwesomeIcon icon={faEuroSign} className="fontAwesomeIcon" />
        </div>
      </div>
    </div>
  );
}
  