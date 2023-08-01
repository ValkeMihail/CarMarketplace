import  { useRef, useState , useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/auth/AuthContext";
import { showToolTip } from "../../utils/helpers";

export const UsernameEditContainer = () => {



  const usernameRef = useRef<HTMLInputElement>(null);
  
  const [isUserEditingUsername, setIsUserEditingUsername] = useState(false);

  const { user, updateUserDoc } = useContext(AuthContext);

  const handleUpdateUsername = () => {
    const isNotEmpty = usernameRef.current?.value.trim() !== "";
    const isDifferent = usernameRef.current?.value !== user?.username;
    if (isNotEmpty && isDifferent) {
      updateUserDoc({
        username: usernameRef.current?.value,
      });
      showToolTip("Username updated", "green");
    } else {
      showToolTip("No changes made", "red");
    }
    setIsUserEditingUsername(false);
  };




  return (
    <div className="form-input">
      <label>Username:</label>

      {isUserEditingUsername ? (
        <>
          <input
            type="text"
            ref={usernameRef}
            readOnly={false}
            placeholder={user?.username ?? "No username available"}
          />
          <div
            onClick={handleUpdateUsername}
            className="editButtonWrapper"
          >
            <FontAwesomeIcon icon={faCheck} />
          </div>
        </>
      ) : (
        <>
          <div className="fakeInput">
            {user?.username ?? "No username available"}
          </div>
          <div
            onClick={() => {
              setIsUserEditingUsername(true);
            }}
            className="editButtonWrapper"
          >
            <FontAwesomeIcon icon={faEdit} />
          </div>
        </>
      )}
    </div>
  )
}

