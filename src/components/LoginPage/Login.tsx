import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faEyeLowVision } from '@fortawesome/free-solid-svg-icons';
import googlePng from '../../assets/google.svg';

import { AuthContext } from '../../AuthContext';
import { showToolTip } from '../Navigation/Footer';

import {  useNavigate } from 'react-router-dom';
import { useState ,useContext , useEffect} from 'react';

import { auth, sendPasswordResetEmail } from '../../firebase';


interface errorMessagesLoginForm {
    email: string;
    password: string;
}

interface errorMessagesRegisterForm {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneCode: string;
    phoneNumber: string;
}

/**
 * @description Component that contains the first container of the login page.
 * @returns `JSX.Element` that contains the first container of the login page.
 */ 
export const FirstContainer = () => {

    return (
        <div className="first-container">
            <h1>Hundreds of thousands of sellers and buyers trust us.</h1>
            <p>&#10003;The largest online car classifieds platform</p>
            <p>&#10003;Over 200,000 unique visitors per day</p>
            <p>&#10003;More than 30,000 active ads</p>
            <p>&#10003;Functionalities that will guide you to success</p>
        </div>
    );
}



/**
 * @description Component that contains the second container of the login page.
 * @returns `JSX.Element` that contains the second container of the login page.
 */
export const SocialMediaLogin = () => {

    const navigate = useNavigate();
    const { signInWithGoogle } = useContext(AuthContext);

    /**
     * @description Function that signs the user in with Google.
     */
    const handlesignInWithGoogle = async () => {
        try {
            await signInWithGoogle();
            navigate("/");
        } catch (error) {
            showToolTip("Error:" + error, "red");
        }
    }

    return (
        <>
            <h1>LOGIN</h1>
            <div className="social-media-login">
                <div className="whenSignedOut" id="whenSignedOut">
                    <button
                        id="signInBtn" 
                        className="btn btn-social btn-google"
                        onClick={handlesignInWithGoogle}
                    >
                            <img src={googlePng} />
                            Continue with Google
                    </button>
                </div>
            </div>
        </>
    );
}



interface LoginSectionProps {
    updateEmailValue : (count: string) => void
}
/**
 * @description Component that contains the login form.
 * @returns `JSX.Element` that contains the login form.
 */

export const LoginSection = ({updateEmailValue} : LoginSectionProps) => {

    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState({} as errorMessagesLoginForm);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const {signInWithEmailAndPasswordHandler} = useContext(AuthContext);
    const [credentials , setCredentials] = useState({email: '', password: '' , });

    useEffect(() => {
        updateEmailValue(credentials.email);
    }, [credentials.email]);

    
    /**
     *  @description Function that checks if the email and password are correct and if they are, it logs the user in using the email and password.
     * @param email The email of the user.
     * @param password The password of the user.
     */
    const signInEmailPassword = async (email: string, password: string): Promise<void> => {
        
        setErrorMessages({} as errorMessagesLoginForm);
        if (!email || email.indexOf('@') < 0 || email.indexOf('.') < 0 || email.length < 5 || email.length > 30 ) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                email: 'A correct email is required.'
            }));
            }
        if (password.trim().length == 0) {
        setErrorMessages((prevErrors) => ({
            ...prevErrors,
            password: 'A correct password is required. It must contain at least 6 characters, one uppercase letter, one lowercase letter and one number.'
        }));
        }
        if (Object.keys(errorMessages).length === 0) {
            try {
                await signInWithEmailAndPasswordHandler(email, password);
                showToolTip("You have successfully logged in!", "green");
                navigate("/");


            } catch (error : any) {
                setErrorMessages((prevErrors) => ({
                    ...prevErrors,
                    email: error.message as string,
                }));
                
            }
        }          
    }

    return (
        <div id="login" className="login">
        <div className="loginForm" id="loginForm">
            <h1>Login with email</h1>
            <div className="form-input">
                <label>Email:</label>
                <input  
                    onChange={(e) => {
                        setCredentials({...credentials, email: e.target.value});
                        setErrorMessages((prevErrors) => ({
                            ...prevErrors,
                            email: '' 
                        }))
                    }}
                    type="email" autoComplete='off' placeholder="Email" />
                 {errorMessages.email  &&(<div className="errorMessage" >{errorMessages.email}</div>)}
            </div>
            <div className="form-input">
                <label>Password:</label>
                
               
                    
                    <input
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        onChange={(e) => 
                            {setCredentials({...credentials, password: e.target.value})
                            setErrorMessages((prevErrors) => ({
                                ...prevErrors,
                                password: '' 
                            }));
                        }}
                    />
                    <span 
                        onClick={ ()=>{showPassword ?  setShowPassword(false) : setShowPassword(true)}}> 
                            <FontAwesomeIcon 
                                icon={showPassword ? faEyeLowVision : faEye}
                            />
                    </span>
                  
                {
                    errorMessages.password  &&(
                        <div className="errorMessage">
                            {errorMessages.password}
                        </div>
                    )
                }
            </div>
            <div className="buttonwrap">
                <button id="btnLogin" 
                    onClick={() => {signInEmailPassword(credentials.email, credentials.password)}}
                    className="btn btn-social">login</button>
            </div>
           
        </div>
    </div>
    );
}





/**
 * @description Component that contains the registration form.
 * @returns `JSX.Element` that contains the registration form.
 * 
 */
export const RegisterSection = () => {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [credentials , setCredentials] = useState({ password: '' , confirmPassword: ''});
    const [userData, setUserData] = useState({username: '', email: '', phoneCode: '', phoneNumber: ''});
    const {createUserWithEmailAndPasswordHandler ,setUserRegistered} = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState({} as errorMessagesRegisterForm);

    /**
     * Function that checks if the data entered by the user is correct and if it is, it creates a new user in the database.
     */
    const handleRegister = async () => {
        setErrorMessages({} as errorMessagesRegisterForm);
        if (!userData.username || userData.username.length < 3 || userData.username.length > 30) {
            
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                username: 'A correct username is required. It must contain at least 3 characters and maximum 30 characters.'
            }));
        }
        if (!userData.email || userData.email.indexOf('@') < 0 || userData.email.indexOf('.') < 0 || userData.email.length < 5 || userData.email.length > 30 ) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                email: 'A correct email is required.'
            }));
        }
        if (!credentials.password || credentials.password.length < 6 || credentials.password.length > 30 || !credentials.password.match(/[0-9]/g) || !credentials.password.match(/[a-z]/g) || !credentials.password.match(/[A-Z]/g)) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                password: 'A correct password is required. It must contain at least 6 characters, one uppercase letter, one lowercase letter and one number.'
            }));
        }
        if (!credentials.confirmPassword || credentials.confirmPassword !== credentials.password) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                confirmPassword: 'The passwords do not match.'
            }));
        }
        if (!userData.phoneCode || userData.phoneCode.length < 1 || userData.phoneCode.length > 4) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                phoneCode: 'A correct phone code is required.'
            }));
        }
        if (!userData.phoneNumber || userData.phoneNumber.length < 6 || userData.phoneNumber.length > 15) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                phoneNumber: 'A correct phone number is required.'
            }));
        }
        
        if (Object.keys(errorMessages).length === 0) {
            showToolTip("You have errors", "red");
            try {
                await createUserWithEmailAndPasswordHandler(userData.email, credentials.password);
                setUserRegistered({
                    id: "",
                    username: userData.username || null,
                    email: userData.email || null,
                    phoneCountryCode: userData.phoneCode || null,
                    phoneNr: userData.phoneNumber || null,
                    favouriteAds: [],
                    createdAt: null,
                    adsArray: [] ,
                    photoURL: null
                });
                navigate("/");
                
            } catch (error : any) {
                setErrorMessages((prevErrors) => ({
                    ...prevErrors,
                    email: error.message as string,
                }));
                
            };
        };
    };
    

    return (
            <div id="signup" >
                <div id="registerForm" className="registerForm">
                    <h1>Create an accout</h1>
                    <div className="form-input">
                        <label>Username:</label>
                        <input
                            onChange={(e) => 
                                {setUserData({...userData, username: e.target.value})
                                    setErrorMessages((prevErrors) => ({
                                        ...prevErrors,
                                        username: '' 
                                    }));
                                }}
                            id="username" type="text" placeholder="Username" />
                        {errorMessages.username &&(    
                            <div className="errorMessage">
                                {errorMessages.username}
                            </div>
                        )}
                    </div>
                    <div className="form-input">
                        <label>Email:</label>
                        <input 
                            onChange={(e) => {
                                setUserData({...userData, email: e.target.value})
                                setErrorMessages((prevErrors) => ({
                                    ...prevErrors,
                                    email: ''
                                }));
                            }}
                                
                            id="email" type="email" placeholder="Email" />
                        
                        {   errorMessages.email &&(
                            <div className="errorMessage">
                                {errorMessages.email}
                            </div>
                        )}
                    </div>
                    <div id="phoneCode"  className="form-input">
                        <label>Country code:</label>
                    <div >
                    <select 
                        onChange={(e) => 
                            {setUserData({...userData, phoneCode: e.target.value})
                                setErrorMessages((prevErrors) => ({
                                    ...prevErrors,
                                    phoneCode: ''
                                }));
                            }}
                        className='phoneCodeSelect'
                        name="phoneCodeSelect" 
                        id="phoneCodeSelect" 
                        defaultValue="">
                        <option value="" > Select Country Code</option>
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
                    {   errorMessages.phoneCode &&(
                            <div className='errorMessage'>
                                {errorMessages.phoneCode}
                            </div>
                        )
                    }
                    </div>
                </div>
                <div className="form-input">
                    <label>Phone Nr:</label>
                    <input 
                        
                        onChange={(e) => 
                            {setUserData({...userData, phoneNumber: e.target.value})
                            setErrorMessages((prevErrors) => ({
                                ...prevErrors,
                                phoneNumber: ''
                            }));
                        }}
                        id="phoneNr" type="text" placeholder="Phone Number" />
                    { errorMessages.phoneNumber &&(
                        <div className="errorMessage">
                            {errorMessages.phoneNumber}
                        </div>
                    )}
                </div>
                <div className="form-input">
                        <label>Password:</label>
                        <input 
                            
                            onChange={(e) => 
                                    {setCredentials({...credentials, password: e.target.value})
                                        setErrorMessages((prevErrors) => ({
                                            ...prevErrors,
                                            password: ''
                                        }));
                                    }}
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" />
                        <span 
                            onClick={()=>{
                                showPassword 
                                    ? setShowPassword(false) 
                                    : setShowPassword(true)}}> 
                                <FontAwesomeIcon 
                                    icon={showPassword ? faEye : faEyeLowVision}
                                />
                        </span>
                    
                        {  errorMessages.password &&(
                            <div className="errorMessage">
                                {errorMessages.password}
                            </div>
                            )
                        }
                    </div>

                    <div className="form-input">
                        <label>Confirm Password:</label>
                        <input 
                            onChange={(e) =>
                                {setCredentials({...credentials, confirmPassword: e.target.value})

                                    setErrorMessages((prevErrors) => ({
                                        ...prevErrors,
                                        confirmPassword: ''
                                    }));
                                }}

                            id="passwordc" 
                            type={showPassword ? "text" : "password"}
                            placeholder="Password" />
                        <span 
                            onClick={()=>{
                                showPassword 
                                    ? setShowPassword(false) 
                                    : setShowPassword(true)}}> 
                                <FontAwesomeIcon 
                                    icon={showPassword ? faEye : faEyeLowVision}
                                />
                        </span>
                        {  errorMessages.confirmPassword &&(
                            <div className="errorMessage">
                                {errorMessages.confirmPassword}
                            </div>
                            )
                        }
                    </div>
                    
                
                <div className="buttonwrap">
                    <button 
                        onClick={handleRegister}
                        className="btn btn-social">SignUp</button>
                </div>
                
            </div>
        </div>

    );
}
    






/**
 * @description Login component that renders the login page of the application
 * @returns  Login component JSX
 */
export const Login = () => {

    const [isLogin, setIsLogin] = useState(true);
    const [emailValue , setEmailValue] = useState('');


    const resetPassword = () => {
       const email = emailValue;
        if(email){
            sendPasswordResetEmail(auth, email)
            .then(() => {
                showToolTip("Password reset email sent!", "green")
            })
            .catch((error : any) => {
                showToolTip(error.message as string, "red")
            });
        }else{
            showToolTip("Please enter your email in the field!", "red")
        }
    }


    return (
        <div className="container">
            <div className="authentication-screen">
                <FirstContainer />
                <div className="second-container">
                <SocialMediaLogin />
                <div className="or">
                    <hr />
                    <h3>OR</h3>
                    <hr />
                </div>
                {isLogin ? (
                    <>
                    <LoginSection updateEmailValue={setEmailValue} />
                    <a onClick={() => setIsLogin(false)} id="nohaveaccount">
                        No Account? Register
                    </a>
                    <br />
                    <a
                        onClick={() => resetPassword()}
                        id="resetPassword">
                        I forgot my password. Send me a password reset email
                    </a>
                    </>
                ) : (
                    <>
                    <RegisterSection />
                    <a onClick={() => setIsLogin(true)} id="haveaccount">
                        I already have an account
                    </a>
                    </>
                )}
                
                </div>
            </div>
        </div>
    );
};
