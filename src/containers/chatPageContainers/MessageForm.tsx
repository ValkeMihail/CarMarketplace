import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useRef, useState} from "react";
import { Timestamp, addDoc, auth, collection, db, doc, getDownloadURL, ref, storage, updateDoc, uploadBytes } from "../../utils/firebase";
import { faFile, faImage } from "@fortawesome/free-solid-svg-icons";
import { showToolTip } from "../../utils/helpers";


type MessageFormProps = {
  chatID?: string;
}



export function MessageForm({
  chatID
}: MessageFormProps) {

  const inputFileRef = useRef<HTMLInputElement>(null);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const [focusonInputMobile, setFocusonInputMobile] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleFocus = () => {
    const media = window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
    if (media === "mobile") {
      setFocusonInputMobile(true);
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
  
      if (newFiles.length + selectedImages.length > 15) {
        showToolTip("You can only add up to 15 images.", "red");
        return;
      }
  
      if (files[0].type.includes("image")) {
       
        setSelectedImages((prevImages) => [...prevImages, ...newFiles]);
        setSelectedFile(null);
      } else {

        setSelectedFile(newFiles[0]);
        setSelectedImages((prevImages) => [...prevImages]);
      }
    }
  };
  
  const removeImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleClickImageUpload = () => {
    if (inputImageRef.current) {
      inputImageRef.current?.click();
    }
  };

  const handleClickFileUpload = () => {
    if (inputFileRef.current) {
      inputFileRef.current?.click();
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const uploadMessage = async (dataType : string , text  : string) => {

    const messagesRef = collection(db, "chats", chatID as string, "messages")
    const payload = {  
      senderId: auth.currentUser?.uid,  
      createdAt: Timestamp.now(),  
      participants: [auth.currentUser?.uid],  
      dataType: dataType,
      text: text,
    }
    return await addDoc(messagesRef, payload)
  }

  const uploadFile = async (file : File , messageId : string) => {

    const messagesRef = collection(db, "chats", chatID as string, "messages");
    const storageRef = ref( storage, `chats/${chatID}/${auth.currentUser?.uid}/${messageId}/${file.name}`)
    await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(storageRef);
    await updateDoc(doc(messagesRef, messageId), {
      id: messageId,
      text: fileURL,
      fileName: file.name,
    });
  }
  
  const handleSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (selectedFile) {

      const newMessageDoc = await uploadMessage("file", selectedFile.name)  
      await uploadFile(selectedFile, newMessageDoc.id)
      setSelectedFile(null);
      return;
    }
    
    if (selectedImages.length > 0) {
      
      for (const image of selectedImages) {
        const newMessageDoc = await uploadMessage("image", image.name)
        await uploadFile(image, newMessageDoc.id)
      }
      setSelectedImages([]);
      return;

    } else {

      if (newMessage.trim() === "") return;
      const messagesRef = collection(db, "chats", chatID as string, "messages");      
      const newMessageDoc = await uploadMessage("text", newMessage)
      
      await updateDoc(doc(messagesRef, newMessageDoc.id), {
        id: newMessageDoc.id,
      });
      setNewMessage("");
    }
  };






  return <form className="chat-form" onSubmit={handleSubmitMessage}>
          {selectedImages.length > 0 ? <output id="imageOutput">
              <>
                {selectedImages.map((image, index) => <div className="image" key={index}>
                    <img src={URL.createObjectURL(image)} alt={image.name} loading="lazy" />
                    <span onClick={() => removeImage(index)}>&times;</span>
                  </div>)}
              </>
            </output> : selectedFile != null ? <output id="imageOutput">
              <>
                <div className="file">
                  <FontAwesomeIcon icon={faFile} className="fontAwesomeIconBigger" />
                  <h5>{selectedFile.name}</h5>
                </div>
              </>
            </output> : <>
              <input id="imageInput" type="file" ref={inputImageRef} multiple={true} accept="image/jpeg, image/png, image/jpg" onChange={handleFileInputChange} />
              <input id="imageInput" type="file" ref={inputFileRef} multiple={true} onChange={handleFileInputChange} />
              <input type="textarea" className={focusonInputMobile ? "chat-input-focused" : "chat-input"} placeholder="Type a message..." maxLength={160} value={newMessage} onFocus={handleFocus} onBlur={() => setFocusonInputMobile(false)} onChange={handleMessageChange} />
              {focusonInputMobile ? null : <>
                  <FontAwesomeIcon onClick={handleClickImageUpload} icon={faImage} className="fontAwesomeIconBigger" />
                  <FontAwesomeIcon onClick={handleClickFileUpload} icon={faFile} className="fontAwesomeIconBigger" />
                </>}
            </>}
          <button type="submit">Send</button>
        </form>;
}
  