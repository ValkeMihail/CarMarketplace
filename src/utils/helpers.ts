import { showToolTip } from "../components/Navigation/Footer";
import { 
    Timestamp ,
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    db,
    auth,
    ref,
    storage,
    deleteObject,
    arrayRemove,

} from "./firebase";

/**
 * @description time intervals for getTimeAgo function 
 */
export const timeIntervals = [
    { value: 60000, label: 'minute' },
    { value: 3600000, label: 'hour' },
    { value: 86400000, label: 'day' },
    { value: 604800000, label: 'week' },
    { value: 2629800000, label: 'month' },
    { value: 31557600000, label: 'year' }
  ];


/**
* @description function to get time ago from timestamp
* @param timestamp
* @returns time ago
* @example getTimeAgo(Timestamp.now())
*/
export function getTimeAgo(timestamp : Timestamp) {
    const messageTime = timestamp.toDate();
    const timeDiff = new Date().getTime() - messageTime.getTime();
    const yearsDiff = Math.floor(timeDiff / 31557600000);
   
  
    for (const interval of timeIntervals) {
      const diff = Math.floor(timeDiff / interval.value);
      if (diff < 1) {
        return 'just now';
      } else if (diff < 60) {
        return `${diff} ${interval.label}${diff === 1 ? '' : 's'} ago`;
      }
    }
  
    return `${Math.floor(timeDiff / timeIntervals[timeIntervals.length - 1].value)} year${yearsDiff === 1 ? '' : 's'} ago`;
  }

  
/**
 * @description Formats a number to a string with spaces between every 3 digits
 * @param number The number to be formatted 
 * @returns The formatted number
 */
export function NWS(number: number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * @description Formats a number to a string with no spaces between every 3 digits
 * @param number The number to be formatted
 * @returns The formatted number
 */
export function NWHS( number: number){
    return Number(number.toString().replace(/\s+/g, ''));

}
/**
 * @description Creates a new chat between the current user and the user with the id passed as a parameter if it doesn't exist already
 * @param recipientId  The id of the user to start a chat with 
 * @returns  The id of the chat newly created chat or the existing chat id if it already exists or an empty string if an error occured 
 */
export async function createChat (recipientId: string , url:String, carImageURL : string): Promise<string> {
    let chatId = "";
    const chatsColRef = collection(db, "chats");
    const queryChatBetweetUsers = query(chatsColRef, where("users", "in", [[auth.currentUser!.uid , recipientId]]) );
    const querySnapshot = await getDocs(queryChatBetweetUsers);
    if (querySnapshot.docs.length > 0) {
        chatId = querySnapshot.docs[0].id; 
    }else {
        try {
                const chatRef = collection(db, "chats");
                const newChatDoc = await addDoc(chatRef, {
                    createdAt: Timestamp.now(),
                    users: [auth.currentUser!.uid, recipientId],
                });
            
                chatId = newChatDoc.id;
                
                const messagesRef = collection(db, `chats/${chatId}/messages`);
                await addDoc(messagesRef, {
                    text: `Hello there! Is this car still available? ${url} `,
                    senderId: auth.currentUser!.uid,
                    createdAt: Timestamp.now(),
                    chatId: chatId,
                    participants: [auth.currentUser!.uid],
                    dataType: "text",
                    isFirstMessage: true,
                    firstMessageImageURL: carImageURL,
                });
            } catch (error) {
                showToolTip("Error creating chat", "red");
                chatId = "";
            }
    }
    return chatId;
};

/**
 * @description Deletes the car document from the database and removes it from the carDocs array state and also from the user's context state
 * @param id The id of the car document to be deleted from the database
 * @example deleteCar("1234567890");
 */
export const deleteCar = async (id: string)  => {
    const carDocRef = doc(db, "cars", id);
    const carDoc = await getDoc(carDocRef);
    const carData = carDoc.data();
    const images = carData?.images;
    images?.forEach((image: string) => {
        const imageRef = ref(storage, image);
        deleteObject(imageRef);
    });
    await deleteDoc(carDocRef);
    const userDocRef = doc(db, "users", auth.currentUser!.uid);
    await updateDoc(userDocRef,{
        adsArray: arrayRemove(id),
    });
  
};

