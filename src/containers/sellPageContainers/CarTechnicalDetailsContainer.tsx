import { Car } from "../../../types";
import { FormInputText } from "../../components/Inputs/FormInputText";
import { NumericInput } from "../../components/Inputs/NumericInput";
import { Select } from "../../components/Inputs/Select";
import { errorMessagesSellPage } from '../../pages/SellPage/SellOrEditPageProps';

type CarTechnicalDetailsContainerProps = {
  carDefault?: Partial<Car> | null;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessages: Partial<errorMessagesSellPage>;
  handleFuelSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isSellPage: boolean;
  children?: React.ReactNode;
}



export function CarTechnicalDetailsContainer({children,  carDefault,  handleInputChange,  errorMessages,  handleFuelSelectChange,  handleSelectChange,  isSellPage} : CarTechnicalDetailsContainerProps) {
    
  return (

    <div className="form-container car-technical-details">
      <h3>Technical Details</h3>
      <FormInputText label="Make" placeholder="ex: Toyota" id="make" name="make" defaultValue={carDefault?.make} onChange={handleInputChange} maxLength={20} />
      {errorMessages.make && <div className="errorMessage">{errorMessages.make}</div>}
      <FormInputText label="Model" placeholder="ex: Corolla" id="model" name="model" defaultValue={carDefault?.model} onChange={handleInputChange} maxLength={20} />
      {errorMessages.model && <div className="errorMessage">{errorMessages.model}</div>}
      <Select classType="selectSell" label="Fuel Type" name="fuelType" id="selectFuelType" onChange={handleFuelSelectChange} defaultValue={isSellPage ? "Select Fuel Type" : carDefault?.fuelType}>
        <option value="">Select Fuel Type</option>
        <option value="gasoline">Gasoline</option>
        <option value="diesel">Diesel</option>
        <option value="electric">Electric</option>
        <option value="hybrid">Hybrid</option>
      </Select>
      {errorMessages.fuelType && <div className="errorMessage">{errorMessages.fuelType}</div>}
      <div className="form-input">
        <label htmlFor="madeYear">Year:</label>
        <NumericInput max={2023} onChange={handleInputChange} Name="madeYear" maxLength={4} defaultValueNr={carDefault?.madeYear} placeholder="YYYY" />
      </div>
      {errorMessages.madeYear && <div className="errorMessage">{errorMessages.madeYear}</div>}
      <div className="form-input">
        <label>Power [ HP ]:</label>
        <NumericInput max={1500} onChange={handleInputChange} Name="power" defaultValueNr={carDefault?.power} maxLength={4} placeholder="ex : 150 HP" />
      </div>
      {errorMessages.power && <div className="errorMessage">{errorMessages.power}</div>}
      
      <Select classType="selectSell" label="Door Number" name="DoorNumber" onChange={handleSelectChange} id="DoorNumberSelect" defaultValue={isSellPage ? "Select Door Number" : carDefault?.DoorNumber}>
        <option value={undefined}>Select Door Number</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option>
      </Select>
      {errorMessages.DoorNumber && <div className="errorMessage">{errorMessages.DoorNumber}</div>}
      <Select classType="selectSell" label="Drive Train" name="driveTrain" onChange={handleSelectChange} id="DriveWheelSelect" defaultValue={isSellPage ? "Select Drive Train" : carDefault?.driveTrain}>
        <option value="">Select Drive Train</option>
        <option value="awd">AWD</option>
        <option value="fwd">FWD</option>
        <option value="4wd">4WD</option>
        <option value="rwd">RWD</option>
      </Select>
      {errorMessages.driveTrain && <div className="errorMessage">{errorMessages.driveTrain}</div>}
      <FormInputText label="Version" placeholder="ex: 1.6" id="version" name="version" defaultValue={carDefault?.version} onChange={handleInputChange} maxLength={25} />
      {errorMessages.version && <div className="errorMessage">{errorMessages.version}</div>}
      <FormInputText label="Generation" placeholder="ex: 2nd" id="generation" name="generation" defaultValue={carDefault?.generation} onChange={handleInputChange} maxLength={25} />
      {errorMessages.generation && <div className="errorMessage">{errorMessages.generation}</div>}
      <Select classType="selectSell" label="Transmission" name="transmission" onChange={handleSelectChange} id="selectTransmission" defaultValue={isSellPage ? "Select Transmission" : carDefault?.transmission}>
        <option value="">Select Transmission</option>
        <option value="automatic">Automatic</option>
        <option value="manual">Manual</option>
      </Select>
      {errorMessages.transmission && <div className="errorMessage">{errorMessages.transmission}</div>}
      {children}
    </div>
  ) 
}
  
