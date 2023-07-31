import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import { showToolTip } from "../../components/Navigation/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeLowVision } from "@fortawesome/free-solid-svg-icons";

interface errorMessagesLoginForm {
  email: string;
  password: string;
}


interface LoginSectionProps {
  updateEmailValue: (count: string) => void;
}

export const LoginSection = ({ updateEmailValue }: LoginSectionProps) => {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState(
    {} as errorMessagesLoginForm
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { signInWithEmailAndPasswordHandler } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  useEffect(() => {
    updateEmailValue(credentials.email);
  }, [credentials.email, updateEmailValue]);

  const signInEmailPassword = async (
    email: string,
    password: string
  ): Promise<void> => {
    let newErrorMessages = {} as errorMessagesLoginForm;

    if (
      !email ||
      email.indexOf("@") < 0 ||
      email.indexOf(".") < 0 ||
      email.length < 5 ||
      email.length > 30
    ) {
      newErrorMessages = {
        ...newErrorMessages,
        email: "A correct email is required.",
      };
    }
    if (password.trim().length == 0) {
      newErrorMessages = {
        ...newErrorMessages,
        password:
          "A correct password is required. It must contain at least 6 characters, one uppercase letter, one lowercase letter and one number.",
      };
    }

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }
    try {
      await signInWithEmailAndPasswordHandler(email, password);
      showToolTip("You have successfully logged in!", "green");
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          email: (error as Error).message,
        }));
      }
    }
  };

  return (
    <div id="login" className="login">
      <div className="loginForm" id="loginForm">
        <h1>Login with email</h1>
        <div className="form-input">
          <label>Email:</label>
          <input
            onChange={(e) => {
              setCredentials({ ...credentials, email: e.target.value });
              setErrorMessages((prevErrors) => ({
                ...prevErrors,
                email: "",
              }));
            }}
            type="email"
            autoComplete="off"
            placeholder="Email"
          />
          {errorMessages.email && (
            <div className="errorMessage">{errorMessages.email}</div>
          )}
        </div>
        <div className="form-input">
          <label>Password:</label>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => {
              setCredentials({ ...credentials, password: e.target.value });
              setErrorMessages((prevErrors) => ({
                ...prevErrors,
                password: "",
              }));
            }}
          />
          <span
            onClick={() => {
              showPassword ? setShowPassword(false) : setShowPassword(true);
            }}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeLowVision : faEye} />
          </span>

          {errorMessages.password && (
            <div className="errorMessage">{errorMessages.password}</div>
          )}
        </div>
        <div className="buttonwrap">
          <button
            id="btnLogin"
            onClick={() => {
              signInEmailPassword(credentials.email, credentials.password);
            }}
            className="btn btn-social"
          >
            login
          </button>
        </div>
      </div>
    </div>
  );
};
