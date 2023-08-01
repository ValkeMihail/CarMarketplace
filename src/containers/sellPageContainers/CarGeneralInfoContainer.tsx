import { Car } from "../../../types";
import { FormInputText } from "../../components/Inputs/FormInputText";
import { NumericInput } from "../../components/Inputs/NumericInput";
import { errorMessagesSellPage } from "../../pages/SellPage/SellOrEditPageProps";






type CarGeneralInfoContainerProps = {
  carProperties: Partial<Car>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessages: Partial<errorMessagesSellPage>;
}


export const CarGeneralInfoContainer = ({carProperties, handleInputChange, errorMessages} : CarGeneralInfoContainerProps) => {
  return (
    <>
      <div className="form-container car-general-information">
        <h3>General Information</h3>
        <FormInputText  label="VIN"  placeholder="ex: 4Y1SL65848Z411439"  id="vin"  name="vin"  defaultValue={carProperties?.vin}  onChange={handleInputChange}  maxLength={17}/>
        {errorMessages.vin && (  <div className="errorMessage">{errorMessages.vin}</div>)}
        <div className="form-input">
          <label>Milage [ km ]:</label>
          <NumericInput  placeholder="ex: 50 000 km"  id="milage"  defaultValueNr={carProperties?.milage}  Name="milage"  max={1_000_000}  onChange={handleInputChange}  maxLength={9}/>
        </div>
        {errorMessages.milage && (  <div className="errorMessage">{errorMessages.milage}</div>)}
        <label htmlFor="date-form">Date of first registration:</label>
        <div className="date-form">
          <div>
            <NumericInput  max={31}  maxLength={2}  defaultValueNr={carProperties?.dayOfFirstRegistration}  placeholder="DD"  onChange={handleInputChange}  Name="dayOfFirstRegistration"/>
          </div>
          <div>/</div>
          <div>
            <NumericInput  max={12}  maxLength={2}  onChange={handleInputChange}  Name="monthOfFirstRegistration"  placeholder="MM"  defaultValueNr={carProperties?.monthOfFirstRegistration}/>
          </div>
          <div>/</div>
          <div>
            <NumericInput  max={2023}  maxLength={4}  onChange={handleInputChange}  Name="yearOfFirstRegistration"  placeholder="YYYY"  defaultValueNr={carProperties?.yearOfFirstRegistration}/>
          </div>
        </div>
      </div>
      {(errorMessages.yearOfFirstRegistration || errorMessages.monthOfFirstRegistration || errorMessages.dayOfFirstRegistration) && (
        <div className="errorMessage">
          {errorMessages.yearOfFirstRegistration || errorMessages.monthOfFirstRegistration || errorMessages.dayOfFirstRegistration}
        </div>
      )}
    </>
  );
}