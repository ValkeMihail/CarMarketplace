import { UserData, errorMessagesRegisterForm } from "../../containers/loginPageContainers/RegisterForm";

type SelectContainerProps = {
  setUserData?: (userData: UserData) => void;
  userData?: UserData;
  setErrorMessages?: (errorMessages: errorMessagesRegisterForm) => void;
  errorMessages?: errorMessagesRegisterForm;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  ref?: React.RefObject<HTMLSelectElement>;
};




export function SelectContainer({
  setUserData,
  ref,
  errorMessages,
  userData,
  onChange,
  setErrorMessages,
  defaultValue
  } : SelectContainerProps) {

    const resetErorrMessages = () => {
      if (errorMessages && setErrorMessages) setErrorMessages({... errorMessages, phoneCode: ""});
    } 

  return (
    <div id="phoneCode" className="form-input">
      <label>Country code:</label>
      <div>
        <select 
          ref= {ref}
          onChange={onChange ? undefined : e => {setUserData && userData && setUserData({ ...userData,    phoneCode: e.target.value  });  resetErorrMessages()}} 
          className="phoneCodeSelect" 
          name="phoneCodeSelect" 
          id="phoneCodeSelect" 
          defaultValue= {defaultValue ? defaultValue : ""}
        >
          <option value=""> Select Country Code</option>
          <option value="+380">Ukraine +380</option>
          <option value="+33">France +33</option>
          <option value="+49">Germany +49</option>
          <option value="+385">Croatia +385</option>
          <option value="+48">Poland +48</option>
          <option value="+31">Netherlands +31</option>
          <option value="+41">Switzerland +41</option>
          <option value="+32">Belgium +32</option>
          <option value="+44">UK +44</option>
          <option value="+39">Italy +39</option>
          <option value="+381">Serbia +381</option>
          <option value="+30">Greece +30</option>
          <option value="+45">Denmark +45</option>
          <option value="+46">Sweden +46</option>
          <option value="+47">Norway +47</option>
          <option value="+383">Kosovo +383</option>
          <option value="+354">Iceland +354</option>
          <option value="+356">Malta +356</option>
          <option value="+420">Czechia +420</option>
          <option value="+358">Finland +358</option>
          <option value="+43">Austria +43</option>
          <option value="+40">Romania +40</option>
          <option value="+355">Albania +355</option>
          <option value="+375">Belarus +375</option>
          <option value="+36">Hungary +36</option>
          <option value="+377">Monaco +377</option>
          <option value="+379">Vatican City +379</option>
          <option value="+352">Luxembourg +352</option>
          <option value="+359">Bulgaria +359</option>
          <option value="+373">Moldova +373</option>
          <option value="+382">Montenegro +382</option>
          <option value="+387">Bosnia +387</option>
          <option value="+370">Lithuania +370</option>
          <option value="+372">Estonia +372</option>
          <option value="+353">Republic of Ireland +353</option>
          <option value="+386">Slovenia +386</option>
          <option value="+371">Latvia +371</option>
          <option value="+421">Slovakia +421</option>
          <option value="+376">Andorra +376</option>
          <option value="+389">North Macedonia +389</option>
          <option value="+423">Liechtenstein +423</option>
          <option value="+350">Gibraltar +350</option>
          <option value="+298">Faroe Islands +298</option>
          <option value="+378">San Marino +378</option>
        </select>
        {errorMessages?.phoneCode ? <div className="errorMessage">{errorMessages.phoneCode}</div> : null}
      </div>
    </div>
  );
}
  