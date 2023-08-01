import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CarCardsList } from "../../components/CarLists/CarCard";
import { LoadingOverlay } from "../../components/Navigation/LoadingOverlay";
import { showToolTip } from "../../utils/helpers";
import { CarDocument } from "../../../types";
import { useCallback } from "react";
import {
  doc,
  db,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  startAfter,
  limit,
  orderBy,
  DocumentData,
  Query,
} from "../../utils/firebase";
import { UserProfileContainer } from "../../containers/userProfileContainers/UserProfileContainer";


export const User = () => {

  const { userID } = useParams<{ userID: string }>();
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [carDocs, setUserAds] = useState<CarDocument[]>([]);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [requestMoreData, setRequestMoreData] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [snapSize, setSnapSize] = useState<number>(0);

  const getUserAds = useCallback(
    async (userData: DocumentData) => {
      const carsCollection = collection(db, "cars");
      const carsQuery: Query<DocumentData> = query(
        carsCollection,
        where("userID", "==", userID as string),
        orderBy("createdAt", "asc"),
        startAfter(lastDoc || 0),
        limit(2)
      );
      const querySnapshot = await getDocs(carsQuery);
      const carsData = querySnapshot.docs.map((carDoc) => {
        const carData = carDoc.data() as CarDocument;
        carData.id = carDoc.id;
        carData.userPhoto = userData?.photoURL;
        return carData;
      });
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setSnapSize(querySnapshot.size);
      const userCarAds = await Promise.all(carsData);

      if (lastDoc == null) {
        setInitialLoad(false);
        setUserAds(userCarAds);
      } else {
        setUserAds([...carDocs, ...userCarAds]);
      }
    },
    [carDocs, lastDoc, userID]
  );

  const fetchData = useCallback(async () => {
    if (initialLoad === true) {
      const userRef = doc(db, "users", userID as string);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data() as DocumentData;
      setUserData(userData);
      await getUserAds(userData);
    } else {
      await getUserAds(userData as DocumentData);
    }
  }, [getUserAds, initialLoad, userID, userData]);



  useEffect(() => {
    if (initialLoad === false && requestMoreData === false) return;
    if (snapSize === 0 && initialLoad === false) return;
    fetchData();
    setRequestMoreData(false);
  }, [requestMoreData, initialLoad, snapSize, fetchData]);

  return (
    <div className="container">
      <div className="profile-screen">
        <UserProfileContainer
          userData={userData}
        />
        <div id="profileAds">
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
        </div>
      </div>
    </div>
  );
};
