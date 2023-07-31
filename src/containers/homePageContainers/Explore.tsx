import {
  auth,
  collection,
  db,
  doc,
  getDoc,
  limit,
  orderBy,
  query,
  getDocs,
  DocumentData,
} from "../../utils/firebase";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import bottomPng from "../../assets/bottom.png";
import user_default from "../../assets/user_default.svg";

const Explore = () => {
  const navigate = useNavigate();
  const [countCars, setCountCars] = useState<number>(0);
  const [countUsers, setCountUsers] = useState<number>(0);
  const [users, setUsers] = useState<DocumentData[]>([]);

  useEffect(() => {

    const getCounts = async () => {
      const countsDocRef = doc(db, "system", "counts");
      const countsDoc = await getDoc(countsDocRef);
      const countsData = countsDoc.data();
      setCountCars(countsData?.countCars);
      setCountUsers(countsData?.countUsers);
    };

    const getUsers = async () => {
      const usersColRef = collection(db, "users");
      const usersQuery = query(
        usersColRef,
        orderBy("createdAt", "desc"),
        limit(4)
      );
      const querySnapshot = await getDocs(usersQuery);
      const usersData = querySnapshot.docs.map((userDoc) => {
        const userData = userDoc.data();
        userData.userID = userDoc.id;
        return userData;
      });
      setUsers(usersData);
    };
    getCounts();
    getUsers();
  }, []);

  return (
    <div className="container">
      <section className="explore">
        <div className="grid">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div>
          <h2>Explore our top car dealers</h2>
          <p>
            Our top car dealers are carefully selected based on a range of
            factors, including how much time they have been members and overall
            reputation within the industry. By showcasing our top car dealers,
            we provide buyers with a curated selection of high-quality cars and
            a streamlined way to find the right dealer for their needs.
          </p>
          <div className="stats">
            <div>
              <small>Cars Listed</small>
              <h3 id="countCars">{countCars}</h3>
            </div>
            <div>
              <small>Users Created</small>
              <h3 id="countUsers">{countUsers}</h3>
            </div>
          </div>
        </div>
      </section>
      {auth.currentUser != null ? (
        <>
          <section className="dealers">
            <div className="heading">
              <h2>Our top Car Dealers</h2>
            </div>
            <div id="cards" className="cards">
              {users.map((user) => (
                <div className="card" key={user.userID}>
                  <img
                    src={bottomPng}
                    alt="card starter"
                    width={198.4}
                    height={52.28}
                    className="bg-img hoverZoomLink"
                  />
                  <div id="imgWrapDealerCard">
                    <img
                      src={user.photoURL ?? user_default}
                      alt="user"
                      className="profile-img"
                    />
                  </div>
                  <h3>{user.username}</h3>
                  <h3>
                    Cars listed:{" "}
                    {user.adsArray != null ? user?.adsArray?.length : 0}
                  </h3>
                  <button
                    onClick={() => navigate(`/user/${user.userID}`)}
                    className="card-btn"
                  >
                    See profile
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default Explore;
