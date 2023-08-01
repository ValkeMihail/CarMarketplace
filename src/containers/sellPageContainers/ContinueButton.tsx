import { Car } from "../../../types";
import { AuthContext } from "../../context/auth/AuthContext";
import { errorMessagesSellPage } from "../../pages/SellPage/SellOrEditPageProps";
import { addDoc, arrayUnion, auth, collection, db, doc, getDownloadURL, increment, ref, storage, updateDoc, uploadBytes } from "../../utils/firebase";
import { showToolTip } from "../../utils/helpers";
import {useContext} from "react";



type ContinueButtonProps = {
  car: Car;
  isSellPage: boolean;
  carDefault: Car | null;
  tags: string[];
  setErrorMessages: React.Dispatch<React.SetStateAction<errorMessagesSellPage>>;
  selectedImages: File[];
  id: string | null ;
}


const ContinueButton = ({
  id,
  car,
  isSellPage,
  carDefault,
  tags,
  setErrorMessages,
  selectedImages

}: ContinueButtonProps) => {


  const { updateUserDoc } = useContext(AuthContext);

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
  
  return (
    <div>
      <div
        id="continueButton"
        onClick={handleContinue}
        className="buttonwrap2"
      >
        <button className="btn btn-social">Continue</button>
      </div>
    </div>
  )
}

export default ContinueButton
