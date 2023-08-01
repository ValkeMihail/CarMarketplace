import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import user_default from "../../assets/user_default.svg";
import { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth/AuthContext";
import { MessagesNotifications } from "./MessageNotifications";
import { auth } from "../../utils/firebase";
import {
  faBars,
  faSun,
  faRightFromBracket,
  faCommentDots,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";



const NavigationBar = () => {
  
  const { user, signOut } = useContext(AuthContext);
  const [isAllChatsVisible, setAllChatsVisible] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const changeTheme = (theme: string) => {
    document.documentElement.className = theme;
    localStorage.setItem("data-theme", theme);
  };

  const loadTheme = useCallback(() => {
    const storageTheme = localStorage.getItem("data-theme");
    storageTheme && changeTheme(storageTheme);
  }, []);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const updateUnreadMessages = (count: number) => {
    setUnreadMessages(count);
  };

  return (
    <div className="navContainer">
      <nav>
        <button
          aria-label="Toggle Menu"
          onClick={toggleMenu}
          className="menu-btn"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <Link to="/" className="brand">
          Car Marketplace
        </Link>
        <div
          onClick={toggleMenu}
          className={isMenuOpen ? "overlayMenuOpen overlayMenu" : "menu"}
          style={{ display: "none" }}
        ></div>

        <ul className={isMenuOpen ? "menu-open menu" : "menu"}>
          <li>
            <div className="toggle-container">
              <button
                className="theme-btn light"
                id="changeThemeButtonFromDarkToLight"
                aria-label="Change Theme"
                onClick={() => changeTheme("light")}
              >
                <FontAwesomeIcon icon={faSun} className="fontAwesomeIcon" />
              </button>
              <button
                id="changeThemeButtonFromLightToDark"
                aria-label="Change Theme"
                className="theme-btn dark"
                onClick={() => changeTheme("dark")}
              >
                <FontAwesomeIcon icon={faMoon} />
              </button>
            </div>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/sell">Sell a Car</Link>
          </li>
          <li>
            <Link to="/buy">Buy a Car</Link>
          </li>
        </ul>
        {user ? null : (
          <div id="whenSignedOut_NavBar">
            <Link to="/login" className="btn btn-social">
              Log in
            </Link>
          </div>
        )}

        {auth.currentUser != null ? (
          <div id="whenSignedIn_NavBar">
            <div className="showChats">
              {unreadMessages > 0 && (
                <div className="unredMessagesBubble">
                  <h3>{unreadMessages}</h3>
                </div>
              )}

              <FontAwesomeIcon
                icon={faCommentDots}
                onClick={
                  isAllChatsVisible
                    ? () => setAllChatsVisible(false)
                    : () => setAllChatsVisible(true)
                }
                className="fontAwesomeIconBigger"
              />
              {isAllChatsVisible && (
                <div
                  onMouseLeave={() => setAllChatsVisible(false)}
                  className="allChatsContainer"
                >
                  <MessagesNotifications
                    classProp="allChats"
                    updateUnreadMessages={updateUnreadMessages}
                  />
                </div>
              )}
            </div>
            <div
              className="navPhoto"
              onClick={() => {
                navigate("/myAccount");
              }}
            >
              {user ? (
                <img
                  id="navPhoto"
                  src={user?.photoURL ?? user_default}
                  alt=""
                />
              ) : null}
            </div>
            {user ? (
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="fontAwesomeIcon"
                onClick={signOut}
              />
            ) : null}
          </div>
        ) : null}
      </nav>
    </div>
  );
};
export default NavigationBar;
