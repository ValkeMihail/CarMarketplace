import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DocumentData, auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { getTimeAgo, showToolTip } from "../../utils/helpers";
import { useState } from "react";
import {
  faCheck,
  faFile,
  faFileAlt,
  faFileArchive,
  faFileAudio,
  faFileExcel,
  faFilePdf,
  faFilePowerpoint,
  faFileVideo,
  faFileWord,
  faTrashAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";


type ChatMessageProps = {
  message: DocumentData;
  otherUser: {
    id?: string;
    username?: string | null;
  };
  deleteMessage: (message  : DocumentData) => void;
};


const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  otherUser,
  deleteMessage,
}) => {


  const [imageCarousel, setImageCarousel] = useState<boolean>(false);

  const navigate = useNavigate();
  const isCurrentUser = message.senderId === auth?.currentUser?.uid;
  const isImageType = message.dataType === "image";
  const isTextType = message.dataType === "text";
  const firstMessageQuestion = message.text.split("?")[0] + "?" ;
  const firstMessageId = message?.text?.split("?")[1]?.match(/[^/]+$/)?.[0];


  const getFileIcon = () => {
    switch (true) {
      case message.fileName?.includes(".pdf"):
        return faFilePdf;
      case message.fileName?.includes(".doc"):
        return faFileWord;
      case message.fileName?.includes(".xls"):
        return faFileExcel;
      case message.fileName?.includes(".ppt"):
        return faFilePowerpoint;
      case message.fileName?.includes(".zip"):
        return faFileArchive;
      case message.fileName?.includes(".mp3"):
        return faFileAudio;
      case message.fileName?.includes(".txt"):
        return faFileAlt;
      case message.fileName?.includes(".mp4"):
        return faFileVideo;
      default:
        return faFile;
    }
  };

  const downloadFile =  async(url: string, fileName: string) => {

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      if (error instanceof Error) showToolTip(error.message as string, "red");
    }
  }

  


  return (
    <div
      className={`chat-message ${isCurrentUser ? "otherUser" : null}`}
    >
      <p className="senderId">
        {isCurrentUser
          ? "You"
          : message.senderId === otherUser?.id
          ? otherUser?.username
          : "System"}
        :
      </p>

      {isImageType ? (
        <div className={imageCarousel ? "imageCarouselContainer" : "imageMessageContainer"}>
          <img
            onClick={() => setImageCarousel(true)}
            className={imageCarousel ? "imageMessage" : "imageMessageCarousel"}
            src={message.text}
            alt="image"
          />
          {imageCarousel && (
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => setImageCarousel(false)}
              className="fontAwesomeIconBigger"
            />
          )}
        </div>
      ) : isTextType ? (
        <div className="textDivMessageFirst">
          {message.isFirstMessage && message.firstMessageImageURL ? (
            <>
              {firstMessageQuestion}
              <div
                onClick={() =>
                  navigate(`/ad/${firstMessageId}`, {
                    state: { id: firstMessageId },
                  })
                }
                className="firstMessage"
              >
                <img src={message.firstMessageImageURL} alt="car ad image" />
                <p className="linkMessage">{message.text.split("?")[1]}</p>
              </div>
            </>
          ):(
            message.text
          )}
        </div>
      ) : (
        <div className="fileDownload">
          <FontAwesomeIcon
            icon={getFileIcon()}
            onClick={() => downloadFile(message.text, message.fileName)}
            className="fontAwesomeIconBigger"
          />
          <h5>{message.fileName as string}</h5>
        </div>
      )}

      <div className="MessageReadChecks">
        {Array.from({ length: isCurrentUser ? message.participants.length : 1 }).map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faCheck}
            className={isCurrentUser ? "fontAwesomeIconGreen" : "fontAwesomeIcon"}
          />
        ))}
      </div>

      <div className="bottomContainerMessage">
        {isCurrentUser && (
          <div onClick={() => deleteMessage(message)} className="deleteMessageButton">
            <FontAwesomeIcon icon={faTrashAlt} className="fontAwesomeRed" />
          </div>
        )}
        <p className="messageDate">{getTimeAgo(message.createdAt)}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
