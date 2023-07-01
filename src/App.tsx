
import { Footer } from './components/Navigation/Footer.tsx'
import './App.css'
import NavigationBar from './components/Navigation/NavigationBar.tsx'
import { Home } from './components/HomePage/Index.tsx'
import { Login } from './components/LoginPage/Login'
import { Buy } from './components/BuyPage/buy'
import { SellOrEditPage } from './components/SellPage/Sell'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext.tsx'
import { MyAccount } from './components/MyAccountPage/myAccout.tsx'
import { Edit } from './components/EditAdPage/Edit.tsx'
import { CarAd } from './components/CarAdPage/CarAd'
import { User } from './components/UserProfilePage/User.tsx'
import { Chat } from './components/ChatPage/Chat.tsx'

function App() {
   

  return (
    <>
     <AuthProvider>
        <Router>
           <NavigationBar/>
           <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sell" 
                  element={
                    <SellOrEditPage 
                        isSellPage={true} 
                        carDefault={null} 
                        id={null}
                    />
                  }
                /> 
                <Route path="/buy" element={<Buy />} />
                <Route path="/login" element={<Login />} />
                <Route path="/myAccount" element={<MyAccount />} />
                <Route path="/edit/:id" element={<Edit/>} />
                <Route path="/ad/:carID" element={<CarAd/>} />
                <Route path="/user/:userID" element={<User/>} />
                <Route path='/chats/chat/:chatID' element={<Chat/>}/>
            </Routes>
        </Router>
        <Footer/>
    </AuthProvider>
    </>
  )
}

export default App
