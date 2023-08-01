import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userDefault from "../../assets/user_default.svg";
import {
  DocumentChange,
  DocumentData,
  Query,
  auth,
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "../../utils/firebase";

export interface AllChatProps {
  classProp: string;
  updateUnreadMessages: (count: number) => void;
}

export const MessagesNotifications = ({
  classProp,
  updateUnreadMessages,
}: AllChatProps) => {
  const navigate = useNavigate();

  const [chats, setChats] = useState<DocumentData[]>([]);

  useEffect(() => {
    const getUserMessages = async () => {
      const userChats = await getUserChats();

      const chatPromises = userChats.docs.map(async (chat) => {
        const chatPhotoUrl = await getOtherUserPhotoUrl(chat);
        const chatID = chat.id;
        const messagesRef = collection(
          db,
          "chats",
          chatID as string,
          "messages"
        );
        const messageQuery = query(
          messagesRef,
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const unsubscribe = await getUnsubscribe(chatID, messageQuery);
        const { lastMessage, isMessageRead } = await getInitialLastMessage(
          messageQuery
        );

        return {
          chatID,
          chatPhoto: chatPhotoUrl,
          lastMessage,
          isMessageRead,
          unsubscribe,
        };
      });

      const chatsData = await Promise.all(chatPromises);
      setChats(chatsData);
    };

    getUserMessages();

    return () => {
      chats.forEach((chat) => {
        if (chat.unsubscribe) {
          chat.unsubscribe();
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserChats = async () => {
    const chatsRef = collection(db, "chats");
    const chatsQuery = query(
      chatsRef,
      where("users", "array-contains", auth.currentUser?.uid)
    );
    return await getDocs(chatsQuery);
  };

  const getInitialLastMessage = async (messageQuery: Query<DocumentData>) => {
    const lastMessageDocument = await getDocs(messageQuery);
    const lastMessage = lastMessageDocument.docs[0].data().text;
    const participants: string[] =
      lastMessageDocument.docs[lastMessageDocument.docs.length - 1].data()
        .participants;
    const currentUserId: string = auth?.currentUser?.uid as string;
    const isMessageRead: boolean = participants.includes(currentUserId);

    return { lastMessage, isMessageRead };
  };

  const getOtherUserPhotoUrl = async (chat: DocumentData) => {
    const otherUserId = chat
      .data()
      .users.find((user: string) => user !== auth.currentUser?.uid);
    const otherUserDocRef = doc(collection(db, "users"), otherUserId);
    const otherUserDocument = await getDoc(otherUserDocRef);
    return otherUserDocument.data()?.photoURL;
  };

  const updatePreviousChatLastMessage = (
    chatID: string,
    lastMessage: string,
    isMessageRead: boolean
  ) => {
    setChats((prevChats) => {
      return prevChats.map((prevChat) => {
        if (prevChat.chatID === chatID) {
          return {
            ...prevChat,
            lastMessage,
            isMessageRead,
          };
        }
        return prevChat;
      });
    });
  };

  const getUpdatedChatMessage = (change: DocumentChange<DocumentData>) => {
    const lastMessage = change.doc.data().text;
    const participants: string[] = change.doc.data().participants;
    const currentUserId: string = auth?.currentUser?.uid as string;
    const isMessageRead: boolean = participants.includes(currentUserId);

    return { lastMessage, isMessageRead };
  };

  const getUnsubscribe = async (
    chatID: string,
    messageQuery: Query<DocumentData>
  ) => {
    const numberOfUnreadMessages = 0;
    const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const { isMessageRead, lastMessage } = getUpdatedChatMessage(change);
          updatePreviousChatLastMessage(chatID, lastMessage, isMessageRead);
          if (isMessageRead) {
            updateUnreadMessages(numberOfUnreadMessages);
          } else {
            updateUnreadMessages(numberOfUnreadMessages + 1);
          }
        }
      });
    });
    return unsubscribe;
  };

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
      {chats.map((chat) => {
        return (
          <div
            onClick={() => navigate(`/chats/chat/${chat.chatID}`)}
            className="chatSnap"
            key={chat.chatID}
          >
            <div className="chatPhoto">
              <img
                src={chat.chatPhoto || userDefault}
                alt="random image lorem"
              />
            </div>
            <div className="lastMessage">
              {shortenLastMessage(chat.lastMessage)}
            </div>
            {!chat.isMessageRead && (
              <div className="newMessageButton">
                <FontAwesomeIcon icon={faCircle} className="dot" />
              </div>
            )}
          </div>
        );
      })}
      {chats.length > 7 && <div className="ShowMoreButton">Show More</div>}
    </div>
  );
};
