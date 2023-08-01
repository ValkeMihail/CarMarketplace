/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../context/auth/AuthContext";
import {
  db,
  collection,
  query,
  onSnapshot,
  orderBy,
  auth,
  doc,
  updateDoc,
  arrayUnion,
  limit,
  getDoc,
  deleteDoc,
  ref,
  storage,
  deleteObject,
  DocumentData,
} from "../../utils/firebase";

import { ConversationDetailsContainer } from "../../containers/chatPageContainers/ConversationDetailsContainer";
import ChatMessage from "../../containers/chatPageContainers/ChatMessage";
import { MessageForm } from "../../containers/chatPageContainers/MessageForm";
import { showToolTip } from "../../utils/helpers";

export const Chat = () => {
  const chatID = useParams<{ chatID: string }>().chatID;
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [limitNr, setLimitNr] = useState<number>(50);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<DocumentData[]>([]);

  useEffect(() => {
    if (chatContainerRef.current) {
      if (limitNr === 50) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
        return;
      }
      if (
        chatContainerRef.current.scrollTop +
          chatContainerRef.current.clientHeight <
        chatContainerRef.current.scrollHeight - 100
      ) {
        return;
      }
    }
  }, [messages]);

  useEffect(() => {
    chatContainerRef?.current?.addEventListener("scroll", handleScroll);

    getOtherUser();
    const messagesRef = collection(db, "chats", chatID as string, "messages");

    const messagesQuery = query(
      messagesRef,
      orderBy("createdAt", "desc"),
      limit(limitNr)
    );

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

      const reversedMessages = updatedMessages.reverse();
      setMessages(reversedMessages);
    });

    const newMessagesUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const messageId = change.doc.id;
          markMessageAsRead(messageId);
        }
      });
    });

    return () => {
      initialUnsubscribe();
      newMessagesUnsubscribe();
      chatContainerRef.current?.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatID, limitNr]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const scrollTop = chatContainerRef.current.scrollTop;
      if (scrollTop === 0) {
        setLimitNr(limitNr + 50);
      }
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    const messageRef = doc(
      db,
      "chats",
      chatID as string,
      "messages",
      messageId
    );

    const messageDoc = await getDoc(messageRef);

    const participants = messageDoc?.data()?.participants;

    const isMessageRead = participants.includes(
      auth.currentUser?.uid as string
    );

    if (auth.currentUser?.uid && !isMessageRead) {
      await updateDoc(messageRef, {
        participants: arrayUnion(auth.currentUser.uid),
      });
    }
  };

  const getOtherUser = async () => {
    const chatDoc = await getDoc(doc(db, "chats", chatID as string));
    const chatData = chatDoc.data();
    const otherUserID: string = chatData?.users.filter(
      (user: string) => user !== auth.currentUser?.uid
    )[0];
    const otherUserDoc = await getDoc(doc(db, "users", otherUserID));
    setOtherUser(otherUserDoc.data() as User);
  };

  const deleteMessage = async (messageDoc: DocumentData) => {
    if (messageDoc.dataType === "image" || messageDoc.dataType === "file") {
      const storageRef = ref(
        storage,
        `chats/${chatID}/${auth.currentUser?.uid}/${messageDoc.id}/${messageDoc.fileName}`
      );
      await deleteObject(storageRef);
      showToolTip("Message deleted", "green");
    }
    await deleteDoc(
      doc(db, "chats", chatID as string, "messages", messageDoc.id)
    );
    setMessages(
      messages.map((message) => {
        if (message.id === messageDoc.id) {
          message.text = "This message has been deleted";
          message.senderId = "System";
          messageDoc.dataType === "text";
        }
        return message;
      })
    );
  };

  return (
    <div className="fullScreenConversationContainer">
      <ConversationDetailsContainer
        otherUser={{
          id: otherUser?.id,
          photoURL: otherUser?.photoURL,
          username: otherUser?.username,
        }}
      />

      <div ref={chatContainerRef} className="chat-container">
        {messages.map((message) => (
          <ChatMessage
            deleteMessage={deleteMessage}
            message={message}
            otherUser={{ id: otherUser?.id, username: otherUser?.username }}
            key={message.id}
          />
        ))}
        <MessageForm chatID={chatID} />
      </div>
    </div>
  );
};
