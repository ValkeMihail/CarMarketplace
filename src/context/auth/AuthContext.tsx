import { createContext, useEffect, useState } from "react";
import {
  auth,
  db,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  doc,
  getDoc,
  setDoc,
  collection,
  Timestamp,
  signInWithEmailAndPassword,
  sendEmailVerification,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  FieldValue,
  createUserWithEmailAndPassword,
  updateDoc,
  increment,
} from "../../utils/firebase";

export interface User {
  id: string;
  email: string | null;
  username: string | null;
  photoURL: string | null;
  phoneCountryCode: string | null;
  favouriteAds: string[] | null;
  createdAt: Timestamp | null;
  adsArray?: string[] | null | undefined | FieldValue;
  phoneNr: string | null;
}

interface AuthContextProps {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  isUserVerified: () => boolean;
  updateUserDoc: (data: Partial<User>) => Promise<void>;
  uploadPhotoFile: (file: File) => Promise<void>;
  setUSER: (data: Partial<User>) => void;
  signInWithEmailAndPasswordHandler: (
    email: string,
    password: string
  ) => Promise<void>;
  createUserWithEmailAndPasswordHandler: (
    email: string,
    password: string
  ) => Promise<void>;
  isProviderGoogle: () => boolean;
  setUserRegistered: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  signInWithGoogle: () => Promise.resolve(),
  isProviderGoogle: () => false,
  signOut: () => Promise.resolve(),
  sendVerificationEmail: () => Promise.resolve(),
  isUserVerified: () => true,
  updateUserDoc: () => Promise.resolve(),
  uploadPhotoFile: () => Promise.resolve(),
  signInWithEmailAndPasswordHandler: () => Promise.resolve(),
  createUserWithEmailAndPasswordHandler: () => Promise.resolve(),
  setUSER:  () => {
    throw new Error("Function not implemented.");
  },
  setUserRegistered: () => {
    throw new Error("Function not implemented.");
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userRef = doc(collection(db, "users"), authUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
        } else {
          await updateDoc(doc(db, "system", "counts"), {
            countUsers: increment(1),
          });
          if (isProviderGoogle() == true) {
            const newUser: User = {
              id: authUser.uid,
              email: authUser.email,
              username: authUser.displayName,
              photoURL: authUser.photoURL,
              phoneCountryCode: null,
              favouriteAds: [],
              createdAt: Timestamp.now(),
              adsArray: null,
              phoneNr: null,
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          } else {
            if (!registeredUser) return;
            const newUser: User = {
              id: authUser.uid,
              email: authUser.email,
              username: registeredUser?.username,
              photoURL: null,
              phoneCountryCode: registeredUser?.phoneCountryCode,
              favouriteAds: [],
              createdAt: Timestamp.now(),
              adsArray: null,
              phoneNr: registeredUser?.phoneNr,
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        }
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registeredUser, auth.currentUser]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmailAndPasswordHandler = async (
    email: string,
    password: string
  ) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser);
  };
  const isUserVerified = () => {
    if (auth.currentUser?.emailVerified) {
      return true;
    } else {
      return false;
    }
  };

  const updateUserDoc = async (data: Partial<User>) => {

    if (!auth.currentUser) return;
    const userRef = doc(collection(db, "users"), auth.currentUser.uid);
    await setDoc(userRef, data, { merge: true });
    setUser((prevState) => ({ ...prevState as User, ...data }));
  };

  const uploadPhotoFile = async (file: File) => {
    if (!auth.currentUser) return;
    const storageRef = ref(
      storage,
      `users/${auth.currentUser.uid}/profilePicture.jpg`
    );
    await uploadBytes(storageRef, file);
    const newPhotoURL = await getDownloadURL(storageRef);
    await updateUserDoc({ photoURL: newPhotoURL });
  };

  const setUSER = (data: Partial<User>) => {
    setUser((prevState) => ({ ...prevState as User, ...data }));
  };
  const createUserWithEmailAndPasswordHandler = async (
    email: string,
    password: string
  ) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const isProviderGoogle = () => {
    if (auth.currentUser?.providerData[0].providerId === "google.com") {
      return true;
    } else {
      return false;
    }
  };

  const setUserRegistered = (data: Partial<User>) => {
    setRegisteredUser((prevState) => ({ ...prevState as User, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUserRegistered,
        isProviderGoogle,
        setUSER,
        isUserVerified,
        uploadPhotoFile,
        createUserWithEmailAndPasswordHandler,
        updateUserDoc,
        signInWithGoogle,
        sendVerificationEmail,
        signInWithEmailAndPasswordHandler,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
