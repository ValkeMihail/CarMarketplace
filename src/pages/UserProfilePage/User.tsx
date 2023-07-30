import { useEffect ,useState} from 'react';
import {  useParams  } from 'react-router-dom';
import user_default from '../../assets/user_default.svg';
import {doc, db ,getDoc,collection, query, where, getDocs, startAfter, limit,orderBy } from '../../utils/firebase';
import { CarCard } from '../../components/CarLists/CarCard';
import { LoadingOverlay } from '../../components/Navigation/LoadingOverlay';
import { showToolTip } from '../../components/Navigation/Footer';





export const User = () => {


    const { userID } = useParams<{ userID: string }>();
    const [userData, setUserData] = useState<any | null>(null);
    const [carDocs, setUserAds] = useState<any[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [requestMoreData, setRequestMoreData] = useState<boolean>(false);
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
    const [snapSize, setSnapSize] = useState<number>(0);

    useEffect(() => {
        if (initialLoad === false && requestMoreData === false) {
            return;
        }
        if (snapSize === 0 && initialLoad === false) {
            return;
        }
    
    
        const getUserAds = async (userData: any) => {
        
            const carsCollection = collection(db, "cars");
            const querys : any = query(
                carsCollection,
                where('userID', '==', userID as string),    
                orderBy("createdAt", "asc"),
                startAfter(lastDoc || 0),
                limit(2)
            );
            const querySnapshot = await getDocs(querys);
            const carsData = querySnapshot.docs.map((carDoc) => {
                const carData: any = carDoc.data();
                carData.id = carDoc.id;
                carData.userPhoto = userData?.photoURL;
                return carData;
            });
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setSnapSize(querySnapshot.size);
            const carsDataWithDatas = await Promise.all(carsData);

            if(lastDoc==null){
                setInitialLoad(false);
                setUserAds(carsDataWithDatas);
            }else{
                setUserAds([...carDocs,...carsDataWithDatas ]);
            }
        };
    
        const fetchData = async () => {
            if (initialLoad === true) {
                const userRef = doc(db, "users", userID as string);
                const userSnapshot = await getDoc(userRef);
                const userData = userSnapshot.data() as any;
                setUserData(userData);
                await getUserAds(userData);
            } else {
                await getUserAds(userData);
            }
        };
        
        fetchData();
        setRequestMoreData(false);
    }, [requestMoreData]);


    return (

        <div className="container">
            <div className="profile-screen">
                <div className="profile_container">
                <div className="profile-wrap">
                    <div className="img-container"
                        
                        >
                    <img
                        id="photoHolder"
                        src={userData?.photoURL || user_default}
                        alt="Profile picture"
                    />
                    </div>
                    <h3 id="displayNameHolder">
                        {userData?.username || "No display name"}
                    </h3>
                    <div className="badgesWrap">
                    <div className="badge">
                        <p id="badge">
                        {userData?.createdAt ? userData?.createdAt.toDate().toLocaleDateString() : "No date"}    
                        </p>
                    </div>
                    </div>
                </div>
                <div className="profile-wrap">
                    <div className="form-input">
                    <label>Username:</label>
                    <h3 id="userName" >
                        {userData?.username || "No username"}
                    </h3>
                    </div>
                    <div className="form-input">
                    <label>Email:</label>
                    <h3 id="userEmail"> 
                        {userData?.email || "No email"}
                    </h3>
                    </div>
                    <div className="form-input">
                    <label>Phone Number:</label>
                    <h3 id="phoneNumber" >
                        {userData?.phoneNr || "No phone number"}
                    </h3>
                    </div>
                </div>
                </div>
                <div id="profileAds">
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
                </div>
            </div>
        </div>
    );
}
  