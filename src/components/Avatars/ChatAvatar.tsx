import { useNavigate } from "react-router-dom";
import userDefault from "../../assets/user_default.svg";


type ChatAvatarProps = {
  otherUser: {
    id: string;
    photoURL: string;
  }
}



export const ChatAvatar = ({ otherUser }: ChatAvatarProps) => {

  const navigate = useNavigate();


  return (
    <div  onClick={() => navigate(`/user/${otherUser?.id}`)}  className="imgWrap">
      <img src={otherUser?.photoURL || userDefault} alt="noimg" />
    </div>
  )
}