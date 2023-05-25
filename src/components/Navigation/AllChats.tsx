

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth, collection, db, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, where } from "../../firebase";
import user_default from "../../assets/user_default.svg";


export interface AllChatProps {
    classProp: string;
    updateUnreadMessages : (count: number) => void;
}

/**
 * This component is used to display all the chats that the user has.
 */
export const AllChats  = ({classProp, updateUnreadMessages }:AllChatProps) => {

    const navigate = useNavigate();
    
    const [chats, setChats] = useState<any[]>([]);
   

    useEffect(() => {

        /**
         *  This function is used to get all the chats that the user has.
         */
        const getUserMessages = async () => {
        
            const chatsRef = collection(db, "chats");
            const queryChats = query(chatsRef, where("users", "array-contains", auth.currentUser?.uid));
            const userChatsSnapshot = await getDocs(queryChats);
            let numberOfUnreadMessages = 0;
        
            const chatPromises = userChatsSnapshot.docs.map(async (chat) => {
                const otherUserID = chat.data().users.find((user: string) => user !== auth.currentUser?.uid);
                const otherUserDocRef = doc(collection(db, "users"), otherUserID);
                const otherUserDocSnapshot = await getDoc(otherUserDocRef);
                const chatPhoto = otherUserDocSnapshot.data()?.photoURL;
      
                const chatID = chat.id;
        
                const messagesRef = collection(db, "chats", chatID as string, "messages");
                const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
        
                const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const lastMessage = change.doc.data().text;
                            const participants: string[] = change.doc.data().participants;
                            const currentUserId: string = auth?.currentUser?.uid as string;
                            const isMessageRead: boolean = participants.includes(currentUserId);

                            isMessageRead ? updateUnreadMessages(numberOfUnreadMessages) : updateUnreadMessages(numberOfUnreadMessages + 1);
                            setChats((prevChats) => {
                                // Find the chat in the chats array
                                const updatedChats = prevChats.map((prevChat) => {
                                    if (prevChat.chatID === chatID) {
                                        return {
                                        ...prevChat,
                                        lastMessage,
                                        isMessageRead,
                                        };
                                    }
                                    return prevChat;
                                });
                                return updatedChats;
                            });
                        }
                    });
                });
        
                const lastMessageSnapshot = await getDocs(messagesQuery);
                const lastMessage = lastMessageSnapshot.docs[0].data().text;
                const participants: string[] = lastMessageSnapshot.docs[lastMessageSnapshot.docs.length - 1].data().participants;
                const currentUserId: string = auth?.currentUser?.uid as string;
                const isMessageRead: boolean = participants.includes(currentUserId);
        
                return { chatID, chatPhoto, lastMessage, isMessageRead, unsubscribe };
            });
        
            const chatsData = await Promise.all(chatPromises);
            setChats(chatsData);
        };
      
        getUserMessages();
      
        // Clean up the subscriptions when the component unmounts
        return () => {
            chats.forEach((chat) => {
                if (chat.unsubscribe) {
                    chat.unsubscribe();
                }
            });
        };

    }, []);


    
    /**
     * This function is used to shorten a message if it is too long.
     */
   const shortenLastMessage = (message: string) => {
        if (message.length > 10) {
            return message.slice(0, 10) + "...";
        } else {
            return message;
        }
    };


        
    return (
        <div className={classProp}>
            <div className="refreshMessagesWrapper">
                
            <h3>Messages</h3>
            </div>
            {   chats.map((chat) => {
                return (
                    <div 
                        onClick={() => navigate(`/chats/chat/${chat.chatID}`)}
                        className="chatSnap" key={chat.chatID}>
                        <div className="chatPhoto">
                            <img 
                                src={chat.chatPhoto || user_default}
                                alt="random image lorem" />
                        </div>
                        <div className="lastMessage">
                            {shortenLastMessage(chat.lastMessage)}
                        </div>
                        {
                            !chat.isMessageRead && (
                                <div className="newMessageButton">
                                    <FontAwesomeIcon icon={faCircle}  className="dot"/>

                                </div>
                            )
                        }

                    </div>
                 )     ;      
                })
                
            }
            {chats.length > 7 &&(

                <div className= "ShowMoreButton">
                    Show More
                </div>
            )     
            
            }
        </div>
    );
};