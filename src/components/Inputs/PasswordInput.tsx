import { faEye, faEyeLowVision } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CredentialsOrError = {
  email: string;
  password: string;
};

type PasswordInputProps = {
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
  errorMessages: CredentialsOrError;
  label: string;
  credentials: CredentialsOrError;
  setCredentials: (credentials: CredentialsOrError) => void;
  setErrorMessages: (errorMessages: CredentialsOrError) => void;
};

export const PasswordInput = ({
  showPassword,
  setShowPassword,
  errorMessages,
  setCredentials,
  label,
  setErrorMessages,
  credentials,
}: PasswordInputProps) => {

  
  const resetPasswordError = () => {
    setErrorMessages({ ...errorMessages, password: "" });
  };

  return (
    <div className="form-input">
      <label>{label}:</label>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        onChange={(e) => {
          setCredentials({ ...credentials, password: e.target.value });
          resetPasswordError();
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
  );
};
