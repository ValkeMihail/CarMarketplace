import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import user_default from "../../assets/user_default.svg";
import { Car, CarDocument } from "../../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TagsWrapContainer } from "../../containers/CarAdPageContainers/TagsWrapContainer";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { getDoc, doc, db, getDocs, collection } from "../../utils/firebase";
import { SlideShow } from "../../containers/CarAdPageContainers/SlideShow";
import { UserDetailsContainer } from "../../containers/CarAdPageContainers/userDetailsContainer";
import { GridItemInfo } from "../../containers/CarAdPageContainers/GridItemInfo";

type ExtendedCarDocument = CarDocument & {
  phoneNr: string;
};

export const CarAd = () => {
  const { carID } = useParams<{ carID: string }>();
  const [carDoc, setCarDoc] = useState<ExtendedCarDocument | null>(null);

  useEffect(() => {
    const CarsRef = collection(db, "cars");
    const getCarData = async () => {
      const carDoc = await getDoc(doc(CarsRef, carID));
      if (carDoc.exists()) {
        const carData = carDoc.data() as Car;
        const updatedCarData = {
          ...carData,
          id: carID,
          userPhoto: (await getUserPhoto(carData.userID)) || user_default,
        };
        setCarDoc(updatedCarData as ExtendedCarDocument);
      }
    };
    getCarData();
  }, [carID]);

  const getUserPhoto = async (userID: string) => {
    const userDoc = await getDocs(collection(db, "users"));
    const userDocs = userDoc.docs;
    const user = userDocs.find((userDoc) => userDoc.id === userID);
    return user?.data().photoURL as string;
  };

  return (
    <div className="container">
      <div className="adContainer">
        <SlideShow carDoc={{ images: carDoc?.images ? carDoc?.images : [] }} />
        <div className="ad">
          <TagsWrapContainer
            carDoc={{ tags: carDoc?.tags ? carDoc?.tags : [] }}
          />

          <UserDetailsContainer
            carDoc={{
              id: carDoc?.id,
              userID: carDoc?.userID,
              images: carDoc?.images,
              userPhoto: carDoc?.userPhoto,
              phoneNr: carDoc?.phoneNr,
              shortDescription: carDoc?.shortDescription,
              price: carDoc?.price,
            }}
          />

          <div className="AdDetails">
            <h3>General</h3>
            <GridItemInfo label="Make" value={carDoc?.make} />
            <GridItemInfo label="Model" value={carDoc?.model} />
            <GridItemInfo label="Version" value={carDoc?.version} />
            <GridItemInfo label="Generation" value={carDoc?.generation} />
            <GridItemInfo label="Year" value={carDoc?.madeYear} />
            <GridItemInfo label="Fuel" value={carDoc?.fuelType} />
            <h3>Technical</h3>
            <GridItemInfo value={carDoc?.transmission} label="Transmission" />
            <GridItemInfo
              value={carDoc?.capacity}
              label={
                carDoc?.fuelType == "electric"
                  ? "Battery Capacity"
                  : "Cilinder Capacity"
              }
            >
              <div className="unitWrap">
                <p>{carDoc?.capacity}</p>
                <b>{carDoc?.fuelType == "kwh" ? "" : "cm3"}</b>
              </div>
            </GridItemInfo>
            <GridItemInfo
              value={carDoc?.EmmisionStandard}
              label="Polution Category"
            />
            <GridItemInfo value={carDoc?.c02Emission} label="CO2 Emmisions">
              <div className="unitWrap">
                <p>{carDoc?.c02Emission}</p>
                <b>g/Km</b>
              </div>
            </GridItemInfo>
            <GridItemInfo value={carDoc?.driveTrain} label="Drivetrain Type" />
            <GridItemInfo value={carDoc?.power} label="Power">
              <div className="unitWrap">
                <p>{carDoc?.power}</p>
                <b>HP</b>
              </div>
            </GridItemInfo>
            <h3>Bodywork</h3>
            <GridItemInfo value={carDoc?.bodyWork} label="Bodywork" />
            <GridItemInfo value={carDoc?.DoorNumber} label="Number of Doors" />
            <GridItemInfo value={carDoc?.color} label="Color" />
          </div>
          <div className="optionalInfo">
            <GridItemInfo
              optionalItem={true}
              value={carDoc?.condition}
              label="Condition"
            />
            <GridItemInfo
              optionalItem={true}
              value={carDoc?.milage}
              label="Mileage"
            >
              <div className="unitWrap">
                <p>{carDoc?.milage}</p>
                <b>Km</b>
              </div>
            </GridItemInfo>
            <GridItemInfo
              optionalItem={true}
              value={carDoc?.countryOfOrigin}
              label="Country of Origin"
            />
            <GridItemInfo optionalItem={true} value={carDoc?.vin} label="VIN" />
            <GridItemInfo
              optionalItem={true}
              value={carDoc?.warrantyKm}
              label="Warranty for"
            >
              <div className="unitWrap">
                <p>{carDoc?.warrantyKm}</p>
                <b>Km</b>
              </div>
            </GridItemInfo>
            <GridItemInfo
              optionalItem={true}
              value={carDoc?.dayOfFirstRegistration}
              label="Date of first registration"
            >
              <p>{carDoc?.dayOfFirstRegistration}</p>
              <p>/</p>
              <p>{carDoc?.monthOfFirstRegistration}</p>
              <p>/</p>
              <p>{carDoc?.yearOfFirstRegistration}</p>
            </GridItemInfo>
            <GridItemInfo
              optionalItem={true}
              value={carDoc?.youtubeLink}
              label="Video Link"
            />
          </div>
          <div className="adDescription">
            <p>{carDoc?.longDescription}</p>
          </div>
          <div className="otherInfo">
            <div className="locationWrap">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="fontAwesomeIcon"
              />
              <h5>
                {carDoc?.country},{carDoc?.city}
              </h5>
            </div>
            <div className="dateWrap">
              <h5>{carDoc?.createdAt.toDate().toLocaleDateString()}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
