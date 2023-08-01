import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import googlePng from "../../assets/google.svg";
import { showToolTip } from "../../utils/helpers";

export const SocialMediaLogin = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useContext(AuthContext);

  const handlesignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      showToolTip("Error:" + error, "red");
    }
  };

  return (
    <>
      <h1>LOGIN</h1>
      <div className="social-media-login">
        <div className="whenSignedOut" id="whenSignedOut">
          <button
            id="signInBtn"
            className="btn btn-social btn-google"
            onClick={handlesignInWithGoogle}
          >
            <img src={googlePng} />
            Continue with Google
          </button>
        </div>
      </div>
    </>
  );
};
