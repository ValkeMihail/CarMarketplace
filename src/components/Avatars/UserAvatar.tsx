import { CarDocument } from "../../../types";
import { AuthContext } from "../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { auth } from "../../utils/firebase";
import userDefault from "../../assets/user_default.svg";
type UserAvatarProps = {
  carDoc : Partial<CarDocument>
};

export const UserAvatar = ({ carDoc }: UserAvatarProps) => {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div
      onClick={
        carDoc.userID === auth.currentUser?.uid
          ? () => navigate("/myAccount")
          : () =>
              navigate(`/user/${carDoc.userID}`, {
                state: { userID: carDoc.userID },
              })
      }
      className="accountPhoto"
    >
      <img
        src={
          carDoc.userID === auth.currentUser?.uid
            ? user?.photoURL ?? userDefault
            : carDoc.userPhoto ?? userDefault
        }
      />
    </div>
  )


}
