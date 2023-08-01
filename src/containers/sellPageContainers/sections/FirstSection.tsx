import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NumericInput } from "../../../components/Inputs/NumericInput"
import { Select } from "../../../components/Inputs/Select"
import { CarDetailsContainer } from "../CarDetailsContainer"
import { CarGeneralInfoContainer } from "../CarGeneralInfoContainer"
import { CarTechnicalDetailsContainer } from "../CarTechnicalDetailsContainer"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { Car } from "../../../../types"
import { errorMessagesSellPage } from "../../../pages/SellPage/SellOrEditPageProps"

type FirstSectionProps = {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  isSellPage: boolean
  carDefault: Car | null 
  errorMessages: errorMessagesSellPage
  toggleSecondSection: () => void
  setCar: React.Dispatch<React.SetStateAction<Car>>
}


const FirstSection = ({
  handleInputChange,
  handleSelectChange,
  isSellPage,
  carDefault,
  errorMessages,
  toggleSecondSection,
  setCar,
}: FirstSectionProps) => {


  const [isVehicleElectric, setIsVehicleElectric] = useState(false)


  const handleFuelSelectChange = (  event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setCar((prevCar : Car) => ({ ...prevCar, [name]: value }));
    if ( value == "electric") setIsVehicleElectric(true);
    else setIsVehicleElectric(false);
  };


  return (
    <div id="first-section" className="first-section">
      <CarDetailsContainer
        handleInputChange={handleInputChange}
        isSellPage={isSellPage}
        carProperty={carDefault?.condition}
        errorMessage={errorMessages.condition}
      />

      <CarGeneralInfoContainer
        handleInputChange={handleInputChange}
        carProperties={{
          vin: carDefault?.vin,
          milage: carDefault?.milage,
          dayOfFirstRegistration: carDefault?.dayOfFirstRegistration,
          monthOfFirstRegistration: carDefault?.monthOfFirstRegistration,
          yearOfFirstRegistration: carDefault?.yearOfFirstRegistration,
        }}
        errorMessages={{
          vin: errorMessages.vin,
          milage: errorMessages.milage,
          dayOfFirstRegistration: errorMessages.dayOfFirstRegistration,
          monthOfFirstRegistration: errorMessages.monthOfFirstRegistration,
          yearOfFirstRegistration: errorMessages.yearOfFirstRegistration,
        }}
      />

      <CarTechnicalDetailsContainer
        carDefault={{ 
          make: carDefault?.make,
          model: carDefault?.model,
          fuelType: carDefault?.fuelType,
          madeYear: carDefault?.madeYear,
          power: carDefault?.power,
          DoorNumber: carDefault?.DoorNumber,
          driveTrain: carDefault?.driveTrain,
          version: carDefault?.version,
          transmission: carDefault?.transmission,
          generation: carDefault?.generation,
        }}
        handleInputChange={handleInputChange}
        handleFuelSelectChange={handleFuelSelectChange}
        isSellPage={isSellPage}
        handleSelectChange={handleSelectChange}
        errorMessages={{
          make: errorMessages.make,
          model: errorMessages.model,
          fuelType: errorMessages.fuelType,
          madeYear: errorMessages.madeYear,
          power: errorMessages.power,
          DoorNumber: errorMessages.DoorNumber,
          driveTrain: errorMessages.driveTrain,
          version: errorMessages.version,
          transmission: errorMessages.transmission,
          generation: errorMessages.generation,
        }}
      >
        <div className="form-input">
          <label>
            {isVehicleElectric
              ? "Battery Capacity [ kwh ]"
              : "Cilinder Capacity [ cm3 ]"}
            :
          </label>
          <NumericInput
            onChange={handleInputChange}
            Name="capacity"
            max={8400}
            defaultValueNr={carDefault?.capacity}
            maxLength={4}
            placeholder={
              isVehicleElectric ? "Battery Capacity" : "Cilinder Capacity"
            }
          />
        </div>
        {errorMessages.capacity && (
          <div className="errorMessage">{errorMessages.capacity}</div>
        )}
        {isVehicleElectric ? null : (
          <>
            <Select
              classType="selectSell"
              label="Emmission Standard"
              name="EmmisionStandard"
              onChange={handleSelectChange}
              id="EmmisionStandardSelect"
              defaultValue={
                isSellPage
                  ? "Select Emmision Standard"
                  : carDefault?.EmmisionStandard
              }
            >
              <option value="">Select Emmision Standard</option>
              <option value="Euro1">Euro 1</option>
              <option value="Euro2">Euro 2</option>
              <option value="Euro3">Euro 3</option>
              <option value="Euro4">Euro 4</option>
              <option value="Euro5">Euro 5</option>
              <option value="Euro6">Euro 6</option>
            </Select>
            {errorMessages.EmmisionStandard && (
              <div className="errorMessage">
                {" "}
                {errorMessages.EmmisionStandard}{" "}
              </div>
            )}
            <div className="form-input">
              <label>CO2 Emissions [ g/km ]:</label>
              <NumericInput
                onChange={handleInputChange}
                Name="c02Emission"
                max={500}
                defaultValueNr={carDefault?.c02Emission}
                maxLength={3}
                placeholder="ex : 150 g/km"
              />
            </div>
            {errorMessages.c02Emission && (
              <div className="errorMessage">
                {" "}
                {errorMessages.c02Emission}{" "}
              </div>
            )}
          </>
        )}
      </CarTechnicalDetailsContainer>

      <div className="circle-arrow-wrapper">
        <a className="arrow-circle" onClick={toggleSecondSection}>
          <FontAwesomeIcon icon={faArrowRight} />
        </a>
      </div>
    </div>
  )
}

export default FirstSection
