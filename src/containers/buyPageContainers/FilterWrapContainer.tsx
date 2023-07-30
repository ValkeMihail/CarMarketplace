import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type  FilterWrapContainerProps = {
  changeFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const FilterWrapContainer = ({
  changeFilter
} : FilterWrapContainerProps ) => {
  return (
    <div className="filterWrap">
      <FontAwesomeIcon icon={faSliders} className="fontAwesomeIcon" />

      <select name="filterBy" className="selectWrapper" onChange={changeFilter} defaultValue="null" id="filterBy">
        <option id="null" value="null">
          No Filters
        </option>
        <option id="priceFilter" value="price">
          Price
        </option>
        <option id="yearFilter" value="madeYear">
          Year
        </option>
        <option id="milageFilter" value="milage">
          Milage
        </option>
      </select>
    </div>
  );
}
  