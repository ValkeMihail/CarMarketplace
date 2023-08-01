import { getDoc,db ,doc, onAuthStateChanged, getDocs, collection, auth} from "../../utils/firebase";
import {useContext ,useState,useEffect} from "react";
import { CarCardsList } from "./CarCard";
import { AuthContext } from "../../context/auth/AuthContext";



/**
 *  This component is responsible for displaying the favourite cars of the user.
 * @returns  a component that displays the favourite cars of the current user.
 */
export const UserFavourites = () => {


    const [carDocs, setFavCarsDocs] = useState<any[]>([]);
    const {user} = useContext(AuthContext);

    /**
     *  This function gets the user photo from the database.
     * @param userID  the id of the user.
     * @returns  the photo of the user.
     */
    const getUserPhoto = async (userID: string) => {
        const userDoc = await getDocs(collection(db, "users"));
        const userDocs = userDoc.docs;
        const user = userDocs.find((userDoc) => userDoc.id === userID);
        return user?.data().photoURL as string;
    };

    useEffect(() => {

        /**
         * This function gets the favourite cars of the user from the database and sets the state of the favourite cars.
         * @returns  the favourite cars of the user.
         */ 
        const getFavouriteCars = async () => {
            const userFavourites: string[] = user?.favouriteAds as string[];
            const favCarsDocsPromises = userFavourites.map(async (carId: string) => {
                const carDocRef = doc(db, "cars", carId);
                const carDoc = await getDoc(carDocRef);
                const carData: any = carDoc.data();
                carData.id = carDoc.id;
                const userID = carData.userID ;
                const userPhotoURL = await getUserPhoto(userID);
                carData.userPhoto = userPhotoURL;
                return carData;
            });
            const favCarsDocsData = await Promise.all(favCarsDocsPromises);
            setFavCarsDocs(favCarsDocsData);
          };
       
        onAuthStateChanged(auth, (user) => {
            if (user) {      
                getFavouriteCars();
            } 
        });          
    }, [user?.favouriteAds]);
      


    return (
        <CarCardsList carsDataArray={carDocs}/>
    );
};
