import { useEffect, useState } from "react";
import BuyCarList from "../../containers/buyPageContainers/BuyCarsList";
import { FilterWrapContainer } from "../../containers/buyPageContainers/FilterWrapContainer";
import { SortWrapContainer } from "../../containers/buyPageContainers/SortWrapContainer";
import { SearchWrapContainer } from "../../containers/buyPageContainers/SearchWrapContainer";
import { FilterMenu } from "../../containers/buyPageContainers/FilterMenu";

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
  const [CurrentStartAfterRef, setCurrentStartAfterRef] = useState<
    [] | number | null
  >(null);
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
    const sortPropertyMap: { [key: string]: string } = {
      null: "createdAt",
      price: "price",
      madeYear: "madeYear",
      milage: "milage",
    };

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
    } else {
      setSort({ ...sort, sortProperty: sortPropertyMap[filterBy] });
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
          <FilterWrapContainer changeFilter={changeFilter} />
          <SortWrapContainer
            setOrder={setOrder}
            activeSortOrderAsc={activeSortOrderAsc}
            filter={filter}
            sort={sort}
            setSort={setSort}
          />
        </div>
        <SearchWrapContainer
          applySearch={applySearch}
          closeSearch={closeSearch}
          isSearchActive={isSearchActive}
          search={search}
          setSearch={setSearch}
        />
        <FilterMenu
          applyFilter={applyFilter}
          closeFilter={closeFilter}
          setFilter={setFilter}
          filter={filter}
          isFilterActive={isFilterActive}
        />
      </div>
      <div className="buyScreen">
        <BuyCarList
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
