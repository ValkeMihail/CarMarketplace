
type CredentialsOrError = {
  email: string;
  password: string;
  confirmPassword?: string;
};


type EmailInputProps = {
  credentials: CredentialsOrError;
  setCredentials: (credentials: CredentialsOrError) => void;
  errorMessages: CredentialsOrError;
  label: string;
  setErrorMessages: (errorMessages: CredentialsOrError) => void;
};

export const EmailInput = ({
  credentials,
  setCredentials,
  errorMessages,
  label,
  setErrorMessages,
}: EmailInputProps) => {

  const resetEmailError = () => {
    setErrorMessages({ ...errorMessages, email: "" });
  };

  return (
    <div className="form-input">
      <label>{label}:</label>
      <input
        onChange={(e) => {  setCredentials({ ...credentials, email: e.target.value });  resetEmailError();}}
        type="email"
        autoComplete="off"
        placeholder="Email"
      />
      {errorMessages.email && (
        <div className="errorMessage">{errorMessages.email}</div>
      )}
    </div>
  );
};
