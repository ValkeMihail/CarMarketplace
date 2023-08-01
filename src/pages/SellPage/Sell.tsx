import { Car } from "../../../types";
import FirstSection from "../../containers/sellPageContainers/sections/FirstSection";
import SecondSection from "../../containers/sellPageContainers/sections/SecondSection";
import { useState, useEffect } from "react";
import { Timestamp } from "../../utils/firebase";
import { SellOrEditPageProps, errorMessagesSellPage } from "./SellOrEditPageProps";


const DefaultCar: Car = {
  condition: "",
  carID: "",
  userID: "",
  userPhotoUrl: "",
  vin: "",
  milage: 0,
  dayOfFirstRegistration: 0,
  monthOfFirstRegistration: 0,
  yearOfFirstRegistration: 0,
  make: "",
  model: "",
  fuelType: "",
  madeYear: 0,
  power: 0,
  capacity: 0,
  DoorNumber: 0,
  transmission: "",
  driveTrain: "",
  color: "",
  warrantyKm: 0,
  version: "",
  price: 0,
  shortDescription: "",
  images: [],
  tags: [],
  generation: "",
  EmmisionStandard: "",
  c02Emission: 0,
  bodyWork: "",
  youtubeLink: "",
  longDescription: "",
  countryOfOrigin: "",
  country: "",
  city: "",
  createdAt: Timestamp.now(),
  searchKeywords: [] as string[],
};


export const SellOrEditPage = ({
  isSellPage,
  carDefault,
  id,
  updateDefaultCar,
}: SellOrEditPageProps) => {
  const [isSecondSectionOverlayVisible, setIsSecondSectionOverlayVisible] =
    useState(true);
  const [errorMessages, setErrorMessages] = useState(
    {} as errorMessagesSellPage
  );

  const [car, setCar] = useState<Car>(DefaultCar);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (carDefault) {
      setCar(carDefault);
      setTags(carDefault.tags);
    }
  }, [carDefault]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, inputMode } = event.target;
    if (inputMode == "numeric") {
      setCar((prevCar) => ({
        ...prevCar,
        [name]: Number(value.replace(/\s+/g, "")),
      }));
    } else {
      setCar((prevCar) => ({ ...prevCar, [name]: value }));
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name == "DoorNumber") {
      setCar((prevCar) => ({
        ...prevCar,
        [name]: Number(value.replace(/\s+/g, "")),
      }));
    } else {
      setCar((prevCar) => ({ ...prevCar, [name]: value }));
    }
  };

  const toggleSecondSection = () => {
    window.scrollTo(0, 0);
    setIsSecondSectionOverlayVisible(false);
  };

  return (
    <div className="container">
      <div className="sell-screen">
        <div className="first-container"></div>
        <h1 id="top">
          {isSellPage ? "Fill information:" : "Edit information:"}
        </h1>
        <div className="second-container">
          <FirstSection
            carDefault={carDefault}
            handleInputChange={handleInputChange}
            errorMessages={errorMessages}
            handleSelectChange={handleSelectChange}
            isSellPage={isSellPage}
            setCar={setCar}
            toggleSecondSection={toggleSecondSection}
          />
          <SecondSection
            car={car}
            setCar={setCar}
            errorMessages={errorMessages}
            setErrorMessages={setErrorMessages}
            isSellPage={isSellPage}
            tags={tags}
            setTags={setTags}
            isSecondSectionOverlayVisible={isSecondSectionOverlayVisible}
            carDefault={carDefault}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            id={id}
            updateDefaultCar={updateDefaultCar}
          />
        </div>
      </div>
    </div>
  );
};
