import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth/AuthContext";
import { AccountImageContainer } from "./AccountImageContainer"
import { useContext } from "react";

const ProfileWrapHero = () => {


  const { user ,signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  
  const handleLogout = () => {
    signOut();
    navigate("/login");
  };




  return (
    <div className="profile-wrap">
      <AccountImageContainer  user={{    photoURL: user?.photoURL,  }}/>
      <h3 id="displayNameHolder">
        {user?.username ?? "No username available"}
      </h3>
      <div className="buttonwrap">
        <button
          onClick={handleLogout}
          className="btn btn-social"
          id="logOut"
        >
          Logout
        </button>
      </div>
      <div className="badgesWrap">
        <div className="badge">
          <p id="badge">
            {user?.createdAt?.toDate().toLocaleDateString() ?? "No date available"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfileWrapHero
