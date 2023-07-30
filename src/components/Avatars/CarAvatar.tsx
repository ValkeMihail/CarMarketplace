import { useNavigate } from "react-router-dom";
import {auth } from "../../utils/firebase";
import placeholderCarImage from "../../assets/placeHolderCar.png";

type CarAvatarProps = {
  carDoc : {
    id: string;
    userID: string;
    images: string[];
  }
}

export const CarAvatar = ({
  carDoc,
}: CarAvatarProps) => {

  const navigate = useNavigate();

  return (
    <div 
      onClick={carDoc.userID === auth.currentUser?.uid ?
        () => navigate(`/edit/${carDoc.id}`, {state: {id: carDoc.id}}) :
        () => navigate(`/ad/${carDoc.id}`, {state: {id: carDoc.id}})} 
      className="imgWrap"
    >
      <img src={carDoc.images ? carDoc.images[0] : placeholderCarImage } alt="car image" />
    </div>
  )
}
  