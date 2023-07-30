import { Footer } from './components/Navigation/Footer.tsx';
import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/auth/AuthContext.tsx';
import  NavigationBar  from './components/Navigation/NavigationBar.tsx';
import { LoadingOverlay } from './components/Navigation/LoadingOverlay.tsx';


const Home = lazy(() => import('./pages/HomePage/Index.tsx').then(module => ({ default: module.Home })));
const Login = lazy(() => import('./pages/LoginPage/Login.tsx').then(module => ({ default: module.Login })));
const Buy = lazy(() => import('./pages/BuyPage/Buy.tsx').then(module => ({ default: module.Buy })));
const SellOrEditPage = lazy(() => import('./pages/SellPage/Sell.tsx').then(module => ({ default: module.SellOrEditPage })));
const MyAccount = lazy(() => import('./pages/MyAccountPage/MyAccout.tsx').then(module => ({ default: module.MyAccount })));
const Edit = lazy(() => import('./pages/EditAdPage/Edit.tsx').then(module => ({ default: module.Edit })));
const CarAd = lazy(() => import('./pages/CarAdPage/CarAd.tsx').then(module => ({ default: module.CarAd })));
const User = lazy(() => import('./pages/UserProfilePage/User.tsx').then(module => ({ default: module.User })));
const Chat = lazy(() => import('./pages/ChatPage/Chat.tsx').then(module => ({ default: module.Chat })));


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
