import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth/AuthContext";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  User,
  auth,
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
  query,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  where,
} from "../../utils/firebase";
import { PhoneNrEditContainer } from "./PhoneNrContainer";
import { useContext } from "react";
import { UsernameEditContainer } from "./UsernameEdit";
import { EmailEditContainer } from "./EmailEditContainer";
import { showToolTip } from "../../utils/helpers";

const ProfileWrapEdit = () => {
  const { user, isProviderGoogle } = useContext(AuthContext);

  const navigate = useNavigate();

  const deleteUserDoc = async (currentUserId: string) => {
    const userDocRef = doc(db, "users", currentUserId);
    await deleteDoc(userDocRef);
    showToolTip("User data deleted", "green");
  };

  const deleteUserAds = async (currentUserId: string) => {
    const adsCollectionRef = collection(db, "cars");
    const queryUserAds = query(
      adsCollectionRef,
      where("userID", "==", currentUserId)
    );
    const userAds = await getDocs(queryUserAds);
    const deletePromises = userAds.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });
    await Promise.all(deletePromises);
    showToolTip("User ads deleted", "green");
  };

  const reauthenticateWithPassword = async (currentUser: User) => {
    const passwordPrompt = prompt(
      "Please enter your password to confirm the change"
    );
    if (passwordPrompt === null) {
      return;
    }
    const providerCredential = EmailAuthProvider.credential(
      user?.email as string,
      passwordPrompt
    );
    await reauthenticateWithCredential(currentUser, providerCredential);
    showToolTip(
      "Note: you will not be able to access your messages again",
      "yellow"
    );
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) {
      showToolTip("You must be logged in", "red");
      return;
    }
    if (user) {
      try {
        if (isProviderGoogle() == true) {
          const provider = new GoogleAuthProvider();
          await reauthenticateWithPopup(auth.currentUser, provider);
          showToolTip(
            " Note: you will not be able to acces your messages again",
            "yellow"
          );
        } else {
          await reauthenticateWithPassword(auth.currentUser);
        }

        await deleteUserDoc(auth.currentUser.uid);
        await deleteUserAds(auth.currentUser.uid);
        await auth.currentUser?.delete();
        navigate("/login");
        showToolTip("Account deleted", "green");
      } catch (error) {
        showToolTip(error as string, "red");
      }
    }
  };

  const handleResetPassword = async () => {
    if (auth.currentUser && user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        showToolTip("Password reset email sent", "green");
      } catch (error) {
        showToolTip(error as string, "red");
      }
    } else {
      showToolTip("You must be logged in", "red");
    }
  };

  return (
    <div className="profile-wrap">
      <h3>Profile info</h3>
      <UsernameEditContainer />
      <EmailEditContainer />
      <PhoneNrEditContainer />
      {user?.phoneNr ? null : (
        <div className="infoTagProfile">Please enter a valid phone number</div>
      )}

      <div className="infoButtons">
        <button
          onClick={handleResetPassword}
          id="resetPasswordButton"
          className="btn btn-social"
        >
          Reset Password
        </button>
        <button
          onClick={handleDeleteAccount}
          id="deleteAccount"
          className="btn btn-social"
        >
          Delete my Account
        </button>
      </div>
    </div>
  );
};

export default ProfileWrapEdit;
