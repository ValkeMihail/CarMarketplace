import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db, collection, getDoc, doc } from "../../firebase";
import { SellOrEditPage } from "../SellPage/Sell";
import { Car } from "../../../types";

export const Edit = () => {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const CarsRef = collection(db, "cars");

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
      id={id ? id : ""}
      updateDefaultCar={setCar}
    />
  );
};
