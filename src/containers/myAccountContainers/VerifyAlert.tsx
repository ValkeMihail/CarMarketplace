import { AuthContext } from "../../context/auth/AuthContext";
import { useContext } from "react";
import { showToolTip } from "../../utils/helpers";


export const VerifyAlert = () => {

  const { user, sendVerificationEmail , isUserVerified } = useContext(AuthContext);

  const sendVerificationEmailHandler = async () => {
    if (user) {
      try {
        await sendVerificationEmail();
        showToolTip("Verification email sent", "green");
      } catch (error) {
        showToolTip(error as string, "red");
      }
    }
  };

  return (
    <>
      {!isUserVerified() && (
        <div id="VerifyAlert" className="alert">
          {" "}
          Please verify your account.
          <a onClick={sendVerificationEmailHandler} id="sendVerification">
            Send Verification Code
          </a>
        </div>
      )}
    </>
  )
}


