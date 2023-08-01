import {
  db,
  getDocs,
  limit,
  orderBy,
  startAfter,
  where,
  query,
  auth,
  collection,
  onAuthStateChanged,
  DocumentData,
  Query,
} from "../../utils/firebase";
import { useEffect, useState } from "react";
import { CarCardsList } from "./CarCard";
import { LoadingOverlay } from "../Navigation/LoadingOverlay";
import { showToolTip } from "../../utils/helpers";
import { CarDocument } from "../../../types";


export const CurrentUserAds = () => {
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [carDocs, setCarDocs] = useState<CarDocument[]>([]);
  const [requestMoreData, setRequestMoreData] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [snapSize, setSnapSize] = useState<number>(0);

  useEffect(() => {
    if (initialLoad == false && requestMoreData == false) {
      return;
    }
    if (snapSize == 0 && initialLoad == false) {
      return;
    }
    const getCars = async () => {
      const carsCollection = collection(db, "cars");

      if (!auth.currentUser) {
        showToolTip("You are not logged in", "red");
        return;
      }

      const carsQuery: Query<DocumentData> = query(
        carsCollection,
        where("userID", "==", auth.currentUser.uid),
        orderBy("createdAt", "asc"),
        startAfter(lastDoc || 0),
        limit(2)
      );
      const querySnapshot = await getDocs(carsQuery);
      const carsData = querySnapshot.docs.map((carDoc) => {
        const carData = carDoc.data() as CarDocument;
        carData.id = carDoc.id;
        return carData;
      });
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      const carsDataWithDatas = await Promise.all(carsData);
      setSnapSize(querySnapshot.size);

      if (lastDoc == null) {
        setInitialLoad(false);
        setCarDocs(carsDataWithDatas);
      } else {
        setCarDocs([...carDocs, ...carsDataWithDatas]);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        getCars();
      }
    });
    setRequestMoreData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestMoreData]);

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
