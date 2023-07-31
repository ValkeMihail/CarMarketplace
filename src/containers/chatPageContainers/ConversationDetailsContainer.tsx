import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatAvatar } from "../../components/Avatars/ChatAvatar";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";



type ConversationDetailsContainerProps = {
  otherUser: {
    id?: string | null;
    photoURL?: string | null;
    username?: string | null;
  };
}



export function ConversationDetailsContainer({
  otherUser,
} : ConversationDetailsContainerProps) {




  return (
    <div className="convDetails">
      <div className="userWrap">
        <ChatAvatar otherUser={{
      id: (otherUser?.id as string),
      photoURL: (otherUser?.photoURL as string)
    }} />
        <h3>{otherUser?.username}</h3>
      </div>
      <div className="buttonsWrap">
        <div className="utilityButton">
          <FontAwesomeIcon icon={faEllipsisVertical} className="fontAwesomeIcon" />
        </div>
      </div>
    </div>
  )
}
  