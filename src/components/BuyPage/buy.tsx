import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faSliders,
  faSortAsc,
  faSortDesc,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import BuyCarsList from "./BuyCarsList";

export type sortType = {
  sortProperty: string;
  sortOrder: string;
};

export type filterType = {
  filterProperty: string;
  filterValue: string;
  filterOperator: string;
};

export type SearchProps = {
  searchKeyword: string;
  searchActive: boolean;
};

export function Buy() {
  const [sort, setSort] = useState<sortType>({
    sortProperty: "createdAt",
    sortOrder: "desc",
  });
  const [activeSortOrderAsc, setActiveSortOrderAsc] = useState<boolean>(false);
  const [CurrentStartAfterRef, setCurrentStartAfterRef] = useState<[] | number | null>(
    null
  );
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
  const [filterToQuery, setFilterToQuery] = useState<filterType | null>(null);
  const [filter, setFilter] = useState<filterType | null>({
    filterProperty: "null",
    filterValue: "1000",
    filterOperator: ">",
  });

  const [search, setSearch] = useState<SearchProps>({
    searchKeyword: "",
    searchActive: false,
  });
  const [searchToQuery, setSearchToQuery] = useState<SearchProps | null>(null);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  useEffect(() => {
    if (sort.sortOrder === "desc") {
      setCurrentStartAfterRef([]);
    } else if (sort.sortOrder === "asc") {
      setCurrentStartAfterRef(0);
    }
  }, [searchToQuery, filterToQuery, sort]);

  const setOrder = () => {
    if (activeSortOrderAsc) {
      setSort({ ...sort, sortOrder: "desc" });
    } else {
      setSort({ ...sort, sortOrder: "asc" });
    }
    setActiveSortOrderAsc(!activeSortOrderAsc);
  };

  const applyFilter = () => {
    setIsFilterActive(true);
    setFilterToQuery({
      filterProperty: filter ? filter.filterProperty : "price",
      filterValue: filter ? filter.filterValue : "1000",
      filterOperator: filter ? filter.filterOperator : ">",
    });
  };

  const closeSearch = () => {
    setIsSearchActive(false);
    setSearch({ ...search, searchActive: false });
    setSearchToQuery(null);
  };

  const applySearch = async () => {
    setIsSearchActive(true);
    setSearchToQuery({
      searchKeyword: search.searchKeyword.toLowerCase(),
      searchActive: true,
    });
  };

  const changeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filterBy = e.target.value;
    setFilter({
      ...(filter
        ? filter
        : {
            filterProperty: "price",
            filterValue: "1000",
            filterOperator: ">",
          }),
      filterProperty: filterBy,
    });
    setIsFilterActive(false);
    if (filterBy === "null") {
      setFilterToQuery(null);
      setSort({ ...sort, sortProperty: "createdAt" });
    } else if (filterBy === "price") {
      setSort({ ...sort, sortProperty: "price" });
    } else if (filterBy === "madeYear") {
      setSort({ ...sort, sortProperty: "madeYear" });
    } else if (filterBy === "milage") {
      setSort({ ...sort, sortProperty: "milage" });
    }
  };

  const closeFilter = () => {
    setIsFilterActive(false);
    setFilterToQuery(null);
  };

  return (
    <div className="container">
      <div className="searchBar">
        <div className="filters">
          <div className="filterWrap">
            <FontAwesomeIcon icon={faSliders} className="fontAwesomeIcon" />

            <select
              name="filterBy"
              className="selectWrapper"
              onChange={changeFilter}
              defaultValue="null"
              id="filterBy"
            >
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
          <div className="filterWrap">
            <select
              name="sortBy"
              className="selectWrapper"
              onChange={(e) =>
                setSort({ ...sort, sortProperty: e.target.value })
              }
              id="sortBy"
            >
              {filter?.filterProperty === "null" ? (
                <>
                  <option value="createdAt">Recently Added</option>
                  <option value="price">Price</option>
                  <option value="milage">Milage</option>
                  <option value="madeYear">Year</option>
                </>
              ) :(
                <option value={filter?.filterProperty}></option>
              )}
            </select>
            <div className="ascdesccontainer">
              <FontAwesomeIcon
                onClick={() => setOrder()}
                icon={faSortAsc}
                className={
                  activeSortOrderAsc
                    ? "fontAwesomeIconBigger"
                    : "fontAwesomeActive"
                }
              />
              <FontAwesomeIcon
                onClick={() => setOrder()}
                icon={faSortDesc}
                className={
                  activeSortOrderAsc
                    ? "fontAwesomeActive"
                    : "fontAwesomeIconBigger"
                }
              />
            </div>
          </div>
        </div>
        <div className="searchWrap">
          <div className="form-input">
            <input
              onChange={(e) =>
                setSearch({ ...search, searchKeyword: e.target.value })
              }
              id="searchWord"
              type="text"
              placeholder="Search"
            />
            <FontAwesomeIcon
              onClick={isSearchActive ? closeSearch : applySearch}
              icon={isSearchActive ? faClose : faSearch}
              className="fontAwesomeIconSearch"
            />
          </div>
        </div>

        {filter?.filterProperty === "null" ? null : (
          <div id="searchBarFilterMenu" className="searchBarFilterMenu">
            {isFilterActive == true ? (
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
            ) : (
              <div className="form-input">
                <label htmlFor={filter?.filterProperty}>
                  {filter?.filterProperty}
                </label>
                <div className="selectWrapper">
                  <select
                    className="selectWrapper"
                    onChange={(e) =>
                      setFilter({
                        ...(filter
                          ? filter
                          : {
                              filterProperty: "price",
                              filterValue: "1000",
                              filterOperator: ">",
                            }),
                        filterOperator: e.target.value,
                      })
                    }
                    defaultValue={filter?.filterOperator}
                  >
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                  </select>
                </div>
                <input
                  id="priceToFilter"
                  onChange={(e) =>
                    setFilter({
                      ...(filter
                        ? filter
                        : {
                            filterProperty: "price",
                            filterValue: "1000",
                            filterOperator: ">",
                          }),
                      filterValue: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Enter value"
                />
                <button
                  onClick={applyFilter}
                  className="btn btn-social applyFilter"
                >
                  Apply Filter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="buyScreen">
        <BuyCarsList
          search={searchToQuery}
          sort={sort}
          filter={filterToQuery}
          startAfterRef={CurrentStartAfterRef}
        />
      </div>
      <h2 className="loading">loading data...</h2>
    </div>
  );
}
