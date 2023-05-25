import { ChangeEvent, useEffect, useState ,useRef} from "react";
import { useParams , useNavigate} from "react-router-dom";

import { db , collection, query, onSnapshot, orderBy, auth ,addDoc,getDownloadURL, doc, Timestamp, updateDoc, arrayUnion, limit, getDoc, deleteDoc, 
        uploadBytes, ref, storage, deleteObject} from "../../firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck,  faEllipsisVertical, faFile, faFileAlt, faFileArchive, faFileAudio,  faFileExcel, faFilePdf, faFilePowerpoint, 
        faFileVideo, faFileWord, faImage, faTrashCan, faX } from "@fortawesome/free-solid-svg-icons";
import user_default from "../../assets/user_default.svg";

import {  User } from "../../AuthContext";
import { getTimeAgo } from "../../Helpers";
import { showToolTip } from "../Navigation/Footer";



export const Chat = () => {
    
    const navigate = useNavigate();
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    
    const inputFileRef = useRef<HTMLInputElement>(null);
    const inputImageRef = useRef<HTMLInputElement>(null);

    const chatID = useParams<{ chatID: string }>().chatID;
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    const [imageCarousel, setImageCarousel] = useState<boolean>(false);
    const [limitNr, setLimitNr] = useState<number>(50);
    const [isFirstMessageSnap , setisFirstMessageSnap] = useState<boolean>(false);
    const [focusonInputMobile, setFocusonInputMobile] = useState<boolean>(false);
    const [otherUser , setOtherUser] = useState<User|null>(null);
    const [newMessage, setNewMessage] = useState("");  
    const [messages, setMessages] = useState<any[]>([]);
    

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    

    useEffect(() => {


        
            
    
        
        isFirstMessageSnap ?
        null
        : chatContainerRef!?.current?.addEventListener("scroll", handleScroll);
        // get the other user data
        getOtherUser();
      
        /**
         * @description this function marks a message as read by adding the current user id to the participants array
         * @param {string} messageId - The ID of the message to mark as read
         */
        const markMessageAsRead = async (messageId : string) => {
          const messageRef = doc(db, "chats", chatID as string, "messages", messageId);
          const messageDoc = await getDoc(messageRef);
          const participants = messageDoc!?.data()?.participants;
          const isMessageRead = participants.includes(auth.currentUser?.uid as string);
          
          if (auth.currentUser?.uid && !isMessageRead) {
            await updateDoc(messageRef, {
              participants: arrayUnion(auth.currentUser.uid),
            });
          }
        };
      
        /**
         * @description this constant holds the reference to the chat collection in the database
         */
        const messagesRef = collection(db, "chats", chatID as string, "messages");
        /**
         * @description this constant holds the query to the messages collection in the database
         * and orders the messages by the createdAt field
         * it is used in the `onSnapshot`
         */

        // if the lastVisible is null then we are getting the first 15 messages
        // else we are getting the next 15 messages after the lastVisible
        let messagesQuery =
            query(
                messagesRef,
                orderBy("createdAt", "desc"),
                limit(limitNr)
            );
            // Set initial messages using onSnapshot
            const initialUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
                const updatedMessages = snapshot.docs.map((doc) => {
                  const data = doc.data();
                  const id = doc.id;
                  return {
                    senderId: data.senderId,
                    text: data.text,
                    createdAt: data.createdAt,
                    participants: data.participants,
                    id,
                    dataType: data.dataType,
                    fileName: data.fileName,
                    isFirstMessage: data.isFirstMessage,
                    firstMessageImageURL: data.firstMessageImageURL,
                  };
                });
                if(
                    updatedMessages[updatedMessages.length - 1].isFirstMessage &&
                    updatedMessages[updatedMessages.length - 1].isFirstMessage === true
                ){
                    setisFirstMessageSnap(true);
                }
                
                // reversing the messages to get the latest messages at the bottom
                const reversedMessages = updatedMessages.reverse();          
                    setMessages(reversedMessages);   
                   
                    
              });
          
            // Listen for new messages using onSnapshot
            const newMessagesUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const messageId = change.doc.id;
                        markMessageAsRead(messageId);
                    
                    }
                });
            });
            
            // Return cleanup function to unsubscribe from the onSnapshot listeners
            return () => {
                
                initialUnsubscribe();
                newMessagesUnsubscribe();
                chatContainerRef.current?.removeEventListener("scroll", handleScroll);
              
              
            };
    }, [chatID,limitNr ]);
    


      /**
       * This is used to paginate the messages when the user scrolls to the top of the chat container
       */
    const handleScroll = () => {
        if (chatContainerRef.current) {
            const scrollTop = chatContainerRef.current.scrollTop;
            if (scrollTop === 0) {
                setLimitNr(limitNr + 50);
            
            }
        }
    };



    /**
     * @description this function makes the messages input field bigger when the user focuses on it
     */ 
    const handleFocus = () => {
        const media = window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
        if (media === "mobile") {
            setFocusonInputMobile(true);
        }
    };


    /**
     * @description this function gets the other user data from the database and sets it to the state otherUser 
     */
    const getOtherUser = async () => {
        const chatRef = doc(db, "chats", chatID as string);
        const chatDoc = await getDoc(chatRef);
        const chatData = chatDoc.data();
        const otherUserID = chatData?.users.filter((user: string) => user !== auth.currentUser?.uid)[0];
        const otherUserRef = doc(db, "users", otherUserID);
        const otherUserDoc = await getDoc(otherUserRef);
        const otherUserData = otherUserDoc.data();
        setOtherUser(otherUserData as User);

    };


    /**
     * @description this function downloads the file from the url based on the url and the file name
     */ 
    function downloadFile(url : string, fileName : string) {
            fetch(url).then( response => response.blob() ).then( blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                showToolTip(error.message as string , "red");
            });
    }



    /**
     * @description this function deletes the message from the database , 
     * if the message is an image it will also delete it from the storage 
     * and sets the message text to "This message has been deleted" 
     * in the state messages
     * @param messageDoc  the message document to be deleted
     * 
     */
    const deleteMessage = async (messageDoc : any ) => {
        if(messageDoc.dataType === "image" ||   messageDoc.dataType === "file"){
            const storageRef = ref(storage, `chats/${chatID}/${auth.currentUser?.uid}/${messageDoc.id}/${messageDoc.fileName}`);
            await deleteObject(storageRef);
            showToolTip("Message deleted" , "green");
        }
        const messageRef = doc(db, "chats", chatID as string, "messages", messageDoc.id);
        await deleteDoc(messageRef);
        setMessages(messages.map((message) => {
            if (message.id === messageDoc.id) {
                message.text = "This message has been deleted";
                message.senderId = "System";
                messageDoc.dataType === "text";
                
            }
            return message;
        }));
    };


    /**
     * @description this function takes the images from the change event and adds them to the state selectedImages
     */
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
          if (selectedImages.length + files.length > 15) {
            showToolTip("You can only add up to 15 images.","red");
            return;
          }
          const newImages = Array.from(files);
          setSelectedImages((prevImages) => [...prevImages, ...newImages]);
          
        }
    };
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files;
        if (file) {
        setSelectedFile(file[0]);
        }
    };

    /**
     * @description this function removes the image with the specified index from the state selectedImages
     * @param index the index of the image to be removed
     */
    const deleteImage = (index: number) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((_, i) => i !== index)
        );
    };


    



    /**
     * @description this function allows to acces the file input from the image
     *  upload button using a refrence to the file input
     */
    const handleClickImageUpload = () => {
        if (inputImageRef.current){
            inputImageRef.current?.click();  
        }
    };
    const handleClickFileUpload = () => {
        if (inputFileRef.current){
            inputFileRef.current?.click();  
        }
    };

   
    
    /**
     * @description this function updated the newMessage state with the value of the input field
     * @param e the change event
     */ 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
    };

    /**
     * @description this function handles the submit of the form and adds the new message to the database 
     * and if the message is an image it will also add it to the storage and updates the state messages
     * @param e the submit event
     */ 
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(selectedFile !== null){
            const messagesRef = collection(db, "chats", chatID as string, "messages");
            const payload = {
                senderId: auth.currentUser?.uid,
                createdAt: Timestamp.now(),
                participants: [auth.currentUser?.uid],
                dataType : "file"
            };
            const newMessageDoc =await addDoc(messagesRef, payload);
            const newMessageID = newMessageDoc.id;
            const storageRef = ref(storage, `chats/${chatID}/${auth.currentUser?.uid}/${newMessageID}/${selectedFile.name}`);
            await uploadBytes(storageRef, selectedFile);
            const fileURL = await getDownloadURL(storageRef);
            await updateDoc(doc(messagesRef, newMessageID), {
                id: newMessageID,
                text: fileURL,
                fileName: selectedFile.name
            });
            setSelectedFile(null);
            return;

        }

        if (selectedImages.length > 0) {
            for (const image of selectedImages) {
                const messagesRef = collection(db, "chats", chatID as string, "messages");
                const payload = {
                    senderId: auth.currentUser?.uid,
                    createdAt: Timestamp.now(),
                    participants: [auth.currentUser?.uid],
                    dataType : "image",
                    fileName: image.name
                };
                const newMessageDoc =await addDoc(messagesRef, payload);
                const newMessageID = newMessageDoc.id;
                const storageRef = ref(storage, `chats/${chatID}/${auth.currentUser?.uid}/${newMessageID}/${image.name}`);
                await uploadBytes(storageRef, image);
                const ImageUrl = await getDownloadURL(storageRef);
                await updateDoc(doc(messagesRef, newMessageID), {
                    id: newMessageID,
                    text: ImageUrl,
                });
            }
            setSelectedImages([]);
            return;
        }else{
            if (newMessage.trim() === "") return;
            const messagesRef = collection(db, "chats", chatID as string, "messages");
            const payload = {
                senderId: auth.currentUser?.uid,
                text: newMessage,
                createdAt: Timestamp.now(),
                participants: [auth.currentUser?.uid],
                dataType : "text"
            };
            setNewMessage("");
            const newMessageDoc =await addDoc(messagesRef, payload);
            const newMessageID = newMessageDoc.id;
            await updateDoc(doc(messagesRef, newMessageID), {
                id: newMessageID,
            });
        }     
    };

    
  return (

    <div className="fullScreenConversationContainer" >
        <div className="convDetails">
            <div className="userWrap">
                <div 
                    onClick={() => navigate(`/user/${otherUser?.id}`)}
                    className="imgWrap">
                        <img 
                            src={otherUser!?.photoURL! || user_default} 
                            alt="noimg" 
                        />
                </div>    
                <h3>
                        {otherUser?.username}
                </h3>
            </div>
            <div className="buttonsWrap">
                <div className="utilityButton">
                    <FontAwesomeIcon icon={faEllipsisVertical} className="fontAwesomeIcon"/>
                </div>
            </div>
        </div>
        <div 
            ref={chatContainerRef}
            className="chat-container">
        
            {messages.map((message,index) => (
                
                <div
                    key={index} 
                    className={
                        message.senderId == 
                        auth?.currentUser!?.uid!
                            ? "chat-message" 
                            : "chat-message otherUser"} 
                   
                >
                    <p className="senderId">
                        {
                        message.senderId == auth?.currentUser!?.uid! 
                            ? ("You") 
                            : message.senderId ==otherUser!?.id ? ( otherUser!?.username!)
                            : "System"
                            
                        }: 
                    </p>

                    {message.dataType == "image"
                        ? (
                            <div className={
                                imageCarousel ? "imageCarouselContainer" : "imageMessageContainer"
                            }>
                                <img
                                    onClick={()=> setImageCarousel(true)}
                                    className={imageCarousel ? "imageMessage" : "imageMessageCarousel"}
                                    src={message.text} alt="image"/>
                                    { imageCarousel &&(

                                        <FontAwesomeIcon icon={faX} 
                                        onClick={()=> setImageCarousel(false)}
                                            className="fontAwesomeIconBigger"/>

                                    )
                                    }
                            </div>
                        ):message.dataType=="text" ? (
                            <div 
                            className="textDivMessageFirst">
                                {message.isFirstMessage && message.firstMessageImageURL && message.isFirstMessage == true ?
                                    (
                                        <>
                                            {message.text.split("?")[0]+"?"}
                                            <div
                                                onClick={()=>navigate(`/ad/${message.text.split("?")[1].match(/[^/]+$/)[0]}`,{state: {id:message.text.split("?")[1].match(/[^/]+$/)[0]}})} 
                                                
                                                className="firstMessage">
                                                <img 
                                                    src={message.firstMessageImageURL} 
                                                    alt="car ad image" 
                                                />
                                                <p className="linkMessage">
                                                        {message.text.split("?")[1]}
                                                </p>
                                            </div>
                                        
                                        </>
                                                                                
                                    ):
                                    (message.text)
                                }
                            </div>
                        ):(
                            <div
                                
                                className="fileDownload">
                                    <FontAwesomeIcon 
                                        icon=
                                            {     message.fileName?.includes(".pdf") ? faFilePdf
                                                : message.fileName?.includes(".doc") ? faFileWord
                                                : message.fileName?.includes(".xls") ? faFileExcel
                                                : message.fileName?.includes(".ppt") ? faFilePowerpoint
                                                : message.fileName?.includes(".zip") ? faFileArchive
                                                : message.fileName?.includes(".mp3") ? faFileAudio
                                                : message.fileName?.includes(".txt") ? faFileAlt
                                                : message.fileName?.includes(".mp4") ? faFileVideo
                                                : faFile 
                                            } 
                                        onClick={()=>downloadFile(message.text,message.fileName)}
                                        className="fontAwesomeIconBigger"/>
                                        <h5>{message.fileName as string}</h5>
                            </div>
                        )
                    }
                  
                    
                    <div className="MessageReadChecks">
                        {message.senderId == auth?.currentUser?.uid 
                            ?(
                                <>
                                {message.participants.length<2 ?
                                    (
                                        <FontAwesomeIcon icon={faCheck} className="fontAwesomeIcon" />
                                    ):(
                                        <>
                                        <FontAwesomeIcon icon={faCheck} className="fontAwesomeIconGreen" />
                                        <FontAwesomeIcon icon={faCheck} className="fontAwesomeIconGreen" />
                                        </>
                                    )
                                }
                                </>
                            )
                            :(
                                <>
                                {message.participants.length<2 ?
                                    (
                                        <FontAwesomeIcon icon={faCheck} className="fontAwesomeIcon" />
                                    ):(
                                        <>
                                        <FontAwesomeIcon icon={faCheck} className="fontAwesomeIconGreen" />
                                        <FontAwesomeIcon icon={faCheck} className="fontAwesomeIconGreen" />
                                        </>
                                    )
                                }
                                </>
                            )
                        }
                    </div>
                    <div className="bottomContainerMessage">
                    { message.senderId == auth?.currentUser?.uid ?(
                        
                        <div 
                            onClick={() => deleteMessage(message)}
                            className="deleteMessageButton">
                            <FontAwesomeIcon icon={faTrashCan} className="fontAwesomeRed"/>
                        </div>
                    ):(
                        <FontAwesomeIcon icon={faCheck} style={{visibility:"hidden"}}/>
                    )
                    }
                     <p className="messageDate">
                        {getTimeAgo(message.createdAt)}
                    </p>
                    </div>
                </div>
            ))}
            <form className="chat-form" onSubmit={handleSubmit}>
           
                        {selectedImages.length > 0
                            ? (
                                <output id="imageOutput">
                                    <>
                                
                                    {selectedImages.map((image, index) => (
                                    
                                            <div className="image" key={index}>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={image.name}
                                                    loading="lazy"
                                            
                                                />
                                                <span onClick={() => deleteImage(index)}>&times;</span>
                                            </div>
                                        
                                    ))}
                                
                                    </>
                                </output>
                            ): selectedFile != null ? (
                                <output id="imageOutput">
                                    <>
                                        <div className="file">
                                            <FontAwesomeIcon icon={faFile} className="fontAwesomeIconBigger"/>
                                            <h5>{selectedFile.name}</h5>
                                        </div>
                                    </>

                                </output>
                            
                            
                            
                            ):
                            (
                                <>
                                    <input
                                        id="imageInput"
                                        type="file"
                                        ref={inputImageRef}
                                        multiple={true}
                                        accept="image/jpeg, image/png, image/jpg"
                                        onChange={handleImageChange}
                                    />
                                     <input
                                        id="imageInput"
                                        type="file"
                                        ref={inputFileRef}
                                        multiple={true}
                                        onChange={handleFileChange}
                                        />
                                    <input type="textarea" 
                                       
                                        className={focusonInputMobile ?  "chat-input-focused" :"chat-input"}
                                        placeholder="Type a message..."
                                        maxLength={160}
                                        value={newMessage} 
                                        onFocus={handleFocus}
                                        onBlur={()=> setFocusonInputMobile(false)}
                                        onChange={handleChange} 
                                    />
                                    {focusonInputMobile ?(null) :(
                                        <>
                                    <FontAwesomeIcon 
                                        onClick={handleClickImageUpload}
                                        icon={faImage} 
                                        className="fontAwesomeIconBigger"
                                    />
                                    <FontAwesomeIcon 
                                        onClick={handleClickFileUpload}
                                        icon={faFile} 
                                        className="fontAwesomeIconBigger"
                                    />
                                        </>
                                        )
                                    }   
                                </>
                            )
                        }           
                <button type="submit">Send</button>
            </form>
        </div>
    </div>
  );
};

