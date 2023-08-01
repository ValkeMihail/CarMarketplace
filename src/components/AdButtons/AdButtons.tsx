import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMessage, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import {arrayRemove, arrayUnion, auth, db, doc, updateDoc} from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth/AuthContext";
import { useContext } from "react";
import { createChat, showToolTip } from "../../utils/helpers";

type AdButtonsProps = {
  carDoc : { 
    id: string 
    userID: string
    images: string[]
  };
  removeCarFromList : (id?: string) => void
};




export const AdButtons = ({  removeCarFromList,  carDoc} : AdButtonsProps) => {

  const navigate = useNavigate();
  const {user , setUSER} = useContext(AuthContext);

  const messageUser = async (
    recipientId: string,
    carID: string,
    carImageURL: string
  ) => {
    const chatId: string = await createChat(
      recipientId,
      `${window.location.origin}/ad/${carID}`,
      carImageURL
    );

    if (chatId.length > 0) navigate(`/chats/chat/${chatId}`);
    else showToolTip("Error creating chat", "red");
  };

  const isFavourite = (carID?: string) => {
    if (!user) {
      showToolTip("You need to be logged in", "red");
      return;
    }
    if (!user.favouriteAds) return false;
    if (!carID) return false;
    return user.favouriteAds.includes(carID);
  };

  const addToFavourites = (carID?: string) => {
    if (!auth.currentUser) {
      showToolTip("You need to be logged in", "red");
      return;
    }
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    if (!carID) {
      showToolTip("Error adding to favourites, this car ad no longer exists", "red");
      return;
    }
    if (user?.favouriteAds?.includes(carID)) {
      updateDoc(userDocRef, { favouriteAds: arrayRemove(carID) });
      setUSER({
        ...user,
        favouriteAds: user.favouriteAds.filter((adID) => adID !== carID),
      });
      showToolTip("The selected ad has been removed from favourites", "red");
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
    <div className="adButtons">
      <div 
        className="adButton"
        onClick={carDoc.userID === auth.currentUser?.uid 
          ? () => removeCarFromList(carDoc.id) 
          : () => addToFavourites(carDoc.id)
        } 
      >
        <FontAwesomeIcon 
          className={ isFavourite(carDoc.id) 
            ? "fontAwesomeRed" 
            : "fontAwesomeIcon"
          } 
          icon={ carDoc.userID === auth.currentUser?.uid 
            ? faTrash 
            : faHeart} 
        />
      </div>
      <div 
        className="adButton"
        onClick={carDoc.userID === auth.currentUser?.uid 
          ? () => navigate(`/edit/${carDoc.id}`, {state: {  id: carDoc.id }}) 
          : () => messageUser(carDoc.userID, carDoc.id, carDoc.images[0])} 
      >
        <FontAwesomeIcon 
          icon={carDoc.userID === auth.currentUser?.uid 
            ? faPenToSquare 
            : faMessage
          } 
        />
      </div>
    </div>
  );
}
  