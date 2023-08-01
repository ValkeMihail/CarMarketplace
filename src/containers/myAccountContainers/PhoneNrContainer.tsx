import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelectContainer } from "../../components/Inputs/SelectContainer";
import { AuthContext } from "../../context/auth/AuthContext";
import { useRef , useState, useContext } from "react";
import { faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { showToolTip } from "../../utils/helpers";



export const PhoneNrEditContainer = () => {

  const [isUserEditingPhone, setIsUserEditingPhone] = useState(false);
  
  const phoneRef = useRef<HTMLInputElement>(null);
  const phoneCountryCodeRef = useRef<HTMLSelectElement>(null);
  
  const {updateUserDoc, user} = useContext(AuthContext);

  const handleUpdatePhone = () => {
    const isNotEmpty = phoneRef.current?.value.trim() !== "";
    const isDifferent = phoneRef.current?.value !== user?.phoneNr;

    if (phoneRef.current?.value && isNotEmpty && isDifferent) {
      updateUserDoc({
        phoneNr: phoneRef.current?.value,
        phoneCountryCode: phoneCountryCodeRef.current?.value,
      });
      showToolTip("Phone number updated", "green");
    } else {
      showToolTip("No changes made", "red");
    }
    setIsUserEditingPhone(false);
  };



  return (
    <>
      {isUserEditingPhone ? (
        <>
          <SelectContainer  ref={phoneCountryCodeRef}  defaultValue={user?.phoneCountryCode ?? ""}  onChange={undefined}/>
          <div className="form-input">
            <label>Phone Number:</label>
            <input
              placeholder={user?.phoneNr ?? "No phone number available"}
              ref={phoneRef}
              onChange={(event) => {
                const inputValue = event.target.value;
                const nonNumericRegex = /[^0-9]+/g;
                const sanitizedValue = inputValue.replace(
                  nonNumericRegex,
                  ""
                );
                event.target.value = sanitizedValue;
              }}
              type="text"
              readOnly={false}
            />
            <div
              onClick={handleUpdatePhone}
              className="editButtonWrapper"
            >
              <FontAwesomeIcon icon={faCheck} />
            </div>
          </div>
        </>
      ) : (
        <div className="form-input">
          <label>Phone Nr:</label>
          <div className="fakeInput">
            {user?.phoneNr ?? "No phone number available"}
          </div>
          <div
            onClick={() => {
              setIsUserEditingPhone(true);
            }}
            className="editButtonWrapper"
          >
            <FontAwesomeIcon icon={faEdit} />
          </div>
        </div>
      )}
    </>
  )
}
