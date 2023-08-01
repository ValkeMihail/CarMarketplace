import { UserData, errorMessagesRegisterForm } from "./RegisterForm";

type EmailContainerProps = {
  setUserData: (userData: UserData) => void;
  userData: UserData;
  setErrorMessages: (errorMessages: errorMessagesRegisterForm) => void;
  errorMessages: errorMessagesRegisterForm;
};

export function EmailContainer({
  setUserData,
  userData,
  setErrorMessages,
  errorMessages,
} : EmailContainerProps) {


  const resetErrorEmail = () => {
    setErrorMessages({ ...errorMessages, email: "" });
  }


  return (
    <div className="form-input">
      <label>Email:</label>
      <input 
        onChange={e => {
          setUserData({ ...userData,
            email: e.target.value
          });
          resetErrorEmail();
        }} 
        id="email" 
        type="email" 
        placeholder="Email" 
      />

      {errorMessages.email && <div className="errorMessage">{errorMessages.email}</div>}
    </div>);
}
  