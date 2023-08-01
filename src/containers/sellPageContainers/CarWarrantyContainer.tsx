import { Car } from "../../../types";
import { NumericInput } from "../../components/Inputs/NumericInput";
import { errorMessagesSellPage } from "../../pages/SellPage/SellOrEditPageProps";



type CarWarrantyContainerProps = {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  carDefault?: Partial<Car> | null;
  errorMessages: Partial<errorMessagesSellPage>;
}


export const CarWarrantyContainer = ({
  handleInputChange,
  carDefault,
  errorMessages
} : CarWarrantyContainerProps) => {
  return (
    <div className="form-container car-warranty">
      <div className="form-input">
        <label>Waranty for :</label>
        <div className="unitsWrap">
          <NumericInput onChange={handleInputChange} Name="warrantyKm" defaultValueNr={carDefault?.warrantyKm} max={1000000} maxLength={7} placeholder="ex : 150 000 km" />
          <b>km</b>
        </div>
      </div>
      {errorMessages.warrantyKm && <div className="errorMessage">{errorMessages.warrantyKm}</div>}
    </div>
  )
}
  