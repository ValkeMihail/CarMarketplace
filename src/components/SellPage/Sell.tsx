import { CarTechnicalDetailsContainer } from '../../containers/sellPageContainers/CarTechnicalDetailsContainer';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {  arrayUnion,  auth,  db,  addDoc,  collection,  updateDoc,  doc,  getDownloadURL,  uploadBytes,  ref,  storage,  Timestamp,  deleteObject,  getDoc,  increment} from "../../firebase";
import { ChangeEvent, useRef, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../AuthContext";
import { showToolTip } from "../Navigation/Footer";
import { Tags } from "../Tags";
import { NumericInput } from "../Inputs/NumericInput";
import { Select } from "../Inputs/Select";
import { Car } from "../../../types";
import { CarDetailsContainer } from "../../containers/sellPageContainers/CarDetailsContainer";
import { CarGeneralInfoContainer } from "../../containers/sellPageContainers/CarGeneralInfoContainer";
import { CarBodyContainer } from '../../containers/sellPageContainers/CarBodyContainer';
import { CarDescriptionContainer } from '../../containers/sellPageContainers/CarDescriptionContainer';
import { CarHistoryContainer } from '../../containers/sellPageContainers/CarHistoryContainer';
import { CarWarrantyContainer } from '../../containers/sellPageContainers/CarWarrantyContainer';
import { CarSellerContainer } from '../../containers/sellPageContainers/CarSellerContainer';


export type errorMessagesSellPage = {
  vin: string;
  milage: string;
  dayOfFirstRegistration: string;
  monthOfFirstRegistration: string;
  yearOfFirstRegistration: string;
  generation: string;
  condition: string;
  make: string;
  model: string;
  fuelType: string;
  madeYear: string;
  power: string;
  capacity: string;
  DoorNumber: string;
  transmission: string;
  images: string;
  driveTrain: string;
  color: string;
  price: string;
  shortDescription: string;
  version: string;
  EmmisionStandard: string;
  bodyWork: string;
  youtubeLink: string;
  longDescription?: string;
  countryOfOrigin: string;
  warrantyKm: string;
  country: string;
  city: string;
  c02Emission: string;
};

interface SellOrEditPageProps {
  isSellPage: boolean;
  carDefault: Car | null;
  id: string | null;
  updateDefaultCar?: (car: Car) => void;
}

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



export const SellOrEditPage = ({  isSellPage,  carDefault,  id,  updateDefaultCar}: SellOrEditPageProps) => {
  
  
  const { updateUserDoc } = useContext(AuthContext);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [isSecondSectionOverlayVisible, setIsSecondSectionOverlayVisible] = useState(true);
  const [errorMessages, setErrorMessages] = useState(  {} as errorMessagesSellPage);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [car, setCar] = useState<Car>(DefaultCar);
  const [isVehicleElectric, setIsVehicleElectric] = useState(false);

  useEffect(() => {
    if (carDefault) {
      setCar(carDefault);
      setTags(carDefault.tags);
    }
  }, [carDefault]);

  const handleAdImagesClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && car?.images) {
      if (selectedImages.length + files.length > 15 - car?.images.length) {
        showToolTip(  `You can only add up to ${15 - car?.images.length} images.`,  "red");
        return;
      }
      const newImages = Array.from(files);
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const deleteImage = async (image: string) => {
    const CarsRef = collection(db, "cars");
    const imageRef = ref(storage, `${image}`);
    await deleteObject(imageRef);
    if (id) {
      const carDoc = await getDoc(doc(CarsRef, id));
      if (carDoc.exists()) {
        const car = carDoc.data() as Car;
        const newImages = car.images.filter((img) => img !== image);
    
        await updateDoc(doc(CarsRef, id), { images: newImages });
    
        setCar((prevCar) => ({ ...prevCar, images: newImages }));
    
        if (updateDefaultCar && carDefault) {
          updateDefaultCar({
            ...carDefault,
            images: newImages,
          });
        }
      }
    }else {
      showToolTip("Something went wrong while deleting the image", "red");
    }
    
  };
  
  const removeImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  
  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    setCar((prevCar : Car) => ({ ...prevCar, tags: newTags }));
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value , inputMode} = event.target;
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
    if (  name == "DoorNumber") {
      setCar((prevCar) => ({
        ...prevCar,
        [name]: Number(value.replace(/\s+/g, "")),
      }));
    } else {
      setCar((prevCar) => ({ ...prevCar, [name]: value }));
    }
  };

  const handleFuelSelectChange = (  event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setCar((prevCar : Car) => ({ ...prevCar, [name]: value }));
    if ( value == "electric") setIsVehicleElectric(true);
    else setIsVehicleElectric(false);
  };


  const handleTextAreaChange = (  event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCar((prevCar) => ({ ...prevCar, [name]: value }));
  };

  const isValueEmpty = (value: string | number | undefined | null) => {
    if( typeof value == "string"){
      return value.trim() === "";
    } else {
      return value === undefined || value === null;
    }
  }


  const isValidDate = (year : number, month? : number, day? : number) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();
  
    if (  year < 1900 ||  year > currentYear) return false;
    if (month && (month < 1 || month > 12 )) return false;
    if (day && (day < 1 || day > 31 )) return false;


    if (
      (month === 2 && day && day > 29) ||
      ((month === 4 || month === 6 || month === 9 || month === 11) && day && day > 30) ||
      (month === 2 && day === 29 && year % 4 !== 0) ||
      (year === currentYear && month && month > currentMonth) ||
      (year === currentYear && month === currentMonth && day && day > currentDay)
    ) {
      return false;
    }
  
    return true;
  };


  const handleContinue = async () => {
    
    setErrorMessages({} as errorMessagesSellPage);
    const errors: Partial<errorMessagesSellPage> = {};

    const validations = [
      { key: "condition", validate: (value : string) => value === "" || isValueEmpty(value), message: "Please select a condition" },
      { key: "vin", validate: (value : string) => value.length !== 17 || isValueEmpty(value), message: "The VIN must be 17 characters long" },
      { key: "milage", validate: (value : number) => isValueEmpty(value) || value <= 0 || value > 1_000_000, message: "Please enter a valid mileage" },
      { key: "yearOfFirstRegistration", validate: (year : number, month : number, day : number) => !isValidDate(year, month, day), message: "Please enter a valid date" },
      { key: "make", validate: isValueEmpty, message: "You must enter a make" },
      { key: "model", validate: isValueEmpty, message: "You must enter a model" },
      { key: "fuelType", validate: isValueEmpty, message: "You must enter a fuel type" },
      { key: "madeYear", validate: (value  : number) => !isValidDate(value) || isValueEmpty(value), message: "Please enter a valid year" },
      { key: "power", validate: (value : number) => isValueEmpty(value) || value <= 0 || value > 1700, message: "Please enter a valid power" },
      { key: "capacity", validate: (value : number) => isValueEmpty(value) || value <= 0 || value > 10000, message: "Please enter a valid capacity" },
      { key: "DoorNumber", validate: (value : number) => isValueEmpty(value) || value <= 0, message: "Please select a door number" },
      { key: "driveTrain", validate: isValueEmpty, message: "Please select a drive train" },
      { key: "version", validate: isValueEmpty, message: "Please enter a valid version" },
      { key: "generation", validate: (value : string) => value == "" || isValueEmpty(value) , message: "Please enter a valid generation" },
      { key: "transmission", validate: isValueEmpty, message: "Please select a transmission" },
      { key: "EmmisionStandard", validate: isValueEmpty, message: "Please select an emission standard" },
      { key: "c02Emission", validate: (value : number) => isValueEmpty(value) || value <= 0, message: "Please enter a valid CO2 emission" },
      { key: "bodyWork", validate: isValueEmpty, message: "Please select a body type" },
      { key: "color", validate: isValueEmpty, message: "Please enter a valid color" },
      { key: "shortDescription", validate: isValueEmpty, message: "Please enter a short description" },
      { key: "longDescription", validate: isValueEmpty, message: "Please enter a long description" },
      { key: "countryOfOrigin", validate: isValueEmpty, message: "Please enter a valid country of origin" },
      { key: "price", validate: (value: number) => isValueEmpty(value) || value <= 0, message: "Please enter a valid price" },
      { key: "country", validate: isValueEmpty, message: "Please enter a valid country" },
      { key: "city", validate: isValueEmpty, message: "Please enter a valid city" },
      { key: "warrantyKm", validate: (value : number) => isValueEmpty(value) || value <= 0, message: "Please enter a valid warranty" },
    ];
    for (const { key, validate, message } of validations) {
      const value = car[key as keyof Car]; 
      
      if (validate(value as never, car.monthOfFirstRegistration, car.dayOfFirstRegistration)) {
        errors[key as keyof errorMessagesSellPage] = message; 
      }
    }
  
    if (car.fuelType !== "Electric") {
      if (isValueEmpty(car.EmmisionStandard)) {
        errors.EmmisionStandard = "Please select an emission standard";
      }
      if (car.c02Emission < 0 || isValueEmpty(car.c02Emission)) {
        errors.c02Emission = "Please enter a valid CO2 emission";
      }
    }
  
    if (selectedImages.length === 0 || selectedImages.length > 15) {
      if (isSellPage) errors.images = "Please select at least one image and at most 15 images";
    }
  
    const hasErrors = Object.keys(errors).length > 0;


    if (hasErrors) {
      setErrorMessages(errors as errorMessagesSellPage);
    } else {
      publishCarAd();
    }
  };
  

  const uploadImages = async () => {
    const imagesUrls = await Promise.all(
      selectedImages.map(async (image) => {

        if (!auth.currentUser) return null;
        const uploadUrl = `carImages/${auth.currentUser.uid}/Car added in ${car.createdAt.toDate()}/${image.name}`;
        const storageRef = ref(storage, uploadUrl);
        const uploadTask = uploadBytes(storageRef, image);
        const snapshot = await uploadTask;
        const url = await getDownloadURL(snapshot.ref);
        return url;
      })
    );
    return imagesUrls;
  }

  const publishCarAd = async () => {
    setErrorMessages({} as errorMessagesSellPage);
  
    try {
      if (!auth.currentUser) {
        showToolTip("You must be logged in to sell a car", "red");
        return;
      }
  
      const imagesUrls = await uploadImages();
  
      if (imagesUrls.includes(null)) {
        showToolTip("Failed to upload one or more images", "red");
        return;
      }
      
      const newCar = isSellPage ? 
      {  ...car,  images: imagesUrls.filter((url) => url !== null),  tags: tags,  userPhotoUrl: auth.currentUser?.photoURL || "",  userID: auth.currentUser?.uid || "",  searchKeywords: [    car.make.toLowerCase(),    car.model.toLowerCase(),    car.fuelType.toLowerCase(),    car.countryOfOrigin.toLowerCase(),    car.country.toLowerCase(),    car.city.toLowerCase(),  ],} 
      : {  ...car,  images: [...(carDefault?.images ?? []), ...imagesUrls.filter((url) => url !== null)],  tags: tags,  searchKeywords: [    car.make.toLowerCase(),    car.model.toLowerCase(),    car.fuelType.toLowerCase(),    car.countryOfOrigin.toLowerCase(),    car.country.toLowerCase(),    car.city.toLowerCase(),  ],};


      const carsCollection = collection(db, "cars");
      let carID = "";
  
      if (isSellPage) {
        const carDocRef = await addDoc(carsCollection, newCar);
        carID = carDocRef.id;
        await updateDoc(doc(db, "system", "counts"), { countCars: increment(1) }); 
        updateUserDoc({ adsArray: arrayUnion(carID) });
      } else if (id) {
        carID = id;
      }
  
      if (carID) {
        await updateDoc(doc(carsCollection, carID), newCar);
        showToolTip(isSellPage ? "Your ad has been added successfully!" : "Your Car ad has been updated", "green");
      }
    } catch (error) {
      if (error instanceof Error) {
        showToolTip(error.message as string, "red");
      }
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
        <h1 id="top">{isSellPage ? "Fill information:" : "Edit information:"}</h1>
        <div className="second-container">
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
          <div className="second-section" id="second-section">
            <CarBodyContainer
              handleInputChange={handleInputChange}
              errorMessages={{
                bodyWork: errorMessages.bodyWork,
                color: errorMessages.color,
              }}
              handleSelectChange={handleSelectChange}
              carDefault={{
                bodyWork: carDefault?.bodyWork,
                color: carDefault?.color,
                youtubeLink: carDefault?.youtubeLink,
              }}
              isSellPage={isSellPage}
            >
              <div className="form-container car-images">
                <h3>Images</h3>
                <output id="imageOutput">
                  {carDefault?.images.map((image: string, index: number) => (
                    <div className="image addedImage" key={image}>
                      <img src={image} alt="carImage" loading="lazy" />
                      <span onClick={() => deleteImage(car.images[index])}>
                        &times;
                      </span>
                    </div>
                  ))}
                  {selectedImages?.map((image: File, index: number) => (
                    <div className="image toAddImages" key={image.name}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image?.name}
                        loading="lazy"
                      />
                      <span onClick={() => removeImage(index)}>&times;</span>
                    </div>
                  ))}
                </output>
                {errorMessages.images && (
                  <div className="errorMessage">{errorMessages.images}</div>
                )}
                <div className="buttonwrap">
                  <button
                    onClick={handleAdImagesClick}
                    className="btn btn-social"
                  >
                    Add Images
                  </button>
                  <input
                    id="imageInput"
                    type="file"
                    ref={imageInputRef}
                    multiple={true}
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleImageChange}
                    maxLength={15 - (car?.images?.length || 0)}
                  />
                </div>
                <p>You can add up to 15 images. JPG, PNG formats are accepted.</p>
                &nbsp;
              </div>
            </CarBodyContainer>
  
            <CarDescriptionContainer
              errorMessages={{
                shortDescription: errorMessages.shortDescription,
                longDescription: errorMessages.longDescription,
              }}
              handleInputChange={handleInputChange}
              handleTextAreaChange={handleTextAreaChange}
              carDefault={{
                shortDescription: carDefault?.shortDescription,
                longDescription: carDefault?.longDescription,
              }}
            />
  
            <div className="form-container car-equipment">
              <Tags
                onTagsChange={handleTagsChange}
                selectedTags={car?.tags ?? []}
              />
            </div>
  
            <CarHistoryContainer
              carDefault={{ countryOfOrigin: carDefault?.countryOfOrigin }}
              handleInputChange={handleInputChange}
              errorMessages={{ countryOfOrigin: errorMessages.countryOfOrigin }}
            />
            <CarWarrantyContainer
              handleInputChange={handleInputChange}
              carDefault={{ warrantyKm: carDefault?.warrantyKm }}
              errorMessages={{ warrantyKm: errorMessages.warrantyKm }}
            />
            <CarSellerContainer
              handleInputChange={handleInputChange}
              carDefault={{
                price: carDefault?.price,
                country: carDefault?.country,
                city: carDefault?.city,
              }}
              errorMessages={{
                price: errorMessages.price,
                country: errorMessages.country,
                city: errorMessages.city,
              }}
            />
            <div
              id="continueButton"
              onClick={handleContinue}
              className="buttonwrap2"
            >
              <button className="btn btn-social">Continue</button>
            </div>
            <div
              className={
                isSecondSectionOverlayVisible
                  ? "secondOverlay"
                  : "secondOverlay-hidden"
              }
            >
              <div
                className={isSecondSectionOverlayVisible ? "text" : "text-hidden"}
              >
                please complete the first section
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

  