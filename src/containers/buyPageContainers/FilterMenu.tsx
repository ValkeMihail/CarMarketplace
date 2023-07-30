import { filterType } from "../../pages/BuyPage/Buy";



type FilterMenuProps = {
  filter: filterType | null;
  isFilterActive: boolean;
  closeFilter: () => void;
  applyFilter: () => void;
  setFilter: (filter: filterType) => void;


}



export const  FilterMenu = ({
  filter,
  isFilterActive,
  closeFilter,
  setFilter,
  applyFilter
} : FilterMenuProps) => {


  return (

  <>
    {filter?.filterProperty === "null" ? null : <div id="searchBarFilterMenu" className="searchBarFilterMenu">
      { isFilterActive == true ? 
        (
          <div id="appliedFilters">
            <div className="filter">
              <h4 id="apliedFilterFor">{filter?.filterProperty}</h4>
              <h4 id="apliedFilterOperator">{filter?.filterOperator}</h4>
              <h4 id="apliedFilterValue">{filter?.filterValue}</h4>
              <h3 id="closeFilter" onClick={closeFilter}>
                x
              </h3>
            </div>
          </div> 
        ):(
          <div className="form-input">
            <label htmlFor={filter?.filterProperty}>
              {filter?.filterProperty}
            </label>
            <div className="selectWrapper">
              <select 
                className="selectWrapper" 
                onChange={e => setFilter({ ...(filter ? filter : {    filterProperty: "price",    filterValue: "1000",    filterOperator: ">"  }),  filterOperator: e.target.value})} 
                defaultValue={filter?.filterOperator}
              >
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
              </select>
            </div>
            <input 
              id="priceToFilter" 
              onChange={e => setFilter({ ...(filter ? filter : {  filterProperty: "price",  filterValue: "1000",  filterOperator: ">"}),    filterValue: e.target.value})} type="text" placeholder="Enter value" 
            />
            <button onClick={applyFilter} className="btn btn-social applyFilter">
              Apply Filter
            </button>
          </div>
        )
      }
    </div>}
  </>
  )
}
  