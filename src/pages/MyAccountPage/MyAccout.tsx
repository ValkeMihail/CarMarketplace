import { useState } from "react";
import { CurrentUserAds } from "../../components/CarLists/myAccountCarList";
import { UserFavourites } from "../../components/CarLists/UserFavourites";
import { VerifyAlert } from "../../containers/myAccountContainers/VerifyAlert";
import ProfileWrapHero from "../../containers/myAccountContainers/ProfileWrapHero";
import ProfileWrapEdit from "../../containers/myAccountContainers/ProfileWrapEdit";

export const MyAccount = () => {
  const [isSectionProfileAdsVisible, setIsSectionProfileAdsVisible] =
    useState(false);

  return (
    <div className="container">
      <div className="profile-screen">
        <VerifyAlert />
        <div className="accountContainer">
          <ProfileWrapHero />
          <ProfileWrapEdit />
        </div>
        <div className="profileTabs">
          <div
            onClick={() => {
              setIsSectionProfileAdsVisible(false);
            }}
            id="myAdsSection"
            className={
              isSectionProfileAdsVisible
                ? "myAdsSection"
                : "myAdsSection selectedTagMyAccount"
            }
          >
            <h3>My Ads</h3>
          </div>
          <div
            onClick={() => {
              setIsSectionProfileAdsVisible(true);
            }}
            id="FavouritesSection"
            className={
              isSectionProfileAdsVisible
                ? "FavouritesSection selectedTagMyAccount"
                : "FavouritesSection"
            }
          >
            <h3>Favourites</h3>
          </div>
        </div>
        {isSectionProfileAdsVisible ? (
          <div id="FavouriteAds">
            <UserFavourites />
          </div>
        ) : (
          <div id="profileAds">
            <CurrentUserAds />
          </div>
        )}
      </div>
    </div>
  );
};
