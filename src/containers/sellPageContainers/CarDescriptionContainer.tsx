import { Car } from "../../../types";
import { FormInputText } from "../../components/Inputs/FormInputText";
import { errorMessagesSellPage } from "../../pages/SellPage/SellOrEditPageProps";


type CarDescriptionContainerProps = {
  carDefault?: Partial<Car> | null;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextAreaChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errorMessages: Partial<errorMessagesSellPage>;
}



export const CarDescriptionContainer = ({
  carDefault,
  handleInputChange,
  errorMessages,
  handleTextAreaChange
} : CarDescriptionContainerProps) => {
  return (
    <div className="form-container car-description">
      <h3>Vehicle Description</h3>
      <FormInputText label="Short Description" placeholder="ex: Dodge Challenger" id="shortDescription" name="shortDescription" defaultValue={carDefault?.shortDescription} onChange={handleInputChange} maxLength={25} />
      {errorMessages.shortDescription && <div className="errorMessage">    {errorMessages.shortDescription}  </div>}
      <div className="form-input">
        <label>Description:</label>
        <textarea onChange={handleTextAreaChange} maxLength={199} id="longDescription" name="longDescription" defaultValue={carDefault?.longDescription} />
      </div>
      {errorMessages.longDescription && <div className="errorMessage">    {errorMessages.longDescription}  </div>}
    </div>
  )
}
  