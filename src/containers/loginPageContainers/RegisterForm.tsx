import { PasswordContainer } from "./PasswordContainer";
import { PhoneNumberContainer } from "./PhoneNumberContainer";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../../components/Inputs/TextInput";
import { SelectContainer } from "../../components/Inputs/SelectContainer";
import { EmailContainer } from "./EmailContainer";
import { ConfirmPasswordContainer } from "./ConfirmPasswordContainer";

export interface errorMessagesRegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneCode: string;
  phoneNumber: string;
}

export type UserData = {
  username: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
};

export type Credentials = {
  password: string;
  confirmPassword: string;
};

export const RegisterSection = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<Credentials>({
    password: "",
    confirmPassword: "",
  });
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    phoneCode: "",
    phoneNumber: "",
  });
  const { createUserWithEmailAndPasswordHandler, setUserRegistered } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState(
    {} as errorMessagesRegisterForm
  );

  const handleRegister = async () => {
    let newErrorMessages = {} as errorMessagesRegisterForm;

    if (
      !userData.username ||
      userData.username.length < 3 ||
      userData.username.length > 30
    ) {
      newErrorMessages = {
        ...newErrorMessages,
        username:
          "A correct username is required. It must contain at least 3 characters and maximum 30 characters.",
      };
    }
    if (
      !userData.email ||
      userData.email.indexOf("@") < 0 ||
      userData.email.indexOf(".") < 0 ||
      userData.email.length < 5 ||
      userData.email.length > 30
    ) {
      newErrorMessages = {
        ...newErrorMessages,
        email: "A correct email is required.",
      };
    }
    if (
      !credentials.password ||
      credentials.password.length < 6 ||
      credentials.password.length > 30 ||
      !credentials.password.match(/[0-9]/g) ||
      !credentials.password.match(/[a-z]/g) ||
      !credentials.password.match(/[A-Z]/g)
    ) {
      newErrorMessages = {
        ...newErrorMessages,
        password:
          "A correct password is required. It must contain at least 6 characters, one uppercase letter, one lowercase letter and one number.",
      };
    }
    if (
      !credentials.confirmPassword ||
      credentials.confirmPassword !== credentials.password
    ) {
      newErrorMessages = {
        ...newErrorMessages,
        confirmPassword: "The passwords do not match.",
      };
    }
    if (
      !userData.phoneCode ||
      userData.phoneCode.length < 1 ||
      userData.phoneCode.length > 4
    ) {
      newErrorMessages = {
        ...newErrorMessages,
        phoneCode: "A correct phone code is required.",
      };
    }
    if (
      !userData.phoneNumber ||
      userData.phoneNumber.length < 6 ||
      userData.phoneNumber.length > 15
    ) {
      newErrorMessages = {
        ...newErrorMessages,
        phoneNumber: "A correct phone number is required.",
      };
    }

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }

    try {
      await createUserWithEmailAndPasswordHandler(
        userData.email,
        credentials.password
      );
      setUserRegistered({
        id: "",
        username: userData.username || null,
        email: userData.email || null,
        phoneCountryCode: userData.phoneCode || null,
        phoneNr: userData.phoneNumber || null,
        favouriteAds: [],
        createdAt: null,
        adsArray: [],
        photoURL: null,
      });
      navigate("/");
    } catch (error) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        email: (error as Error).message as string,
      }));
    }
  };

  return (
    <div id="signup">
      <div id="registerForm" className="registerForm">
        <h1>Create an accout</h1>
        <TextInput
          errorMessages={errorMessages}
          label="Username"
          name="username"
          setErrorMessages={setErrorMessages}
          setUserData={setUserData}
          userData={userData}
        />
        <EmailContainer
          errorMessages={errorMessages}
          setErrorMessages={setErrorMessages}
          setUserData={setUserData}
          userData={userData}
        />
        <SelectContainer
          errorMessages={errorMessages}
          setErrorMessages={setErrorMessages}
          setUserData={setUserData}
          userData={userData}
        />
        <PhoneNumberContainer
          errorMessages={errorMessages}
          setErrorMessages={setErrorMessages}
          setUserData={setUserData}
          userData={userData}
        />
        <PasswordContainer
          errorMessages={errorMessages}
          credentials={credentials}
          setCredentials={setCredentials}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          setErrorMessages={setErrorMessages}
        />
        <ConfirmPasswordContainer
          errorMessages={errorMessages}
          credentials={credentials}
          setCredentials={setCredentials}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          setErrorMessages={setErrorMessages}
        />
        <div className="buttonwrap">
          <button onClick={handleRegister} className="btn btn-social">
            SignUp
          </button>
        </div>
      </div>
    </div>
  );
};
