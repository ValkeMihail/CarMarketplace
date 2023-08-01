import {
  getDoc,
  db,
  doc,
  onAuthStateChanged,
  getDocs,
  collection,
  auth
} from "../../utils/firebase";
import { useContext, useState, useEffect } from "react";
import { CarCardsList } from "./CarCard";
import { AuthContext } from "../../context/auth/AuthContext";
import { CarDocument } from "../../../types";

export const UserFavourites = () => {
  const [carDocs, setFavCarsDocs] = useState<CarDocument[]>([]);
  const { user } = useContext(AuthContext);

  const getUserPhoto = async (userID: string) => {
    const userDoc = await getDocs(collection(db, "users"));
    const userDocs = userDoc.docs;
    const user = userDocs.find((userDoc) => userDoc.id === userID);
    return user?.data().photoURL as string;
  };

  useEffect(() => {
    const getFavouriteCars = async () => {
      const userFavourites: string[] = user?.favouriteAds as string[];
      const favCarsDocsPromises = userFavourites.map(async (carId: string) => {
        const carDocRef = doc(db, "cars", carId);
        const carDoc = await getDoc(carDocRef);
        const carData = carDoc.data() as CarDocument;
        carData.id = carDoc.id;
        const userID = carData.userID;
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

  return <CarCardsList carsDataArray={carDocs} />;
};
