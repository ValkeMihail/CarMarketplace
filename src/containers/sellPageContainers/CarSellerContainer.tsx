import { Car } from "../../../types";
import { FormInputText } from "../../components/Inputs/FormInputText";
import { NumericInput } from "../../components/Inputs/NumericInput";
import { errorMessagesSellPage } from "../../pages/SellPage/SellOrEditPageProps";



type CarSellerContainerProps = {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  carDefault?: Partial<Car> | null;
  errorMessages: Partial<errorMessagesSellPage>;
}

export function CarSellerContainer({  handleInputChange,  carDefault,  errorMessages} : CarSellerContainerProps) {
  return (
    <div className="form-container car-price">
      <h3>Evaluate</h3>
      <div className="form-input">
        <label>Price [ € ]:</label>
        <NumericInput max={1000000} onChange={handleInputChange} Name="price" defaultValueNr={carDefault?.price} maxLength={7} placeholder="ex : 4000 €" />
      </div>
      {errorMessages.price && <div className="errorMessage">{errorMessages.price}</div>}
      <div className="form-container car-seller-info">
        <h3>Seller Info</h3>
        <FormInputText label="Country" placeholder="ex: Germany" id="country" name="country" defaultValue={carDefault?.country} onChange={handleInputChange} maxLength={56} />
        {errorMessages.country && <div className="errorMessage">{errorMessages.country}</div>}
        <FormInputText label="City" placeholder="ex: Berlin" id="city" name="city" defaultValue={carDefault?.city} onChange={handleInputChange} maxLength={58} />
        {errorMessages.city && <div className="errorMessage">{errorMessages.city}</div>}
      </div>
    </div>
  );
}
  