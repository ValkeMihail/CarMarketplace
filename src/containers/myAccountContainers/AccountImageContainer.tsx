import { faEdit } from "@fortawesome/free-solid-svg-icons";
import userDefault from "../../assets/user_default.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../context/auth/AuthContext";
import {useContext, useRef} from "react";
import { showToolTip } from "../../utils/helpers";


type AccountImageContainerProps = {
  user : {
    photoURL? : string | null;
  }
}


export const AccountImageContainer = ({user} : AccountImageContainerProps) => {


  const { uploadPhotoFile } = useContext(AuthContext);


  const photoEditRef = useRef<HTMLInputElement>(null);

  const photoEditRefClickHandler = () => {
    photoEditRef.current?.click();
  };

  const handleUpdateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhotoFile(file);
      showToolTip("Photo uploaded", "green");
    } else {
      showToolTip("No file selected", "red");
    }
  };

  return (
      <div className="img-container">
      <img
        id="photoHolder"
        src={user?.photoURL ?? userDefault}
        alt="Profile picture"
      />
      <div id="photoEditWrap" className="editButtonWrapper">
        <input
          onChange={(e) => {
            handleUpdateImage(e);
          }}
          ref={photoEditRef}
          id="photoEdit"
          type="file"
          accept="image/x-png,image/jpeg"
        />
        <FontAwesomeIcon
          onClick={photoEditRefClickHandler}
          icon={faEdit}
        />
      </div>
    </div>
  )
}


