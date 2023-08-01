import { Car } from "../../../types";
import { FormInputText } from "../../components/Inputs/FormInputText";
import { errorMessagesSellPage } from "../../pages/SellPage/SellOrEditPageProps";


type CarHistoryContainerProps = {
  carDefault?: Partial<Car> | null;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessages: Partial<errorMessagesSellPage>;
}

export const CarHistoryContainer = ({
  carDefault,
  handleInputChange,
  errorMessages
}: CarHistoryContainerProps ) => {
  return (
    <div className="form-container car-history">
      <h3>History</h3>
      <FormInputText label="Country of Origin" placeholder="ex: Germany" id="CountryOfOringin" name="countryOfOrigin" defaultValue={carDefault?.countryOfOrigin} onChange={handleInputChange} maxLength={56} />
      {errorMessages.countryOfOrigin && <div className="errorMessage">    {errorMessages.countryOfOrigin}  </div>}
    </div>
  )
}
  