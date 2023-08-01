import { Car } from "../../../types";
import { FormInputText } from "../../components/Inputs/FormInputText";
import { Select } from "../../components/Inputs/Select";
import { errorMessagesSellPage } from "../../pages/SellPage/SellOrEditPageProps";
import lightbulb from "../../assets/lightbulb.png"

type CarBodyContainerProps = {
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isSellPage: boolean;
  carDefault?: Partial<Car> | null;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessages: Partial<errorMessagesSellPage>;
  children: React.ReactNode;
}

export const CarBodyContainer = ({children, handleSelectChange, errorMessages, isSellPage, carDefault, handleInputChange }: CarBodyContainerProps) => {
    
  return (
    <div className="form-container car-bodywork">
      <h3>Bodywork details</h3>
      <Select classType="selectSell" label="Bodywork Type" name="bodyWork" onChange={handleSelectChange} id="BodyworkSelect" defaultValue={isSellPage ? "Select Bodywork Type" : carDefault?.bodyWork}>
        <option value="">Select Bodywork Type</option>
        <option value="coupe">Coupe</option>
        <option value="sedan">Sedan</option>
        <option value="Sports Car">Sports Car</option>
        <option value="Station Wagon">Station Wagon</option>
        <option value="Hatchback">Hatchback</option>
        <option value="Convertible">Convertible</option>
        <option value="SUV">SUV</option>
        <option value="Minivan">Minivan</option>
        <option value="Pickup Truck">Pickup Truck</option>
        <option value="Campervan ">Campervan </option>
        <option value="Micro Car ">Micro Car </option>
        <option value="Muscle Car ">Muscle Car </option>
        <option value="Limousine ">Limousine </option>
        <option value="Jeep ">Jeep </option>
      </Select>
      {errorMessages.bodyWork && <div className="errorMessage">{errorMessages.bodyWork}</div>}
      <FormInputText label="Color" placeholder="ex: Black" id="carColor" name="color" defaultValue={carDefault?.color} onChange={handleInputChange} maxLength={10} />
      {errorMessages.color && <div className="errorMessage">{errorMessages.color}</div>}
      {children}
      <div className="info-container">
        <img src={lightbulb} alt="info-vin" />
        <p>
          Increase the attractiveness of the ad by adding a YouTube link
          with a recording of the vehicle.
        </p>
      </div>
      <FormInputText label="Youtube Video" placeholder="ex: https://www.youtube.com/watch?v=dip20zckA" id="YouTubelink" name="youtubeLink" defaultValue={carDefault?.youtubeLink} onChange={handleInputChange} />
    </div>
  )
}
  

