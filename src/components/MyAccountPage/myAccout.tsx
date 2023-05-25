import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import user_default from '../../assets/user_default.svg';

import React, { useState,useRef,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';

import { auth, collection, db, deleteDoc, doc, EmailAuthProvider, getDocs, GoogleAuthProvider , query, reauthenticateWithCredential, 
    sendPasswordResetEmail, updateEmail, where,reauthenticateWithPopup} from '../../firebase';

import { MyCarList } from './myAccountCarList';
import {UserFavourites} from './UserFavourites';
import {showToolTip} from '../Navigation/Footer';


export const MyAccount = () => {

    const [isUserEditingUsername, setIsUserEditingUsername] = useState(false);
    const [isUserEditingEmail, setIsUserEditingEmail] = useState(false);
    const [isUserEditingPhone, setIsUserEditingPhone] = useState(false);
    const [isSectionProfileAdsVisible, setIsSectionProfileAdsVisible] = useState(false);
    const { user, uploadPhotoFile, signOut ,sendVerificationEmail , updateUserDoc ,isUserVerified, isProviderGoogle} = useContext(AuthContext);

    const navigate = useNavigate();

    const photoEditRef = useRef<HTMLInputElement>(null);

    const phoneCountryCodeRef = useRef<HTMLSelectElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);



    /**
     * Sends a password reset email to the user's email address.
     */
    const sendVerificationEmailandAlertUser = async() => {
        if (user) {
            try {
                await sendVerificationEmail();
                showToolTip("Verification email sent" , "green");
            } catch (error) {
                showToolTip(error as string , "red");
            }
        }
    }
    


    /**
     * This triggers the click event of the photoEditRef input element.
     */
    const photoEditRefClick = () => {
        photoEditRef.current?.click();
    };




    /**
     *  This function handles the change event of the photoEditRef input element.
     * @param e  The change event of the photoEditRef input element.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          uploadPhotoFile(file);
        }
    };


    /**
     * This function handles the update of the user's username.
     */
    const handleApproveUsername = () => {
    if (usernameRef.current?.value && usernameRef.current?.value.trim() !== "" && usernameRef.current?.value !== user?.username) {
            updateUserDoc({
                username: usernameRef.current?.value,
            });
        }
        setIsUserEditingUsername(false);
    };



    /**
     *  This function handles the update of the user's email.
     * @returns 
     */
    const handleApproveEmail = async() => {
       
        if (user && emailRef.current?.value && emailRef.current?.value.trim() !== "" && emailRef.current?.value !== user?.email) {
            try {
                if(isProviderGoogle() == true){
                // Reauthenticate the user with Google before updating their email
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(auth.currentUser!, provider);
            }else{
                const passwordPrompt = prompt("Please enter your password to confirm the change");
                if (passwordPrompt === null) {
                    return;
                }
                const providerCredential =  EmailAuthProvider.credential(user?.email!, passwordPrompt);
                await reauthenticateWithCredential(auth.currentUser!, providerCredential);
            }
                // Update the user's email address in your database
                await updateUserDoc({ email: emailRef.current?.value });
                await updateEmail (auth.currentUser!, emailRef.current?.value);
    
            } catch (error) {
                showToolTip(error as string , "red");
            }
        }
        setIsUserEditingEmail(false);
    };


    /**
     * Deletes the user's account and all associated data.
     */
    const handleDeleteAccount = async() => {
        if (user) {
            try {

                if(isProviderGoogle() == true){

                    // Reauthenticate the user with Google before updating their email
                        const provider = new GoogleAuthProvider();
                        await reauthenticateWithPopup(auth.currentUser!, provider);
                        // Delete the user's data from the database
                        
                            showToolTip(" Note: you will not be able to acces your messages again" , "red");
                            
                            const userDocRef = doc(db, "users", auth.currentUser?.uid!);
                            await deleteDoc(userDocRef);
                            showToolTip("User data deleted", "green");
                            
                            const adsCollectionRef = collection(db, "cars");
                            const queryUserAds = query(adsCollectionRef, where("userID", "==", auth.currentUser?.uid!));
                            const userAds = await getDocs(queryUserAds);
                            
                            const deletePromises = userAds.docs.map(async (doc) => {
                              await deleteDoc(doc.ref);
                            });
                            
                            await Promise.all(deletePromises);
                            showToolTip("User ads deleted", "green");
                            
                            await auth.currentUser?.delete();
                            navigate("/login");
                            showToolTip("Account deleted", "green");

                }else{
                        
                    const passwordPrompt = prompt("Please enter your password to confirm the change");
                    if (passwordPrompt === null) {
                      return;
                    }
                    
                    const providerCredential = EmailAuthProvider.credential(user?.email!, passwordPrompt);
                    await reauthenticateWithCredential(auth.currentUser!, providerCredential);
                    
                    showToolTip("Note: you will not be able to access your messages again", "red");
                    
                    const userDocRef = doc(db, "users", auth.currentUser?.uid!);
                    await deleteDoc(userDocRef);
                    showToolTip("User data deleted", "green");
                    
                    const adsCollectionRef = collection(db, "cars");
                    const queryUserAds = query(adsCollectionRef, where("userID", "==", auth.currentUser?.uid!));
                    const userAds = await getDocs(queryUserAds);
                    
                    const deletePromises = userAds.docs.map(async (doc) => {
                      await deleteDoc(doc.ref);
                    });
                    
                    await Promise.all(deletePromises);
                    showToolTip("User ads deleted", "green");
                    
                    await auth.currentUser?.delete();
                    navigate("/login");
                    showToolTip("Account deleted", "green");
                }
            } catch (error) {
                showToolTip(error as string , "red");
            }
        }
    }



    /**
     * This function handles the update of the user's phone number.
     */
    const handleApprovePhone = () => {
        if (phoneRef.current?.value && phoneRef.current?.value.trim() !== "" && phoneRef.current?.value !== user?.phoneNr) {
            updateUserDoc({
                phoneNr: phoneRef.current?.value,
                phoneCountryCode: phoneCountryCodeRef.current?.value,
            });
        }
        setIsUserEditingPhone(false);
    };


    /**
     * This function handles the logout of the user.
     */
    const handleLogout = () => {
        signOut();
        navigate("/login");
    }


    /**
     * This function handles the reset of the user's password.
     */
    const handleResetPassword = async () => {
        if (auth.currentUser && user && user.email) {
            try {
                await sendPasswordResetEmail(auth, user.email);
               showToolTip("Password reset email sent" , "green");
            } catch (error) {

                showToolTip(error as string , "red");
            }
        }
    };



    return (
        <div className="container">
            <div className="profile-screen">
                { !isUserVerified() && 
                    ( 
                    <div id="VerifyAlert" className="alert"> Please verify your account.     
                        <a onClick={sendVerificationEmailandAlertUser} id="sendVerification">Send Verification Code</a>
                    </div>
                    )
                }
                
                <div className="accountContainer">
                    <div className="profile-wrap">
                        <div className="img-container">
                            <img id ="photoHolder" src={user?.photoURL ?? user_default} alt="Profile picture"/>
                            <div id="photoEditWrap" className="editButtonWrapper"> 
                                <input 
                                    onChange={(e) => {handleChange(e)}}
                                    ref={photoEditRef}  
                                    id="photoEdit" 
                                    type="file" 
                                    accept="image/x-png,image/jpeg" 
                                />
                               <FontAwesomeIcon onClick={photoEditRefClick} icon={faEdit}/>
                            </div>                   
                        </div>
                        <h3 
                            id="displayNameHolder">
                            {user?.username ?? "No username available"}
                        </h3>
                        <div className="buttonwrap">
                            <button 
                                onClick={handleLogout}
                                className="btn btn-social" 
                                id="logOut">
                                    Logout
                            </button>
                        </div>
                        <div className="badgesWrap">
                            <div className="badge">
                                <p 
                                    id="badge">
                                    {user?.createdAt?.toDate().toLocaleDateString() ?? "No date available"}
                                </p>
                            </div>   
                        </div>
                    </div>

                    <div className="profile-wrap">
                            
                        <h3>Profile info</h3>
                        <div className="form-input">
                            <label>Username:</label>

                            {isUserEditingUsername ? 
                                (
                                    <>
                                    <input 
                                        type="text"
                                        ref={usernameRef}
                                        readOnly={false}
                                        placeholder={user?.username ?? "No username available"}
                                    />
                                    <div 
                                        onClick={handleApproveUsername}     
                                        className="editButtonWrapper">
                                            <FontAwesomeIcon icon={faCheck}/>
                                    </div>
                                    </>
                                ):(
                                    <>
                                    <div className='fakeInput'>
                                        {user?.username ?? "No username available"}
                                    </div>
                                    <div 
                                    onClick={()=>{setIsUserEditingUsername(true)}}                                   
                                        className="editButtonWrapper">
                                            <FontAwesomeIcon icon={faEdit}/>
                                    </div>
                                    </>
                                )
                            }
                            
                        </div>
                        <div className="form-input">
                            <label>Email:</label>
                            {isUserEditingEmail ? 
                                (
                                    <>
                                    <input 
                                        type="text"
                                        ref={emailRef}
                                        readOnly={false}
                                        placeholder={user?.email ?? "No username available"}
                                    />
                                    <div 
                                        onClick={handleApproveEmail}     
                                        className="editButtonWrapper">
                                            <FontAwesomeIcon icon={faCheck}/>
                                    </div>
                                    </>
                                ):(
                                    <>
                                    <div className='fakeInput'>
                                        {user?.email ?? "No email available"}
                                    </div>
                                    <div 
                                    onClick={()=>{setIsUserEditingEmail(true)}}                                   
                                        className="editButtonWrapper">
                                            <FontAwesomeIcon icon={faEdit}/>
                                    </div>
                                    </>
                                )
                            }
                        </div>
                        { isUserEditingPhone ? 
                            (

                                <>
                                <div 
                                    id="phoneCode"  
                                    className="form-input">
                                        <label>Country code:</label>
                                        <div >
                                            <select
                                                ref={ phoneCountryCodeRef } 
                                                className='phoneCodeSelect'
                                                defaultValue={user?.phoneCountryCode ?? "null"}
                                                name="phoneCodeSelect">
                                                    <option value="null"></option>
                                                    <option value="+380">Ukraine +380</option>
                                                    <option value="+33">France +33</option>
                                                    <option value="+49">Germany +49</option>
                                                    <option value="+385">Croatia +385</option>
                                                    <option value="+48">Poland +48</option>
                                                    <option value="+31">Netherlands +31</option>
                                                    <option value="+41">Switzerland +41</option>
                                                    <option value="+32">Belgium +32</option>
                                                    <option value="+44">UK +44</option>
                                                    <option value="+39">Italy +39</option>
                                                    <option value="+381">Serbia +381</option>
                                                    <option value="+30">Greece +30</option>
                                                    <option value="+45">Denmark +45</option>
                                                    <option value="+46">Sweden +46</option>
                                                    <option value="+47">Norway +47</option>
                                                    <option value="+383">Kosovo +383</option>
                                                    <option value="+354">Iceland +354</option>
                                                    <option value="+356">Malta +356</option>
                                                    <option value="+420">Czechia +420</option>
                                                    <option value="+358">Finland +358</option>
                                                    <option value="+43">Austria +43</option>
                                                    <option value="+40">Romania +40</option>
                                                    <option value="+355">Albania +355</option>
                                                    <option value="+375">Belarus +375</option>
                                                    <option value="+36">Hungary +36</option>
                                                    <option value="+377">Monaco +377</option>
                                                    <option value="+379">Vatican City +379</option>
                                                    <option value="+352">Luxembourg +352</option>
                                                    <option value="+359">Bulgaria +359</option>
                                                    <option value="+373">Moldova +373</option>
                                                    <option value="+382">Montenegro +382</option>
                                                    <option value="+387">Bosnia +387</option>
                                                    <option value="+370">Lithuania +370</option>
                                                    <option value="+372">Estonia +372</option>
                                                    <option value="+353">Republic of Ireland +353</option>
                                                    <option value="+386">Slovenia +386</option>
                                                    <option value="+371">Latvia +371</option>
                                                    <option value="+421">Slovakia +421</option>
                                                    <option value="+376">Andorra +376</option>
                                                    <option value="+389">North Macedonia +389</option>
                                                    <option value="+423">Liechtenstein +423</option>
                                                    <option value="+350">Gibraltar +350</option>
                                                    <option value="+298">Faroe Islands +298</option>
                                                    <option value="+378">San Marino +378</option> 
                                            </select>
                                        </div>
                                </div>
                                <div className="form-input">
                                    <label>Phone Number:</label>
                                <input
                                        placeholder={user?.phoneNr ?? "No phone number available"}
                                        ref={phoneRef}  
                                        onChange={(event) => {
                                            const inputValue = event.target.value;
                                            const nonNumericRegex = /[^0-9]+/g;
                                            const sanitizedValue = inputValue.replace(nonNumericRegex, '');
                                            event.target.value = sanitizedValue;
                                          }}
                                        type="text"
                                        readOnly={false} 
                                    />
                                <div 
                                    onClick={handleApprovePhone}     
                                    className="editButtonWrapper">
                                        <FontAwesomeIcon icon={faCheck}/>
                                </div>
                            </div>
                                </>

                            ):(
                                <div className="form-input">
                                    <label>Phone Nr:</label>
                                    <div className='fakeInput'>
                                            {user?.phoneNr ?? "No phone number available"}
                                    </div>
                                        <div 
                                            onClick={()=>{setIsUserEditingPhone(true)}}                                     
                                            className="editButtonWrapper">
                                                <FontAwesomeIcon icon={faEdit}/>
                                        </div>                                                                   
                                </div>

                            )

                        }
                             
                        {user?.phoneNr ?  (null):(
                             <div className="infoTagProfile">
                                Please enter a valid phone number
                            </div>
                        )             
                        }
                        <div className="infoButtons">
                            <button 
                                onClick={handleResetPassword}
                                id="resetPasswordButton" 
                                className="btn btn-social">
                                    Reset Password
                            </button>
                            <button  
                                onClick={handleDeleteAccount}
                                id="deleteAccount" 
                                className="btn btn-social">
                                    Delete my Account
                            </button>
                        </div>
                        
                        <div id="PasswordCredential">
                            <div className="form-input">
                                <label>Please insert your password to confirm the deletion of your account:</label>
                                <input  id="PasswordCredentialInput" type="password" />
                                <span    className="fa fa-fw fa-eye field-icon toggle-password"></span>
                            
                            </div> 
                            <button id="PasswordCredentialAccept" className="btn btn-social">Delete my Account</button>
                        </div>
                    </div>
                    
                </div>
                <div className="profileTabs">
                            <div 
                                onClick={()=> { setIsSectionProfileAdsVisible(false)}}
                                id="myAdsSection" 
                                className={isSectionProfileAdsVisible ? "myAdsSection" :"myAdsSection selectedTagMyAccount" }>
                                    <h3>My Ads</h3>
                            </div>
                            <div  
                                onClick={()=> { setIsSectionProfileAdsVisible(true)}}
                                id="FavouritesSection" 
                                className={isSectionProfileAdsVisible ? "FavouritesSection selectedTagMyAccount" :"FavouritesSection" }>
                                    <h3>Favourites</h3>
                            </div>
                    </div> 
                    {
                        isSectionProfileAdsVisible ? (
                            <div
                            id="FavouriteAds">
                                <UserFavourites/>
                            </div>
                        ):(
                            <div    
                            id="profileAds">
                                <MyCarList/>
                            </div>
                            
                        )
                                

                    }   
                    
                   
            </div>
        </div>
        

    );
}