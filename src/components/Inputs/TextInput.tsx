import { UserData, errorMessagesRegisterForm } from "../../containers/loginPageContainers/RegisterForm";



type FormInputProps = {
  label: string;
  name: string;
  setUserData: (userData: UserData) => void;
  userData: UserData;
  setErrorMessages: (errorMessages: errorMessagesRegisterForm) => void;
  errorMessages: errorMessagesRegisterForm;
};
  



export function TextInput({
  setUserData,
  label,
  errorMessages,
  userData,
  setErrorMessages

} : FormInputProps) {



  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({ ...userData,
      [name]: value
    });
    setErrorMessages({ ...errorMessages, [name]: "" });
  }


  
  return (
    <div className="form-input">
      <label>{label}:</label>
      <input onChange={handleInputChange}
        id="username"
        name="username" 
        type="text" 
        placeholder="Username" 
      />
      {errorMessages.username && <div className="errorMessage">{errorMessages.username}</div>}
    </div>);
}
  