import { UserData, errorMessagesRegisterForm } from "./RegisterForm";

type PhoneNumberContainerProps = {
  setUserData: (userData: UserData) => void;
  userData: UserData;
  setErrorMessages: (errorMessages: errorMessagesRegisterForm) => void;
  errorMessages: errorMessagesRegisterForm;
};
    
export function PhoneNumberContainer({
  setUserData,
  userData,
  setErrorMessages,
  errorMessages
} : PhoneNumberContainerProps) {

  const resetErrorPhoneNumber = () => {
    setErrorMessages({ ...errorMessages, phoneNumber: "" });
  }

  return (
    <div className="form-input">
      <label>Phone Nr:</label>
      <input 
        onChange={e => {
          setUserData({ ...userData,
            phoneNumber: e.target.value
          });
          resetErrorPhoneNumber();
        }} 
        id="phoneNr" 
        type="text" 
        placeholder="Phone Number" 
      />
      {errorMessages.phoneNumber && <div className="errorMessage">{errorMessages.phoneNumber}</div>}
    </div>
  );
}
  