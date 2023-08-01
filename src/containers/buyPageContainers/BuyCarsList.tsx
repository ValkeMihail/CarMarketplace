import {
  collection,
  db,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  collectionGroup,
  OrderByDirection,
  QuerySnapshot,
  WhereFilterOp,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  Query,
} from "../../utils/firebase";
import { useState, useEffect } from "react";
import { CarCardsList } from "../../components/CarLists/CarCard";
import { filterType, SearchProps, sortType } from "../../pages/BuyPage/Buy";
import { LoadingOverlay } from "../../components/Navigation/LoadingOverlay";
import { CarDocument } from "../../../types";
import { showToolTip } from "../../utils/helpers";

type AllCarsListProps = {
  sort: sortType | null;
  filter: filterType | null;
  search: SearchProps | null;
  startAfterRef: [] | number | null;
};

const BuyCarList = ({
  sort,
  filter,
  search,
  startAfterRef,
}: AllCarsListProps) => {
  const [carDocs, setCarDocs] = useState<CarDocument[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<CarDocument> | null>(null);
  const [requestMoreData, setRequestMoreData] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [snapSize, setSnapSize] = useState<number>(0);

  useEffect(() => {
    setCarDocs([]);
    setLastDoc(null);
    setInitialLoad(true);
    setRequestMoreData(true);
  }, [filter, sort, search, startAfterRef]);

  useEffect(() => {
    if (initialLoad == false && requestMoreData == false) return;
    if (snapSize == 0 && initialLoad == false) return;

    const getCars = async (
      sort: sortType | null,
      filter: filterType | null,
      search: SearchProps | null
    ) => {
      const carsQuery = getCarsQuery(sort, filter, search);

      const carsSnapshot = await getDocs(carsQuery);
      const carsWithData = await getCarsData(carsSnapshot);

      setLastDoc(
        carsSnapshot.docs[
          carsSnapshot.docs.length - 1
        ] as QueryDocumentSnapshot<CarDocument>
      );
      setSnapSize(carsSnapshot.docs.length);

      if (!lastDoc) {
        setCarDocs(carsWithData as CarDocument[]);
        setInitialLoad(false);
      } else {
        setCarDocs([...carDocs as CarDocument[], ...carsWithData as CarDocument[]]);
      }
    };

    getCars(sort, filter, search);
    setRequestMoreData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestMoreData]);

  const getUserPhoto = async (userID: string) => {
    const userDoc = await getDocs(collection(db, "users"));
    const userDocs = userDoc.docs;
    const user = userDocs.find((userDoc) => userDoc.id === userID);
    return user?.data().photoURL as string;
  };

  const getCarsData = async (carsSnapshot: QuerySnapshot<DocumentData>) => {
    const carsData = carsSnapshot.docs.map(async (CarDoc) => {
      const carData = CarDoc.data();
      const userID = carData.userID;
      carData.id = CarDoc.id;
      const userPhotoURL = await getUserPhoto(userID);
      carData.userPhoto = userPhotoURL;
      return carData;
    });

    return await Promise.all(carsData);
  };

  const getCarsQuery = (  sort: sortType | null,  filter: filterType | null,  search: SearchProps | null) => {
    const carsCollection = collection(db, "cars");
    const carsCollectionGroup = collectionGroup(db, "cars");

    let carsQuery: Query<DocumentData>;

    if (search && filter && sort)
      carsQuery = query(
        carsCollectionGroup,
        orderBy(sort.sortProperty, sort.sortOrder as OrderByDirection),
        where(
          filter.filterProperty as string,
          filter.filterOperator as WhereFilterOp,
          Number(filter.filterValue)
        ),
        where("searchKeywords", "array-contains", search.searchKeyword),
        startAfter(lastDoc || startAfterRef),
        limit(2)
      );
    else if (search && !filter && sort)
      carsQuery = query(
        carsCollectionGroup,
        orderBy(sort.sortProperty, sort.sortOrder as OrderByDirection),
        where("searchKeywords", "array-contains", search.searchKeyword),
        startAfter(lastDoc || startAfterRef),
        limit(2)
      );
    else if (!search && filter && sort)
      carsQuery = query(
        carsCollection,
        orderBy(sort.sortProperty, sort.sortOrder as OrderByDirection),
        where(
          filter.filterProperty as string,
          filter.filterOperator as WhereFilterOp,
          Number(filter.filterValue)
        ),
        startAfter(lastDoc || startAfterRef),
        limit(2)
      );
    else if (!search && !filter && sort)
      carsQuery = query(
        carsCollection,
        orderBy(sort.sortProperty, sort.sortOrder as OrderByDirection),
        startAfter(lastDoc || startAfterRef),
        limit(2)
      );
    else
      carsQuery = query(
        carsCollection,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc || startAfterRef),
        limit(2)
      );
    return carsQuery;
  };

  return (
    <>
      <CarCardsList carsDataArray={carDocs} />
      {requestMoreData == false ? (
        <button
          onClick={
            snapSize == 0 && initialLoad == false
              ? () => showToolTip("No more ads", "red")
              : () => setRequestMoreData(true)
          }
          className={
            snapSize == 0 && initialLoad == false
              ? "no-button"
              : "btn btn-social loadMoreBtn"
          }
        >
          {snapSize == 0 && initialLoad == false ? "No Ads" : "Load More"}
        </button>
      ) : (
        <LoadingOverlay />
      )}
    </>
  );
};

export default BuyCarList;
