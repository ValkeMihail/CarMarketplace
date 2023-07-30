import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nrWithSpaces } from "../../utils/helpers";
import { faEuroSign } from "@fortawesome/free-solid-svg-icons";

type  CarInfoHeaderProps = {
  carDoc : {
    make: string
    model: string
    generation: string
    price: number
  }
}

export function CarInfoHeader({
  carDoc,
}: CarInfoHeaderProps  
) {
  return (
    <div className="carInfoHeader">
      <div className="carInfoHeader_Wrap">
        <h3 id="makePlaceHolder">{carDoc.make}</h3>
        <h3 id="modelPlaceHolder">{carDoc.model}</h3>
        <h3 id="trimPlaceHolder">{carDoc.generation}</h3>
      </div>
      <div className="carInfoHeader_PriceWrap">
        <h3>{nrWithSpaces(carDoc.price)}</h3>
        <FontAwesomeIcon className="fontAwesomeIcon" icon={faEuroSign} />
      </div>
    </div>
  );
}
  