import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faBattery4,
  faLightbulb,
  faBolt,
  faGaugeHigh,
  faPaintBrush,
  faCircleDot,
  faCar,
  faSmog,
  faLocationDot,
  faGasPump,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/auth/AuthContext";
import { useState, useEffect, useContext } from "react";
import { deleteCar, nrWithoutSpaces, showToolTip } from "../../utils/helpers";
import { CarAvatar } from "../Avatars/CarAvatar";
import { CarDocument } from "../../../types";
import { UserAvatar } from "../Avatars/UserAvatar";
import { AdButtons } from "../AdButtons/AdButtons";
import { CarInfoHeader } from "../CarInfo/CarInfoHeader";
import { CarInfoWrap } from "../CarInfo/CarInfoWrap";


interface CarCardProps {
  carsDataArray: CarDocument[];
}

export const CarCardsList = ({ carsDataArray }: CarCardProps) => {
  const { user, setUSER } = useContext(AuthContext);

  const [carDocs, setCarDocs] = useState<CarDocument[]>([]);

  useEffect(() => {
    setCarDocs(carsDataArray as CarDocument[]);
  }, [carsDataArray]);

  const removeCarFromList = (id?: string) => {
    if (!id) {
      showToolTip("This ad no longer exists", "red");
      return;
    }
    deleteCar(id);
    setCarDocs(carDocs.filter((carDoc) => carDoc.id !== id));
    if (user?.adsArray && user?.adsArray instanceof Array) {
      setUSER({
        ...user,
        adsArray: user?.adsArray?.filter((carId: string) => carId !== id),
      });
      showToolTip("Your Car ad has been deleted from the list", "red");
    }
  };

  return (
    <>
      {carDocs.map((carDoc: CarDocument) => (
        <div className="advertise" key={carDoc.id} data-id={carDoc.id}>
          <CarAvatar
            carDoc={{ id : carDoc.id ,userID: carDoc.userID, images: carDoc.images }}
          />
          <UserAvatar
            carDoc={{ userID: carDoc.userID, userPhoto: carDoc.userPhoto }}
          />
          <AdButtons
            carDoc={{
              id: carDoc.id,
              userID: carDoc.userID,
              images: carDoc.images,
            }}
            removeCarFromList={removeCarFromList}
          />
          <div className="carInfo">
            <CarInfoHeader
              carDoc={{
                make: carDoc.make,
                model: carDoc.model,
                generation: carDoc.generation,
                price: carDoc.price,
              }}
            />
            <div className="carinfoDescription">
              <div className="carinfoDescription_Container">
                <CarInfoWrap
                  faIcon={faCalendar}
                  value={nrWithoutSpaces(carDoc.madeYear)}
                  id="madeYearPlaceholder"
                />
                <CarInfoWrap
                  faIcon={faGasPump}
                  value={carDoc.fuelType}
                  id="fuelPlaceHolder"
                />
                <CarInfoWrap
                  faIcon={faBattery4}
                  value={carDoc.capacity}
                  id="capacityPlaceHolder"
                >
                  <b>{carDoc.fuelType == "electric" ? "kWh" : "cm3"}</b>
                </CarInfoWrap>
                <CarInfoWrap
                  faIcon={faLightbulb}
                  value={carDoc.transmission}
                  id="gearboxTypePlaceHolder"
                />
                <CarInfoWrap
                  faIcon={faBolt}
                  value={carDoc.power}
                  id="horsePowerPlaceHolder"
                >
                  <b>HP</b>
                </CarInfoWrap>
              </div>
              <div className="carinfoDescription_Container">
                <CarInfoWrap
                  faIcon={faGaugeHigh}
                  value={carDoc.milage}
                  id="milagePlaceHolder"
                >
                  <b>km</b>
                </CarInfoWrap>
                <CarInfoWrap
                  faIcon={faPaintBrush}
                  value={carDoc.color}
                  id="colorPlaceHolder"
                />
                <CarInfoWrap
                  faIcon={faCircleDot}
                  value={carDoc.driveTrain}
                  id="drivetrainPlaceHolder"
                />
                <CarInfoWrap
                  faIcon={faCar}
                  value={carDoc.bodyWork}
                  id="bodyworkPlaceHolder"
                />
                <CarInfoWrap
                  faIcon={faSmog}
                  value={carDoc.EmmisionStandard}
                  id="emissionClassPlaceHolder"
                />
              </div>
            </div>
            <div className="tags">
              {carDoc.tags.map((tag: string) => (
                <div id={tag} className="tag" key={tag}>
                  <h4>{tag}</h4>
                </div>
              ))}
            </div>
            <div className="otherInfo">
              <div className="locationWrap">
                <FontAwesomeIcon
                  className="fontAwesomeIcon"
                  icon={faLocationDot}
                />
                <h5>
                  {carDoc.country}, {carDoc.city}
                </h5>
              </div>
              <div className="dateWrap">
                <h5>{carDoc.createdAt.toDate().toLocaleDateString()}</h5>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
