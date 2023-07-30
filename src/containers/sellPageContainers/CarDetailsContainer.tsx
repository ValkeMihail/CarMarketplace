import { Car } from "../../../types";
import RadioInput from "../../components/Inputs/RadioInput";

type CarDetailsContainerProps = {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSellPage: boolean;
  carProperty? : Car["condition"];
  errorMessage: string;
}



export const CarDetailsContainer = ({handleInputChange, isSellPage, carProperty, errorMessage} : CarDetailsContainerProps) => {
  return (
    <div className="form-container car-details">
      <h3>Car Details</h3>
      <fieldset>
        <legend>Condition:</legend>
        <div>
          <RadioInput handleInputChange={handleInputChange} id="new" isSellPage={isSellPage} name="condition" checked={carProperty === "new"} />
          <label htmlFor="new">New</label>
        </div>
        <div>
          <RadioInput handleInputChange={handleInputChange} id="used" isSellPage={isSellPage} name="condition" checked={carProperty === "used"} />
          <label htmlFor="used">Used</label>
        </div>
      </fieldset>
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
    </div>
  );
}

  