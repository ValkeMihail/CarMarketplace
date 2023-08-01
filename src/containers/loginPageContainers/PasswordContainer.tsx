import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Credentials, errorMessagesRegisterForm } from "./RegisterForm";
import { faEye, faEyeLowVision } from "@fortawesome/free-solid-svg-icons";

type PasswordContainerProps = {
  setCredentials: (credentials: Credentials) => void;
  credentials: Credentials;
  setErrorMessages: (errorMessages: errorMessagesRegisterForm) => void;
  showPassword: boolean;
  errorMessages: errorMessagesRegisterForm;
  setShowPassword: (showPassword: boolean) => void;
};


export function PasswordContainer({
  setCredentials,
  credentials,
  setErrorMessages,
  showPassword,
  errorMessages,
  setShowPassword
}  : PasswordContainerProps) {


  return (
    <div className="form-input">
      <label>Password:</label>
      <input 
        onChange={e => {
          setCredentials({ ...credentials,
            password: e.target.value
          });
          setErrorMessages({ ...errorMessages, password: "" });
        }} 
        id="password" 
        type={showPassword ? "text" : "password"} 
        placeholder="Password" 
      />
      <span 
        onClick={() => {
          showPassword ? setShowPassword(false) : setShowPassword(true);
        }}
      >
        <FontAwesomeIcon icon={showPassword ? faEye : faEyeLowVision} />
      </span>

      {errorMessages.password && <div className="errorMessage">{errorMessages.password}</div>}
    </div>
  );
}
  