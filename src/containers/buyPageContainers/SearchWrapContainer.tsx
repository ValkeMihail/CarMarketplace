import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchProps } from "../../pages/BuyPage/Buy";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";

type SearchWrapContainerProps = {

  setSearch: (search: SearchProps) => void;
  search : SearchProps;
  isSearchActive: boolean;
  closeSearch: () => void;
  applySearch: () => void;
}



export const SearchWrapContainer = ({
  
  setSearch,
  search,
  isSearchActive,
  closeSearch,
  applySearch,
} : SearchWrapContainerProps ) => {


  return (
  <div className="searchWrap">
    <div className="form-input">
      <input 
        onChange={e => setSearch({ ...search,  searchKeyword: e.target.value})} 
        id="searchWord" 
        type="text" 
        placeholder="Search" 
      />
      <FontAwesomeIcon onClick={isSearchActive ? closeSearch : applySearch} icon={isSearchActive ? faClose : faSearch} className="fontAwesomeIconSearch" />
    </div>
  </div>
  )
}
  