
import { useParams } from "react-router-dom"
import { useState,useEffect } from "react"
import { db ,collection ,getDoc, doc } from "../../firebase"
import { Car, SellOrEditPage } from "../SellPage/Sell";



/**
 * @description Edit page component
 * @returns the JSX code which represents the Edit page component that contains the form for editing the car ad that is populated with the current car ad data
 */
export const Edit = () => {


    const { id } = useParams();
    const [car, setCar] = useState<Car | null>( null );
    

    useEffect(() => {
        
        const CarsRef = collection(db, "cars");
        
        /**
         * This function gets the car ad data from the database and sets the car state to the car ad data
         */
        const getCarFromDB = async () => {
            const carDoc = await getDoc(doc(CarsRef, id));
            if (carDoc.exists()) {
            setCar(carDoc.data() as Car);
            } 
          
        };
        getCarFromDB();
        
    }, [id]);

    return (
        <SellOrEditPage
            isSellPage={false}
            carDefault={car}
            id={id!}
            updateDefaultCar={setCar}
        />
    );
}
    