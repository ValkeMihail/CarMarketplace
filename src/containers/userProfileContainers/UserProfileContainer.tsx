import { DocumentData } from "firebase/firestore"
import userDefault from "../../assets/user_default.svg" 

type UserProfileContainerProps = {
  userData: DocumentData | null; 
}

export const UserProfileContainer = ({userData} : UserProfileContainerProps) => {
  return (
    <div className="profile_container">
      <div className="profile-wrap">
        <div className="img-container">
          <img
            id="photoHolder"
            src={userData?.photoURL || userDefault}
            alt="Profile picture"
          />
        </div>
        <h3 id="displayNameHolder">
          {userData?.username || "No display name"}
        </h3>
        <div className="badgesWrap">
          <div className="badge">
            <p id="badge">
              {userData?.createdAt
                ? userData?.createdAt.toDate().toLocaleDateString()
                : "No date available"}
            </p>
          </div>
        </div>
      </div>
      <div className="profile-wrap">
        <div className="form-input">
          <label>Username:</label>
          <h3 id="userName">{userData?.username || "No username"}</h3>
        </div>
        <div className="form-input">
          <label>Email:</label>
          <h3 id="userEmail">{userData?.email || "No email"}</h3>
        </div>
        <div className="form-input">
          <label>Phone Number:</label>
          <h3 id="phoneNumber">{userData?.phoneNr || "No phone number"}</h3>
        </div>
      </div>
    </div>
  )
}


