import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage , faHeart,faPenToSquare, faCalendar, faEuroSign, faGasPump,faTrash, faBattery4, faLightbulb, faBolt,
         faGaugeHigh, faPaintBrush, faCircleDot, faCar, faSmog, faLocationDot } from "@fortawesome/free-solid-svg-icons";

import user_default from "../../assets/user_default.svg";

import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { useState , useEffect, useContext } from "react";

import {  arrayRemove, arrayUnion, auth,  db,  doc, updateDoc } from "../../firebase";
import { showToolTip } from "./Footer";
import { NWHS, NWS, createChat, deleteCar } from "../../Helpers";


interface CarCardProps {
    carsDataArray: any[];
    
}


/**
 * This component is used to display a dynamic car list that is passed to it as a prop.
 */
export const CarCard = ({carsDataArray }:CarCardProps)  => {
    
    const { user,setUSER } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [carDocs, setCarDocs] = useState<any[]>([]);

    useEffect(() => {
        setCarDocs(carsDataArray as any[]);
    }, [carsDataArray])


    /**
     * @description Deletes the car document from the database and removes it from the carDocs array state and also from the user's context state
     * @param id  The id of the car document to be deleted from the database
     */
    const deleteCarFromAllCars = (id: string) => {
        deleteCar(id);
        setCarDocs(carDocs.filter((carDoc) => carDoc.id !== id));
        if(user?.adsArray && user?.adsArray instanceof Array){
            setUSER({...user, adsArray: user?.adsArray!?.filter((carId : string) => carId !== id)});
            showToolTip("Your Car ad has been deleted from the list" , "red");
        }
    }


    /**
     * @description Adds the car to the favourites list if it is not already in the list and removes it from the list if it is already in the list
     * @param carID The id of the car document to be checked if it is in the favourites list and then added or removed from the list accordingly
     * 
     */
    const addToFavourites = (carID : string) => {
        const userDocRef = doc(db, "users", auth.currentUser!.uid);
        if(user?.favouriteAds?.includes(carID)){
           
            updateDoc(userDocRef,{favouriteAds: arrayRemove(carID)});
            setUSER && setUSER({...user, favouriteAds: user.favouriteAds.filter((adID) => adID !== carID)});
            showToolTip("Your ad has been removed from favourites" , "red");
        }else{
            updateDoc(userDocRef,{favouriteAds: arrayUnion(carID)});
            setUSER && setUSER({...user, favouriteAds: [...user?.favouriteAds!, carID]});
            showToolTip("Your ad has been added to favourites" , "green");
        }
        
    }

     /**
     * 
     * @param carID  The id of the car document to be checked if it is in the favourites list
     * @returns   `true` if the car is in the favourites list and `false` if it is not
     */
     const isFavourite = (carID : string) => {
        return user?.favouriteAds!?.includes(carID);
    }
    



    /**
     * @description Creates a chat between the current user and the user with the id passed as a parameter from the `createChat` function then navigates to the chat page
     * @param recipientId  The id of the user who will be the recipient of the message
     */
    const messageUser = async(recipientId: string,carID : string, carImageURL: string) => {
        const chatId : string = await createChat(recipientId, `${window.location.origin}/ad/${carID}`, carImageURL);
            if(chatId != ""){
                navigate(`/chats/chat/${chatId}`);
            }else{
                showToolTip("error", "Error creating chat");
            }
    };




    return (
        <>
          {carDocs.map((CarDoc : any) => (
            
            <div    
                className="advertise"
                key={CarDoc.id} 
                 data-id={CarDoc.id}>
                    <div 
                        onClick={CarDoc.userID === auth.currentUser?.uid 
                            ? () => navigate(`/edit/${CarDoc.id}`, {state: {id: CarDoc.id}})
                            : () => navigate(`/ad/${CarDoc.id}`, {state: {id: CarDoc.id}})
                        }
                        className="imgWrap"
                        >
                        <img src={CarDoc.images[0]} alt=""/>
                    </div>
    
                    <div 
                        onClick={   CarDoc.userID === auth.currentUser?.uid 
                                    ? () => navigate("/myAccount")  
                                    :() => navigate(`/user/${CarDoc.userID}`, {state: {userID: CarDoc.userID}})}
                        className="accountPhoto">
                        
                        <img  
                            src={CarDoc.userID === auth.currentUser?.uid 
                                ? user?.photoURL ?? user_default
                                : CarDoc.userPhoto ?? user_default
                            } />
                    </div>
                    <div className="adButtons">
                        <div 
                            onClick={CarDoc.userID === auth.currentUser?.uid 
                                ? () => deleteCarFromAllCars(CarDoc.id)
                                : () => addToFavourites(CarDoc.id)}
                            className="adButton" >
                            <FontAwesomeIcon    
                                className={isFavourite(CarDoc.id) ? "fontAwesomeRed" : "fontAwesomeIcon"}
                                icon={CarDoc.userID === auth.currentUser?.uid 
                                    ? faTrash
                                    : faHeart}/>
                        </div>
                        <div 
                            onClick={ CarDoc.userID === auth.currentUser?.uid 
                                        ? () => navigate(`/edit/${CarDoc.id}`, {state: {id: CarDoc.id}})
                                        : () => messageUser(CarDoc.userID, CarDoc.id, CarDoc.images[0])} 
                            className="adButton">
                            <FontAwesomeIcon icon={CarDoc.userID === auth.currentUser?.uid 
                                                    ? faPenToSquare
                                                    : faMessage}/>
                        </div>
                    </div>
                <div className="carInfo">
                    <div className="carInfoHeader">
                        <div className="carInfoHeader_Wrap">
                            <h3 id="makePlaceHolder">
                                {CarDoc.make}
                            </h3>
                            <h3 id="modelPlaceHolder">
                                {CarDoc.model}
                            </h3>
                            <h3 id="trimPlaceHolder">
                                {CarDoc.trim}
                            </h3>
                        </div>
                        <div className="carInfoHeader_PriceWrap">
                            <h3>
                                {NWS(CarDoc.price)}
                            </h3>
                            <FontAwesomeIcon 
                                className="fontAwesomeIcon"
                                icon={faEuroSign}/>
                        </div>
                    </div>
                    <div className="carinfoDescription">
                        <div className="carinfoDescription_Container">
                            <div className="infoWrap">
                                <FontAwesomeIcon 
                                    className="fontAwesomeIcon"
                                    icon={faCalendar}
                                />
                                <h4 id="yearPlaceHolder">
                                    {NWHS(CarDoc.madeYear)}
                                </h4>
                            </div>
                            <div className="infoWrap">
                                <FontAwesomeIcon 
                                    className="fontAwesomeIcon"
                                    icon={faGasPump}
                                />
                                <h4 id="fuelPlaceHolder">
                                    {CarDoc.fuelType}
                                </h4>
                            </div>
                            <div className="infoWrap">
                                <FontAwesomeIcon 
                                    className="fontAwesomeIcon"
                                    icon={faBattery4}
                                />
                                <h4 id="capacityPlaceHolder">
                                    {CarDoc.capacity}
                                </h4>
                                <b>
                                    {CarDoc.fuelType == "electric" ? ("kWh"):("cm3")}
                                </b>
                            </div>
                            <div className="infoWrap">
                                <FontAwesomeIcon 
                                    className="fontAwesomeIcon"
                                    icon={faLightbulb}
                                />
                                <h4 id="gearboxTypePlaceHolder">
                                    {CarDoc.transmission}
                                </h4>
                            </div>
                            <div className="infoWrap">
                                <FontAwesomeIcon 
                                    className="fontAwesomeIcon"
                                    icon={faBolt}
                                />
                                <h4 id="powerPlaceHolder">
                                    {CarDoc.power}
                                </h4>
                                <b>HP</b>
                            </div>
                        </div>
                        <div className="carinfoDescription_Container">
                        <div className="infoWrap">
                            <FontAwesomeIcon
                                className="fontAwesomeIcon"
                                icon={faGaugeHigh}
                            />
                            <h4 id="milagePlaceHolder">
                                {CarDoc.milage}
                            </h4>
                            <b>km</b>
                        </div>
                        <div className="infoWrap">
                            <FontAwesomeIcon
                                className="fontAwesomeIcon"
                                icon={faPaintBrush}
                            />
                            <h4 id="colorPlaceHolder">
                                {CarDoc.color}
                            </h4>
                        </div>
                        <div className="infoWrap">
                            <FontAwesomeIcon
                                className="fontAwesomeIcon"
                                icon={faCircleDot}
                            />
    
                            <h4 id="drivetrainPlaceHolder">
                                {CarDoc.driveTrain}
                            </h4>
                        </div>
                        <div className="infoWrap">
                            <FontAwesomeIcon
                                className="fontAwesomeIcon"
                                icon={faCar}
                            />
    
                            <h4 id="bodyworkPlaceHolder">
                                {CarDoc.bodyWork}
                            </h4>
                        </div>
                        <div className="infoWrap">
                            <FontAwesomeIcon
                                className="fontAwesomeIcon"
                                icon={faSmog}
                            />
    
                            <h4 id="polutionPlaceHolder">
                                {CarDoc.EmmisionStandard}
                            </h4>
                        </div>
                        </div>
                    </div>
                    <div className="tags">
                        {
                            CarDoc.tags.map((tag : string) => (
                                <div id={tag} className="tag" key={tag}>
                                    <h4>
                                        {tag}
                                    </h4>
                                </div>
                            ))
                        }
                    </div>
                    <div className="otherInfo">
                        <div className="locationWrap">
                            <FontAwesomeIcon
                                className="fontAwesomeIcon"
                                icon={faLocationDot}
                            />
                            <h5>
                                {CarDoc.country}, {CarDoc.city}
                            </h5>
                        </div>
                        <div className="dateWrap">
                        <h5>
                            {CarDoc.createdAt.toDate().toLocaleDateString()}
                        </h5>
                        </div>
                    </div>
                </div>
          </div>
          
          ))}
        </>
       
      );


}