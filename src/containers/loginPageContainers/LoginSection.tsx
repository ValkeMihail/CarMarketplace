import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import { PasswordInput } from "../../components/Inputs/PasswordInput";
import { EmailInput } from "../../components/Inputs/EmailInput";
import { showToolTip } from "../../utils/helpers";

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
        password: "You must enter your password.",
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
        <EmailInput
          credentials={credentials}
          setCredentials={setCredentials}
          errorMessages={errorMessages}
          label="Email"
          setErrorMessages={setErrorMessages}
        />
        <PasswordInput
          showPassword={showPassword}
          credentials={credentials}
          errorMessages={errorMessages}
          label="Password"
          setCredentials={setCredentials}
          setErrorMessages={setErrorMessages}
          setShowPassword={setShowPassword}
        />

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
