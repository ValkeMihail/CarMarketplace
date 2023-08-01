import { faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useRef , useState, useContext} from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import { EmailAuthProvider, GoogleAuthProvider, auth, reauthenticateWithCredential, reauthenticateWithPopup, updateEmail } from "../../utils/firebase";
import { showToolTip } from "../../utils/helpers";

export const EmailEditContainer = () => {

  const emailRef = useRef<HTMLInputElement>(null);
  const [isUserEditingEmail, setIsUserEditingEmail] = useState(false);
  const { user, updateUserDoc , isProviderGoogle} = useContext(AuthContext);
  const handleUpdateEmail = async () => {
    if (!auth.currentUser) {
      showToolTip("You must be logged in", "red");
      return;
    }
    const isEmpty = emailRef.current?.value.trim() !== "";
    const isDifferent = emailRef.current?.value !== user?.email;

    if (user && emailRef.current?.value && isEmpty && isDifferent) {
      try {
        if (isProviderGoogle() == true) {
          const provider = new GoogleAuthProvider();
          await reauthenticateWithPopup(auth.currentUser, provider);
          showToolTip(
            "Please connect with your Google accout to continue",
            "white"
          );
        } else {
          const passwordPrompt = prompt(
            "Please enter your password to confirm the change"
          );
          if (passwordPrompt === null) return;
          const providerCredential = EmailAuthProvider.credential(
            user?.email as string,
            passwordPrompt
          );
          await reauthenticateWithCredential(
            auth.currentUser,
            providerCredential
          );
        }
        await updateUserDoc({ email: emailRef.current?.value });
        await updateEmail(auth.currentUser, emailRef.current?.value);
      } catch (error) {
        showToolTip(error as string, "red");
      }
    }
    setIsUserEditingEmail(false);
  };



  return (
    <div className="form-input">
      <label>Email:</label>
      {isUserEditingEmail ? (
        <>
          <input
            type="text"
            ref={emailRef}
            readOnly={false}
            placeholder={user?.email ?? "No username available"}
          />
          <div
            onClick={handleUpdateEmail}
            className="editButtonWrapper"
          >
            <FontAwesomeIcon icon={faCheck} />
          </div>
        </>
      ) : (
        <>
          <div className="fakeInput">
            {user?.email ?? "No email available"}
          </div>
          <div
            onClick={() => {
              setIsUserEditingEmail(true);
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
