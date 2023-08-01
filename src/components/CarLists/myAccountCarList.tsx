import { db , getDocs, limit, orderBy, startAfter,where,query ,auth ,collection, onAuthStateChanged} from "../../utils/firebase";
import {useEffect,useState} from "react";
import { CarCardsList} from "./CarCard";
import { LoadingOverlay } from "../Navigation/LoadingOverlay";
import { showToolTip } from "../Navigation/Footer";


export const MyCarList = () => {

    
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [carDocs, setCarDocs] = useState<any[]>([]);
    const [requestMoreData, setRequestMoreData] = useState<boolean>(false);
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
    const [snapSize, setSnapSize] = useState<number>(0);


    useEffect(() => {   

        if (initialLoad == false && requestMoreData == false) {return;}
        if (snapSize == 0 && initialLoad == false) {return;}
        const getCars = async () => {
            const carsCollection = collection(db, "cars");
            const querys : any =
             query(
                carsCollection, 
                where('userID', '==', auth!?.currentUser!?.uid!),
                orderBy("createdAt", "asc"),
                startAfter(lastDoc || 0),
                limit(2)
            );
            const querySnapshot = await getDocs(querys);
            const carsData = querySnapshot.docs.map((carDoc) => {
                const carData : any = carDoc.data();
                carData.id = carDoc.id;
                return carData;
            });
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
            const carsDataWithDatas = await Promise.all(carsData);
            setSnapSize(querySnapshot.size);
            
            if(lastDoc==null){
                setInitialLoad(false);
                setCarDocs(carsDataWithDatas);
            }else{
                setCarDocs([...carDocs,...carsDataWithDatas ]);
            }
        };
      
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getCars();
            }
        });
        setRequestMoreData(false);     
    }, [requestMoreData]);
      
    return (
        <>
            <CarCardsList carsDataArray={carDocs}/>
            {   requestMoreData==false ?(
                    <button 
                        onClick={(snapSize == 0) && initialLoad==false ?
                            () => showToolTip("No more ads", "red")
                            :() => setRequestMoreData(true)
                        }
                        className=
                        {
                            snapSize==0 && initialLoad==false
                             ? "no-button" : "btn btn-social loadMoreBtn"
                        }
                        >
                            { snapSize==0  && initialLoad==false 
                            ? "No Ads" : "Load More"}
                    </button>  
                ):
                (
                    <LoadingOverlay/>
                )    
            } 
        </>
  );
};
