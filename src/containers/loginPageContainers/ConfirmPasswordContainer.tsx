import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Credentials, errorMessagesRegisterForm } from "./RegisterForm";
import { faEye, faEyeLowVision } from "@fortawesome/free-solid-svg-icons";


type ConfirmPasswordContainerProps = {
  errorMessages: errorMessagesRegisterForm
  setCredentials: (credentials: Credentials) => void
  credentials: Credentials
  setErrorMessages: (errorMessages: errorMessagesRegisterForm) => void
  showPassword: boolean
  setShowPassword: (showPassword: boolean) => void
}




export function ConfirmPasswordContainer({
  errorMessages,
  setCredentials,
  credentials,
  setErrorMessages,
  showPassword,
  setShowPassword

}: ConfirmPasswordContainerProps) {
  return <div className="form-input">
          <label>Confirm Password:</label>
          <input onChange={e => {
      setCredentials({ ...credentials,
        confirmPassword: e.target.value
      });
      setErrorMessages({ ...errorMessages, confirmPassword: "" });
    }} id="passwordc" type={showPassword ? "text" : "password"} placeholder="Password" />
          <span onClick={() => {
      showPassword ? setShowPassword(false) : setShowPassword(true);
    }}>
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeLowVision} />
          </span>
          {errorMessages.confirmPassword && <div className="errorMessage">{errorMessages.confirmPassword}</div>}
        </div>;
}
  