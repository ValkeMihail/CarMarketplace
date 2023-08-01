import { useState } from "react";
import { auth, sendPasswordResetEmail } from "../../utils/firebase";
import { FirstContainer } from "../../containers/loginPageContainers/FirstContainer";
import { SocialMediaLogin } from "../../containers/loginPageContainers/SocialMediaLogin";
import { FirebaseError } from "firebase/app";
import { RegisterSection } from "../../containers/loginPageContainers/RegisterForm";
import { LoginSection } from "../../containers/loginPageContainers/LoginSection";
import { showToolTip } from "../../utils/helpers";



export const Login = () => {
  
  const [isLogin, setIsLogin] = useState(true);
  const [emailValue, setEmailValue] = useState("");

  const resetPassword = () => {
    const email = emailValue;
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          showToolTip("Password reset email sent!", "green");
        })
        .catch((error) => {
          if (error instanceof FirebaseError)
          showToolTip(error.message as string, "red");
        });
    } else {
      showToolTip("Please enter your email in the field!", "red");
    }
  };

  return (
    <div className="container">
      <div className="authentication-screen">
        <FirstContainer />
        <div className="second-container">
          <SocialMediaLogin />
          <div className="or">
            <hr />
            <h3>OR</h3>
            <hr />
          </div>
          {isLogin ? (
            <>
              <LoginSection updateEmailValue={setEmailValue} />
              <a onClick={() => setIsLogin(false)} id="nohaveaccount">
                No Account? Register
              </a>
              <br />
              <a onClick={() => resetPassword()} id="resetPassword">
                I forgot my password. Send me a password reset email
              </a>
            </>
          ) : (
            <>
              <RegisterSection />
              <a onClick={() => setIsLogin(true)} id="haveaccount">
                I already have an account
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
