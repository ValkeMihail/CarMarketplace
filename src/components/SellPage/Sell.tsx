
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import lightbulb from "../../assets/lightbulb.png"
import {arrayUnion,auth, db ,addDoc,collection,updateDoc,doc, getDownloadURL, uploadBytes, ref, storage, Timestamp, deleteObject, getDoc, increment } from "../../firebase"
import {  ChangeEvent,useRef ,useContext, useState , useEffect} from "react";

import { AuthContext } from '../../AuthContext';
import { showToolTip } from "../Navigation/Footer"

import { Tags } from "./Tags"
import { NumericInput } from "./NumericInput";


export interface Car {
    condition: string;
    carID: string;
    userID: string;
    userPhotoUrl: string;
    vin: string;
    milage: number;
    dayOfFirstRegistration: number;
    monthOfFirstRegistration: number;
    yearOfFirstRegistration: number;
    generation: string;
    make: string;
    model: string;
    fuelType: string;
    madeYear: number;
    power: number;
    capacity: number;
    DoorNumber: number;
    transmission: string;
    driveTrain: string;
    color: string;
    price: number;
    shortDescription: string;
    images: string[];
    tags: string[];
    version: string;
    EmmisionStandard : string;
    bodyWork : string;
    youtubeLink : string;
    longDescription? : string;
    countryOfOrigin : string;
    warrantyKm : number;
    country : string;
    city : string;
    createdAt : Timestamp;
    c02Emission : number;
    searchKeywords : string[];
  }

type errorMessagesSellPage = {
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
    EmmisionStandard : string;
    bodyWork : string;
    youtubeLink : string;
    longDescription? : string;
    countryOfOrigin : string;
    warrantyKm : string;
    country : string;
    city : string;
    c02Emission : string;
};


interface SellOrEditPageProps{
    isSellPage : boolean;
    carDefault: Car | null;
    id : string | null;
    updateDefaultCar? : (car : Car) => void;
}


/**
 * @description Sell page component
 * @returns Sell page component as jsx element
*/
export const SellOrEditPage = ({
    isSellPage,
    carDefault,
    id,
    updateDefaultCar
} : SellOrEditPageProps) => {
    
    const [isSecondSectionOverlayVisible, setIsSecondSectionOverlayVisible] = useState(true)
    const {updateUserDoc} = useContext(AuthContext);
    const [errorMessages, setErrorMessages] = useState({} as errorMessagesSellPage);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [isVehicleElectric, setIsVehicleElectric] = useState(false)
    const [tags, setTags] = useState<string[]>([]);
    
    const imageInputRef = useRef<HTMLInputElement>(null);
    
    // this is the car object that will be sent to the database when the user clicks the "sell" button 
    const [car, setCar] = useState<Car>({
        condition: "new",
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
        EmmisionStandard : "",
        c02Emission : 0,
        bodyWork : "",
        youtubeLink : "",
        longDescription : "",
        countryOfOrigin : "",
        country : "",
        city : "",
        createdAt : Timestamp.now(),
        searchKeywords : [] as string[],
    });
    


    useEffect(() => {
        if (carDefault) {
            setCar(carDefault);
            setTags(carDefault.tags);
        }

    }, [carDefault]);

    /**
     * @description this function triggers a click on the hidden input file element
     */    
    const handleAdImagesClick = () => {
        if (imageInputRef.current) {
        imageInputRef.current.click();
        }
    };


   /**
     * @description function that handles the change event on the input element for the images and sets the selected images state based on the selected files
     * @param event  the change event that will fire as a result of the change on the input element
     * @returns  
     */
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0 && car?.images) {
            if (selectedImages.length + files.length > 15-car?.images.length) {
                showToolTip(`You can only add up to ${15-car?.images.length} images.` ,"red");
                return;
            }
            const newImages = Array.from(files);
            setSelectedImages((prevImages) => [...prevImages, ...newImages]);
        }
    };

   
 /**
     * @description function that deletes an image from the storage and the corresponding url from the database based
     *  on the image url and update the car ad data and the state of the component
     * @param image  the url of the image that will be deleted
     */
 const deleteImageFromStorageAndDB = async (image: string) => {
    const CarsRef = collection(db, "cars");
    const imageRef = ref(storage, `${image}`);
    await deleteObject(imageRef);
    const carDoc = await getDoc(doc(CarsRef, id!));
    if (carDoc.exists()) {
        const car = carDoc.data() as Car;
        const newImages = car.images.filter((img) => img !== image);
        await updateDoc(doc(CarsRef, id!), { images: newImages });
        setCar((prevCar?) => ({ ...prevCar!, images: newImages }));
        if  (updateDefaultCar){
            updateDefaultCar({
                ...carDefault!,
                images: newImages,
            });

        }
    }
};

   

    /**
     * @description this function handles the change of the tags state
     * @param newTags  - the new tags
     */
    const handleTagsChange = (newTags: string[]) => {
        setTags(newTags);
        setCar((prevCar) => ({ ...prevCar, tags: newTags }));
    };


    /**
     * @description this function handles the deletion of an image from the selectedImages state
     * @param index  - the index of the image to be deleted
     */
    const deleteImage = (index: number) => {
        setSelectedImages((prevImages) =>
        prevImages.filter((_, i) => i !== index)
        );
    };
    

    /**
     * @description this function triggers the update of the car object when the user changes an input field
     * @param event  - the event that triggered the function which is the change of the input field
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
       
        if (
            name == "price" || 
            name == "milage" ||
            name == "power" ||
            name == "capacity" ||
            name == "DoorNumber" ||
            name == "warrantyKm" ||
            name == "c02Emission" ||
            name == "yearOfFirstRegistration" ||
            name == "dayOfFirstRegistration"||
            name == "monthOfFirstRegistration"||
            name == "madeYear"

            
        
        ) {
            setCar((prevCar) => ({
                ...prevCar,
                [name]:             
                    Number(
                        value.replace(/\s+/g, '')
                    )   
            }));
           
        
        
        
        }else{
            setCar((prevCar) => ({ ...prevCar, [name]: value }));
        }
        
       
    };
        
    
    /**
     * @description this function triggers the update of the car object when the user changes a select field
     * @param event  - the event that triggered the function which is the change of the select field
     */
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

        const { name, value } = event.target;
        if (
            name == "price" || 
            name == "milage" ||
            name == "power" ||
            name == "capacity" ||
            name == "DoorNumber" ||
            name == "warrantyKm" ||
            name == "c02Emission" ||
            name == "yearOfFirstRegistration" ||
            name == "dayOfFirstRegistration"||
            name == "monthOfFirstRegistration"||
            name == "madeYear"

            
        
        ) {
            setCar((prevCar) => ({
                ...prevCar,
                [name]:             
                    Number(
                        value.replace(/\s+/g, '')
                    )   
            }));
           
        
        
        
        }else{
            setCar((prevCar) => ({ ...prevCar, [name]: value }));
        }
        
    };
      
    const handleFuelSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setCar((prevCar) => ({ ...prevCar, [name]: value }));
        setIsVehicleElectric(carDefault!?.fuelType === "electric" ? true : false)
    };
    /**
     * @description this function triggers the update of the car object when the user changes a textarea field
     * @param event  - the event that triggered the function which is the change of the textarea field
     */
    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCar((prevCar) => ({ ...prevCar, [name]: value }));
    };

    const handleContinue = async () => {
       
        setErrorMessages ({} as errorMessagesSellPage);
        const errors: Partial<errorMessagesSellPage> = {};
        if(car.condition.trim() === "" || car.condition === undefined || car.condition === null){
           errors.condition = "Please select a condition";
        }
        // check if the user has entered a valid VIN
         if(car.vin.length !== 17  || car.vin.trim() === "" || car.vin === undefined || car.vin === null){ 
            errors.vin = "The VIN must be 17 characters long";
            
        }
        // check if the user has entered a valid car milage
         if(car.milage < 0 || car.milage === undefined || car.milage === null || car.milage  > 1_000_000){
            errors.milage = "Please enter a valid milage";
            
        }
        // check if the user has entered a valid day of first registration
        if(car.dayOfFirstRegistration < 1 ||
            car.dayOfFirstRegistration > 31 ||
            car.dayOfFirstRegistration === undefined ||
            car.dayOfFirstRegistration === null || (car.monthOfFirstRegistration === 2 && car.dayOfFirstRegistration > 29) ||
            ((car.monthOfFirstRegistration === 4 || car.monthOfFirstRegistration === 6 || car.monthOfFirstRegistration === 9 || car.monthOfFirstRegistration === 11) && car.dayOfFirstRegistration > 30)
            || (car.monthOfFirstRegistration === 2 && car.dayOfFirstRegistration === 29 && car.yearOfFirstRegistration % 4 !== 0) ||
            (car.yearOfFirstRegistration == Timestamp.now().toDate().getFullYear() && car.monthOfFirstRegistration > Timestamp.now().toDate().getMonth() + 1) ||
            (car.yearOfFirstRegistration == Timestamp.now().toDate().getFullYear() && car.monthOfFirstRegistration === Timestamp.now().toDate().getMonth() + 1 && car.dayOfFirstRegistration > Timestamp.now().toDate().getDate())
            ){
            errors.dayOfFirstRegistration = "Please enter a valid date";
            
        }
        // check if the user has entered a valid month of first registration
        if(car.monthOfFirstRegistration < 1 || car.monthOfFirstRegistration > 12 || car.monthOfFirstRegistration === undefined || car.monthOfFirstRegistration === null){
            errors.monthOfFirstRegistration = "Please enter a valid date";
        }
        // check if the user has entered a valid year of first registration
        if(car.yearOfFirstRegistration < 1900 || car.yearOfFirstRegistration > Timestamp.now().toDate().getFullYear() 
        || car.yearOfFirstRegistration === undefined || car.yearOfFirstRegistration === null){
            errors.yearOfFirstRegistration = "Please enter a valid date";
            
        }
        // check if the user has entered a valid make 
        if(car.make.trim() === "" 
            || car.make === undefined || car.make === null){
            errors.make = "You must enter a make";
            
        }
        // check if the user has entered a valid model
        if(car.model.trim() === "" 
            || car.model === undefined || car.model === null){
            errors.model = "You must enter a model";
            
        }
        // check if the user has entered a valid fuel type
        if(car.fuelType === "" || car.fuelType === undefined || car.fuelType === null){
            errors.fuelType = "You must enter a fuel type";
             
        }
        // check if the user has entered a valid made year
        if(car.madeYear < 1900 || car.madeYear > Timestamp.now().toDate().getFullYear() || car.madeYear === undefined || car.madeYear === null ){
            errors.madeYear = "Please enter a valid year";
            
        }
        // check if the user has entered a valid power 
        if(car.power < 0 || car.power === undefined || car.power === null || car.power > 1700){
            errors.power = "Please enter a valid power";
            
        }
        // check if cilinder or battery capacity is valid
        if(car.capacity < 0 || car.capacity === undefined || car.capacity === null || car.capacity > 10000){
            errors.capacity = "Please enter a valid capacity";
            
        }
        //checkf if the user selected a door number 
        if( car.DoorNumber == 0 || car.DoorNumber === undefined || car.DoorNumber === null){
            errors.DoorNumber = "Please select a door number";
            
        }
        // check if user selected a drive train 
        if(car.driveTrain === "" || car.driveTrain === undefined || car.driveTrain === null){
            errors.driveTrain = "Please select a drive train";
            
        }
        //check if the user entered a valid version
        if(car.version.trim() === "" || car.version === undefined || car.version === null){
                errors.version = "Please enter a valid version";
        }
        // check if the user entered a valid generation
        if(car.generation.trim() === "" || car.generation === undefined || car.generation === null){
                errors.generation = "Please enter a valid generation";
        }
        //check if the user selected a transmission

        if(car.transmission === "" || car.transmission === undefined || car.transmission === null){
            errors.transmission = "Please select a transmission";
        }

        // check if the user entered a non electric vehicle 
        if (car.fuelType !== "Electric") {
            // check if the user selected an emm    ission class
            if(car.EmmisionStandard === "" || car.EmmisionStandard === undefined || car.EmmisionStandard === null){
                errors.EmmisionStandard = "Please select an emission standard";
            }
            //check if the user entered a c02 emission
            if(car.c02Emission < 0 || car.c02Emission === undefined || car.c02Emission === null){
                errors.c02Emission = "Please enter a valid c02 emission";
            }
            //check if the user entered a valid mileage
        }

        // check if the user selected a body type
        if(car.bodyWork === "" || car.bodyWork === undefined || car.bodyWork === null){
            errors.bodyWork = "Please select a body type";
        }
        // check if the user entered a valid color
        if(car.color.trim() === "" || car.color === undefined || car.color === null){
            errors.color = "Please enter a valid color";
        }
        //check if the user entered at least one image and at most 15 images
        if(selectedImages.length === 0 || selectedImages.length > 15){
            if (isSellPage) errors.images = "Please select at least one image and at most 15 images";
        }
        // check if the user entered a short description
        if(car.shortDescription.trim() === "" || car.shortDescription === undefined || car.shortDescription === null){
            errors.shortDescription = "Please enter a short description";
        }
        // check if the user entered a long description
        if(car.longDescription?.trim() === "" || car.longDescription === undefined || car.longDescription === null){
            errors.longDescription = "Please enter a long description";
        }
        // check if the user entered a valid country of origin
        if(car.countryOfOrigin.trim() === "" || car.countryOfOrigin === undefined || car.countryOfOrigin === null){
            errors.countryOfOrigin = "Please enter a valid country of origin";
        }
        // check if the user entered a valid price
        if(car.price < 0 || car.price === undefined || car.price === null){
            errors.price = "Please enter a valid price";
        }

        // check if the user entered a valid country
        if(car.country.trim() === "" || car.country === undefined || car.country === null){
            errors.country = "Please enter a valid country";
        }
        // check if the user entered a valid city
        if(car.city.trim() === "" || car.city === undefined || car.city === null){
            errors.city = "Please enter a valid city";
        }

        const hasErrors = Object.keys(errors).length > 0;

        if (hasErrors) {
           
            setErrorMessages(errors as errorMessagesSellPage);
            return;
        }else{
            checkErrorsAndProceed();
        }
       

    };


    const checkErrorsAndProceed = async() => {
        const errorsExist = Object.keys(errorMessages).length > 0;
        if (errorsExist) {
            showToolTip("There are error messages, try again" , "red"); return;
         }else{
            if(isSellPage == true) {
                await updateDoc(doc(db,"system","counts"), {
                    countCars : increment(1)
                });
                try{
                    // this uploads the images to the firebase storage and returns the urls of the images after they are uploaded 
                    const imagesUrls = await Promise.all(
                        selectedImages.map(async (image) => {
                            const storageRef =  ref(storage, `carImages/${auth!?.currentUser!.uid!}/Car added in ${car.createdAt.toDate()}/${image.name}`);
                            const uploadTask =  uploadBytes(storageRef, image);
                            const snapshot = await uploadTask;
                            const url = await getDownloadURL(snapshot.ref);
                            return url;
                        })
                    );
                    
                    // Create a new `car` object with the updated `images` field
                    let newCar = {
                        ...car,
                        images: imagesUrls,
                        tags: tags, 
                        userPhotoUrl : auth.currentUser!.photoURL!,
                        userID : auth.currentUser!.uid,
                        carID : "",
                    };
                    
                    // Add the new `car` object to the `cars` collection
                    const carsCollection = collection(db, "cars");
                    const carDocRef = await addDoc(carsCollection, newCar);
                    const carID = carDocRef.id;
                    
                    // Update the state with the new `car` object
                    setCar(newCar);
                    updateUserDoc({
                        adsArray : arrayUnion(carID)
                    });
                    newCar = {
                        ...newCar,
                        carID : carID,
                        searchKeywords :[
                            newCar.make.toLowerCase(),
                            newCar.model.toLowerCase(),
                            newCar.fuelType.toLowerCase(),
                            newCar.countryOfOrigin.toLowerCase(),
                            newCar.country.toLowerCase(),
                            newCar.city.toLowerCase()
                        ]
                    }
                    await updateDoc(doc(carsCollection, carID), newCar);
                    showToolTip("Your ad has been added successfully!" , "green" );
    
                }catch(error : any){
                    showToolTip(error.message as string, "red");
                }
            }else{
                try{
                    const imagesUrls = await Promise.all(
                        selectedImages.map(async (image) => {
                        const storageRef =  ref(storage, `carImages/${auth.currentUser!.uid}/Car added in ${car?.createdAt.toDate()}/${image.name}`);
                        const uploadTask =  uploadBytes(storageRef, image);
                        const snapshot = await uploadTask;
                        const url = await getDownloadURL(snapshot.ref);
                        return url;
                        })
                    ); 
                    // Create a new `car` object with the updated `images` field
                    const newCar = {
                        ...car,
                        images: arrayUnion(...imagesUrls),
                        tags: tags, 
                        searchKeywords :[
                            car.make.toLowerCase(),
                            car.model.toLowerCase(),
                            car.fuelType.toLowerCase(),
                            car.countryOfOrigin.toLowerCase(),
                            car.country.toLowerCase(),
                            car.city.toLowerCase()
                        ]
                    };  
                    // Update the car doc from the id param with the new car object
                    const carsCollection = collection(db, "cars");
                    await updateDoc(doc(carsCollection, id!), newCar);
                    showToolTip("Your Car ad has been updated", "green");
                   
        
                }catch(error : any){
                    showToolTip(error.message as string, "red");
                }
            }
        }
       
    };

    /**
     * @description this function handles the click on the continue button and makes the second section accessible and also scrolls to the top of the page
     */
    const toggleSecondSection = () => {
        window.scrollTo(0, 0);
        setIsSecondSectionOverlayVisible(false);
    }
        
    return (
    <div className="container">
      <div className="sell-screen">
        <div className="first-container">
        </div>
        <h1 id="top">{isSellPage ? "Fill information:" : "Edit information:" }</h1>
        <div className="second-container">
          <div id="first-section" className="first-section">
            <div className="form-container car-details">
              <h3>Car Details</h3>
              <fieldset>
    <legend>Condition:</legend>
    <div>


        {isSellPage ? (
            <input
                onChange={handleInputChange}
                type="radio"
                id="new"
                value="new"
                name="condition"
                defaultChecked={true}
            />
        ):(
            
            <input
                onChange={handleInputChange}
                type="radio"
                id="new"
                value="new"
                name="condition"
                checked={ carDefault?.condition === "new"}
            />
        )

        }
        <label htmlFor="new">New</label>
    </div>
    <div>

    {isSellPage ? (
            <input
                onChange={handleInputChange}
                type="radio"
                value="used"
                id="used"
                name="condition"
                
            />
        ):(
            
            <input
                onChange={handleInputChange}
                type="radio"
                value="used"
                id="used"
                name="condition"
                checked={carDefault?.condition === "used"}
            />
        )

        }
        
        <label htmlFor="used">Used</label>
    </div>
</fieldset>


              { errorMessages.condition &&
                (
                    <div className="errorMessage">
                        {errorMessages.condition}
                    </div>
                )
              }
            </div>
            <div className="form-container car-general-information">
              <h3>General Information</h3>
              <div className="form-input">
                <label>VIN:</label>
                <input
                  name="vin"
                  maxLength={17}
                  defaultValue={carDefault!?.vin}
                  onChange={handleInputChange}
                  id="vin"
                  type="text"
                  placeholder="ex: 4Y1SL65848Z411439"
                />
                
              </div>
                { 
                    errorMessages.vin &&(
                        <div className="errorMessage">
                            {errorMessages.vin}
                        </div>
                    )  
                }
              <div className="form-input">
                <label>Milage [ km ]:</label> 
                <NumericInput 
                    placeholder="ex: 50 000 km"
                    id="milage"
                    defaultValueNr={carDefault!?.milage}
                    Name="milage" 
                    max={1_000_000}
                    onChange ={handleInputChange} 
                    maxLength={9} />
              </div>
                    { 
                    errorMessages.milage &&(
                        <div className="errorMessage">
                            {errorMessages.milage}
                        </div>
                    )  
                    }
              <label htmlFor="date-form">Date of first registration:</label>
              <div className="date-form">
                <div>
                  <NumericInput
                    max={31}
                    maxLength={2}
                    defaultValueNr={carDefault!?.dayOfFirstRegistration}
                    placeholder="DD"
                    onChange={handleInputChange}
                    Name="dayOfFirstRegistration"
                  />
                </div>
                <div>/</div>
                <div>
                <NumericInput
                    max={12}
                    maxLength={2}
                    onChange={handleInputChange}
                    Name="monthOfFirstRegistration"
                    placeholder="MM"
                    defaultValueNr={carDefault!?.monthOfFirstRegistration}
                  />
                </div>
                <div>/</div>
                <div>
                  <NumericInput
                    max={2023}
                    maxLength={4}
                    onChange={handleInputChange}
                    Name="yearOfFirstRegistration"
                    placeholder="YYYY"
                    defaultValueNr={carDefault!?.yearOfFirstRegistration}
                  />
                </div>
              </div>
             
            </div>
            {(errorMessages.yearOfFirstRegistration || errorMessages.monthOfFirstRegistration || errorMessages.dayOfFirstRegistration) &&(
                        <div className="errorMessage">
                            {errorMessages.yearOfFirstRegistration || errorMessages.monthOfFirstRegistration || errorMessages.dayOfFirstRegistration}
                        </div>
                    )  
                }
            <div className="form-container car-technical-details">
              <h3>Technical Details</h3>
              <div className="form-input">
                <label htmlFor="make">Make:</label>
                <input maxLength={20}
                    onChange={handleInputChange}
                    name="make"
                    id="make" 
                    type="text" 
                    placeholder="Make" 
                    defaultValue={carDefault!?.make}/>
              </div>
              { 
                    errorMessages.make &&(
                        <div className="errorMessage">
                            {errorMessages.make}
                        </div>
                    )  
                }
              <div className="form-input">
                <label>Model:</label>
                <input 
                    maxLength={25} 
                    onChange={handleInputChange}
                    name="model"
                    id="model" 
                    defaultValue={carDefault!?.model}
                    placeholder="Model" />
              </div>
              { 
                    errorMessages.model &&(
                        <div className="errorMessage">
                            {errorMessages.model}
                        </div>
                    )  
                }
              <div className="selectSell">
                <label>Fuel Type:</label>
                <select 
                    name="fuelType" 
                    id="selectFuelType" 
                    onChange={handleFuelSelectChange}
                    defaultValue={isSellPage ? "Select Fuel Type" : carDefault!?.fuelType }>
                  <option value="" >
                    Select Fuel Type
                  </option>
                  <option value="gasoline" >Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              { 
                    errorMessages.fuelType &&(
                        <div className="errorMessage">
                            {errorMessages.fuelType}
                        </div>
                    )  
                }
              <div className="form-input">
                <label htmlFor="madeYear">Year:</label>
                <NumericInput
                    max={2023}
                    onChange={handleInputChange}
                    Name="madeYear"
                    maxLength={4}
                    defaultValueNr={carDefault!?.madeYear}
                    placeholder="YYYY"
                  />
              </div>
              { 
                    errorMessages.madeYear &&(
                        <div className="errorMessage">
                            {errorMessages.madeYear}
                        </div>
                    )  
                }
              <div className="form-input">
                <label>Power [ HP ]:</label>
                <NumericInput
                    max={1500}
                    onChange={handleInputChange}
                    Name="power"
                    defaultValueNr={carDefault!?.power}
                    maxLength={4}
                    placeholder="ex : 150 HP"
                  />
              </div>
              { 
                    errorMessages.power &&(
                        <div className="errorMessage">
                            {errorMessages.power}
                        </div>
                    )  
                }
              <div className="form-input">
                <label>{ isVehicleElectric ? "Battery Capacity [ kwh ]" :"Cilinder Capacity [ cm3 ]"}:</label>
                <NumericInput

                    onChange={handleInputChange}
                    Name="capacity"
                    max={8400}
                    defaultValueNr={carDefault!?.capacity}
                    maxLength={4}
                    placeholder={isVehicleElectric ? "Battery Capacity" : "Cilinder Capacity"}
                />
              </div>
              { 
                    errorMessages.capacity &&(
                        <div className="errorMessage">
                            {errorMessages.capacity}
                        </div>
                    )  
                }
              <div className="selectSell">
                <label>Door Number:</label>
                <select name="DoorNumber"
                    onChange={handleSelectChange}
                    id="DoorNumberSelect" 
                    defaultValue={isSellPage ? "Select Door Number" : carDefault!?.DoorNumber}> 
                  <option value={undefined}>
                    Select Door Number
                  </option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </div>
              { 
                    errorMessages.DoorNumber &&(
                        <div className="errorMessage">
                            {errorMessages.DoorNumber}
                        </div>
                    )  
                }
              <div className="selectSell">
                <label>Drive Train:</label>
                <select 
                    onChange={handleSelectChange}
                    name="driveTrain" 
                    
                    id="DriveWheelSelect" 
                    defaultValue={isSellPage ? "Select Drive Train" : carDefault!?.driveTrain}>
                  <option value="" >
                    Select Drive Train
                  </option>
                  <option value="awd">AWD</option>
                  <option value="fwd">FWD</option>
                  <option value="4wd">4WD</option>
                  <option value="rwd">RWD</option>
                </select>
              </div>
              { 
                    errorMessages.driveTrain &&(
                        <div className="errorMessage">
                            {errorMessages.driveTrain}
                        </div>
                    )  
                }
              <div className="form-input">
                <label>Version:</label>
                <input 
                    onChange={handleInputChange}
                    name="version"
                    maxLength={25} 
                    defaultValue={carDefault!?.version}
                    id="version" 
                    placeholder="Version" />
              </div>
              { 
                    errorMessages.version &&(
                        <div className="errorMessage">
                            {errorMessages.version}
                        </div>
                    )  
                }
              <div className="form-input">
                <label>Generation:</label>
                <input 
                    onChange={handleInputChange}
                    name="generation"
                    maxLength={25} 
                    id="generation" 
                    defaultValue={carDefault!?.generation}
                    placeholder="Generation" />
              </div>
              { 
                    errorMessages.generation &&(
                        <div className="errorMessage">
                            {errorMessages.generation}
                        </div>
                    )  
                }
              <div className="selectSell">
                <label>Transmission:</label>
                <select 
                    onChange = {handleSelectChange}
                    name= "transmission"
                    id="selectTransmission" 
                    defaultValue={isSellPage ? "Select Transmission" : carDefault!?.transmission}>
                  <option value="" >
                    Select Transmission
                  </option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              { 
                    errorMessages.transmission &&(
                        <div className="errorMessage">
                            {errorMessages.transmission}
                        </div>
                    )  
                }
              
              {isVehicleElectric ? (
                null
            ) : (
                <>
                <div className="selectSell">
                    <label>Emmision Standard:</label>
                    <select 
                    onChange={handleSelectChange}
                    name="EmmisionStandard" id="EmmisionStandardSelect" 
                    defaultValue={isSellPage ? "Select Emmision Standard" : carDefault!?.EmmisionStandard}>
                    <option value="" >
                        Select Emmision Standard
                    </option>
                    <option value="Euro1">Euro 1</option>
                    <option value="Euro2">Euro 2</option>
                    <option value="Euro3">Euro 3</option>
                    <option value="Euro4">Euro 4</option>
                    <option value="Euro5">Euro 5</option>
                    <option value="Euro6">Euro 6</option>
                    </select>
                </div>
                { 
                    errorMessages.EmmisionStandard &&(
                        <div className="errorMessage">
                            {errorMessages.EmmisionStandard}
                        </div>
                    )  
                }
                <div className="form-input">
                    <label>CO2 Emissions [ g/km ]:</label>
                    <NumericInput
                    onChange={handleInputChange}
                    Name="c02Emission"
                    max={500}
                    defaultValueNr={carDefault!?.c02Emission}
                    maxLength={3}
                    placeholder="ex : 150 g/km"
                  />
                </div>
                { 
                    errorMessages.c02Emission &&(
                        <div className="errorMessage">
                            {errorMessages.c02Emission}
                        </div>
                    )  
                }
              
            </>
            )}
            </div>
            <div className="circle-arrow-wrapper">
              <a onClick={toggleSecondSection}>
                <div 
                    // onclick="activate()" 
                    className="arrow-circle">
                    <FontAwesomeIcon icon={faArrowRight}/>
                </div>
              </a>
            </div>
          </div>{" "}
          {/* END OF FIRST SECTION  */}
          <div className="second-section" id="second-section">
            <div className="form-container car-bodywork">
              <h3>Bodywork details</h3>
              <div className="selectSell">
                <label>Bodywork Type:</label>
                <select 
                    onChange = {handleSelectChange}
                    name="bodyWork"
                    defaultValue={isSellPage ? "Select Bodywork Type" : carDefault!?.bodyWork} 
                    id="BodyworkSelect">
                  <option value="" >
                    Select Bodywork Type
                  </option>
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
                </select>
              </div>
              { 
                    errorMessages.bodyWork &&(
                        <div className="errorMessage">
                            {errorMessages.bodyWork}
                        </div>
                    )  
                }
              <div className="form-input">
                <label>Color:</label>
                <input 
                    onChange={handleInputChange}
                    name="color"
                    maxLength={10} 
                    defaultValue={carDefault!?.color}
                    id="carColor" 
                    placeholder="Color" />
              </div>
              { 
                    errorMessages.color &&(
                        <div className="errorMessage">
                            {errorMessages.color}
                        </div>
                    )  
                }
            



                <div className="form-container car-images">

                    <h3>Images</h3>
                    <output id="imageOutput">
                        
                         {carDefault!?.images?.map((image, index) => (
                            <div className="image addedImage" key={index}>
                                <img
                                    src={image}
                                    alt="carImage"
                                    loading="lazy"
                            
                                />
                                <span onClick={() => deleteImageFromStorageAndDB!(car?.images[index])}>&times;</span>
                            </div>

                        ))}

                        {selectedImages &&
                            selectedImages.map((image, index) => (
                            
                                    <div className="image toAddImages" key={index}>
                                        <img
                                            src={URL.createObjectURL(image) }
                                            alt={image.name}
                                            loading="lazy"
                                    
                                        />
                                        <span onClick={() => deleteImage(index)}>&times;</span>
                                    </div>
                        ))}         
                    </output>
                    { 
                    errorMessages.images &&(
                        <div className="errorMessage">
                            {errorMessages.images}
                        </div>
                    )  
                }
                    <div className="buttonwrap">
                        <button
                            onClick={handleAdImagesClick}
                            className="btn btn-social">
                                Add Images
                        </button>
                        <input
                            id="imageInput"
                            type="file"
                            ref={imageInputRef}
                            multiple={true}
                            accept="image/jpeg, image/png, image/jpg"
                            onChange={handleImageChange}
                            maxLength={15-(car?.images?.length || 0)}
                        />
                    </div>

                    <p>You can add up to 15 images. JPG, PNG formats are accepted.</p>
                    &nbsp;
                </div>




              <div className="info-container">
                <img src={lightbulb} alt="info-vin" />
                <p>
                  Increase the attractiveness of the ad by adding a YouTube link
                  with a recording of the vehicle.
                </p>
              </div>



              <div className="form-input">
                <label>Youtube Video:</label>
                <input

                  onChange={handleInputChange}
                  name="youtubeLink"
                    defaultValue={carDefault!?.youtubeLink}
                  id="YouTubelink"
                  type="text"
                  placeholder="ex: https://www.youtube.com/watch?v=dip20zckA"
                />
              </div>
            </div>
            <div className="form-container car-description">
              <h3>Vehicle Description</h3>
              <div className="form-input">
                <label>Short Description:</label>
                <input

                    onChange={handleInputChange}
                    name="shortDescription" 
                    maxLength={25}
                    defaultValue={carDefault!?.shortDescription}
                    id="shortDescription"
                    type="text"
                    placeholder="ex: Dodge Challenger"
                />
              </div>
              { 
                    errorMessages.shortDescription &&(
                        <div className="errorMessage">
                            {errorMessages.shortDescription}
                        </div>
                    )  
                }
              <div className="form-input">
                <label>Description:</label>
                <textarea 
                  onChange={handleTextAreaChange}
                  maxLength={199}
                  id="longDescription"
                  name="longDescription"

                  defaultValue={carDefault!?.longDescription}
                />
              </div>
              { 
                    errorMessages.longDescription &&(
                        <div className="errorMessage">
                            {errorMessages.longDescription}
                        </div>
                    )  
                }
            </div>
            <div className="form-container car-equipment">
                <Tags onTagsChange={handleTagsChange} selectedTags={car?.tags ?? []}/>
            </div>
            <div className="form-container car-history">
              <h3>History</h3>
              <div className="form-input">
                <label>Country of Origin:</label>
                <input
                  maxLength={56}
                    onChange={handleInputChange}
                    defaultValue={car?.countryOfOrigin}
                    name="countryOfOrigin"
                  id="CountryOfOringin"
                  placeholder="Country"
                />
              </div>
              { 
                    errorMessages.countryOfOrigin &&(
                        <div className="errorMessage">
                            {errorMessages.countryOfOrigin}
                        </div>
                    )  
                }
            </div>
            <div className="form-container car-warranty">
              <div className="form-input">
                <label>Waranty for :</label>
                <div className="unitsWrap">
                <NumericInput

                    onChange={handleInputChange}
                    Name="warrantyKm"
                    defaultValueNr={carDefault!?.warrantyKm}
                    max={1000000}
                    maxLength={7}
                    placeholder="ex : 150 000 km"
                  />
                  <b>km</b>
                </div>
              </div>
              { 
                    errorMessages.warrantyKm &&(
                        <div className="errorMessage">
                            {errorMessages.warrantyKm}
                        </div>
                    )  
                }
            </div>
            <div className="form-container car-price">
              <h3>Evaluate</h3>
              <div className="form-input">
                <label>Price [ € ]:</label>
                <NumericInput
                    max={1000000}
                    onChange={handleInputChange}
                    Name="price"
                    defaultValueNr={carDefault!?.price}
                    maxLength={7}
                    placeholder="ex : 4000 €"
                  />
              </div>
              { 
                    errorMessages.price &&(
                        <div className="errorMessage">
                            {errorMessages.price}
                        </div>
                    )  
                }
              <div className="form-container car-seller-info">
                <h3>Seller Info</h3>
                <div className="form-input">
                  <label>Country:</label>
                  <input 
                    onChange={handleInputChange}
                    name="country"
                    maxLength={56} 
                    defaultValue={carDefault!?.country}
                    id="country" 
                    placeholder="Country" />
                </div>
                { 
                    errorMessages.country &&(
                        <div className="errorMessage">
                            {errorMessages.country}
                        </div>
                    )  
                }
                <div className="form-input">
                  <label>City:</label>
                  <input 
                    name="city"
                    onChange={handleInputChange}
                    maxLength={58} 
                    defaultValue={carDefault!?.city}
                    id="city" 
                    placeholder="City" />
                </div>
                { 
                    errorMessages.city &&(
                        <div className="errorMessage">
                            {errorMessages.city}
                        </div>
                    )  
                }
              </div>
            </div>
            <div id="continueButton" onClick={handleContinue} className="buttonwrap2">
              <button className="btn btn-social">Continue</button>
            </div>
            <div className={isSecondSectionOverlayVisible ? "secondOverlay" : "secondOverlay-hidden"}>
              <div className= {isSecondSectionOverlayVisible ? "text" : "text-hidden"}>
                please complete the first section
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  