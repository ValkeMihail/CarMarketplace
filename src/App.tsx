import { Footer } from './components/Navigation/Footer.tsx';
import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext.tsx';
import  NavigationBar  from './components/Navigation/NavigationBar.tsx';
import { LoadingOverlay } from './components/Navigation/LoadingOverlay.tsx';


const Home = lazy(() => import('./components/HomePage/Index.tsx').then(module => ({ default: module.Home })));
const Login = lazy(() => import('./components/LoginPage/Login').then(module => ({ default: module.Login })));
const Buy = lazy(() => import('./components/BuyPage/buy').then(module => ({ default: module.Buy })));
const SellOrEditPage = lazy(() => import('./components/SellPage/Sell').then(module => ({ default: module.SellOrEditPage })));
const MyAccount = lazy(() => import('./components/MyAccountPage/myAccout.tsx').then(module => ({ default: module.MyAccount })));
const Edit = lazy(() => import('./components/EditAdPage/Edit.tsx').then(module => ({ default: module.Edit })));
const CarAd = lazy(() => import('./components/CarAdPage/CarAd').then(module => ({ default: module.CarAd })));
const User = lazy(() => import('./components/UserProfilePage/User.tsx').then(module => ({ default: module.User })));
const Chat = lazy(() => import('./components/ChatPage/Chat.tsx').then(module => ({ default: module.Chat })));


function App() {
  return (
    <>
      <AuthProvider>
        <Suspense fallback={<LoadingOverlay className='fixedLoading' />}>
          <Router>
            <NavigationBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/sell"
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
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/ad/:carID" element={<CarAd />} />
              <Route path="/user/:userID" element={<User />} />
              <Route path="/chats/chat/:chatID" element={<Chat />} />
            </Routes>
            <Footer />
          </Router>
          
        </Suspense>
      </AuthProvider>
    </>
  );
}

export default App;
