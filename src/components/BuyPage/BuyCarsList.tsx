import { collection,db ,getDocs, limit, orderBy, query, where, collectionGroup,OrderByDirection, WhereFilterOp, startAfter} from "../../firebase";
import {useState,useEffect} from "react";
import { CarCard } from "../Navigation/CarCard";
import {filterType,SearchProps, sortType} from "./buy";
import { LoadingOverlay } from "../Navigation/LoadingOverlay";
import { showToolTip } from "../Navigation/Footer";


type AllCarsListProps = {
   
    sort  : sortType | null;
    filter : filterType | null;
    search : SearchProps | null;
    startAfterRef : any;
 
};

/**
 * Used in BuyPage to display all car ads in the database 
 * @returns  CarCard component with all car ads in the database
 */
const BuyCarsList = ({ sort, filter ,search, startAfterRef} : AllCarsListProps) => {
      
    
    const [carDocs, setCarDocs] = useState<any[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
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
        
        if (initialLoad == false && requestMoreData == false) {return;}
        if (snapSize == 0 && initialLoad == false) {return;}
       

        const getCars = async ( sort:sortType | null ,filter :filterType | null , search : SearchProps | null) => {

                const carsCollection = collection(db, "cars");
                const carsCollectionGroup = collectionGroup(db, "cars");
                const carsQuery = 
                    // if filter and search active 
                    search != null &&
                    filter != null  ?    
                    query(
                        carsCollectionGroup,
                        orderBy(sort!.sortProperty , sort!.sortOrder as OrderByDirection),
                        where(filter!.filterProperty as string, filter!.filterOperator as WhereFilterOp, Number(filter!.filterValue)),
                        where ("searchKeywords", "array-contains", search!.searchKeyword),
                        startAfter(lastDoc || startAfterRef),
                        limit(2)
                    ):
                    // if filter inactive and search active
                    search !=null &&
                    filter == null ?
                    query(
                        carsCollectionGroup,
                        orderBy(sort!.sortProperty , sort!.sortOrder as OrderByDirection),
                        where ("searchKeywords", "array-contains", search!.searchKeyword),
                        startAfter(lastDoc || startAfterRef),
                        limit(2)
                    ):
                    // if filter active and search inactive
                    search ==null &&
                    filter != null ?
                    query(
                        carsCollection,
                        orderBy(sort!.sortProperty , sort!.sortOrder as OrderByDirection),
                        where(filter.filterProperty as string, filter.filterOperator as WhereFilterOp, Number(filter.filterValue)),
                        startAfter(lastDoc || startAfterRef),
                        limit(2)
                    ):
                    // if filter and search inactive
                    search ==null &&
                    filter == null ?
                    query(
                        carsCollection,
                        orderBy(sort!.sortProperty, sort!.sortOrder as OrderByDirection),
                        startAfter(lastDoc || startAfterRef),
                        limit(2)
                    ) :
                    // if only sort
                    query(
                        carsCollection,
                        orderBy("createdAt", "desc"),
                        startAfter(lastDoc || startAfterRef),
                        limit(2)
                    );
                
                const carsSnapshot = await getDocs(carsQuery!);
                const carsData = carsSnapshot.docs.map(async (CarDoc) => {
                    const carData = CarDoc.data();
                    const userID = carData.userID;
                    carData.id = CarDoc.id;
                    const userPhotoURL = await getUserPhoto(userID);
                    carData.userPhoto = userPhotoURL;
                    return carData;
                });
                const carsWithData = await Promise.all(carsData);
                setLastDoc(carsSnapshot.docs[carsSnapshot.docs.length - 1]);
                setSnapSize(carsSnapshot.docs.length);

                if(lastDoc == null ){
                    setCarDocs(carsWithData);
                    setInitialLoad(false);
                }else{
                    setCarDocs([...carDocs, ...carsWithData]);
                }

             
                
               
        };
        
        getCars(sort,filter,search);
        setRequestMoreData(false);
        
    }, [requestMoreData]);
    


    /**
     *  Used to get the user photo url as a string from the users collection
     * @param userID  The user ID as a string
     * @returns  The user photo URL as a string
     */
    const getUserPhoto = async (userID: string) => {
        const userDoc = await getDocs(collection(db, "users"));
        const userDocs = userDoc.docs;
        const user = userDocs.find((userDoc) => userDoc.id === userID);
        return user?.data().photoURL as string;
    };
  
    return (
        <>
            <CarCard carsDataArray={carDocs}/>
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


export default BuyCarsList;