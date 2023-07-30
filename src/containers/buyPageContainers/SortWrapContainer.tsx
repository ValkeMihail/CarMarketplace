import { faSortAsc, faSortDesc } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { filterType, sortType } from "../../pages/BuyPage/Buy";


type SortWrapContainerProps = {
  setOrder: () => void;
  filter: filterType | null;
  setSort: (sort: sortType) => void;
  sort: sortType;
  activeSortOrderAsc: boolean;
}


export const  SortWrapContainer = ({
  setOrder,
  filter,
  setSort,
  sort,
  activeSortOrderAsc,
} : SortWrapContainerProps) => {
  return(

    <div className="filterWrap">
      <select 
        name="sortBy" 
        className="selectWrapper" 
        onChange={e => setSort({ ...sort, sortProperty: e.target.value })} 
        id="sortBy"
      >
        {filter?.filterProperty === "null" ? 
          (
            <>
              <option value="createdAt">Recently Added</option>
              <option value="price">Price</option>
              <option value="milage">Milage</option>
              <option value="madeYear">Year</option>
            </> 
          ):(
            <option value={filter?.filterProperty}></option>
          )
        }
      </select>
      <div className="ascdesccontainer">
        <FontAwesomeIcon onClick={() => setOrder()} icon={faSortAsc} className={activeSortOrderAsc ? "fontAwesomeIconBigger" : "fontAwesomeActive"} />
        <FontAwesomeIcon onClick={() => setOrder()} icon={faSortDesc} className={activeSortOrderAsc ? "fontAwesomeActive" : "fontAwesomeIconBigger"} />
      </div>
    </div>
  ) 
}
  