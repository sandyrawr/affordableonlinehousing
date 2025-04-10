import './App.css';
import { Routes, Route } from 'react-router-dom';
// import VerifyTeacher from './components/verify';
import Property from "./components/Property";
// import EditProperty from "./components/EditProperty";
import SideNav from "./components/SideNav";
import EditProperty from './components/EditProperty';
import BookingRequests from './components/BookingRequests';
import TourRequests from './components/TourRequests';
import Home from './components/Home';
import SearchPage from './components/SearchPage';
// import TenantSignUp from './components/TenantSignUp';
// import TenantLogin from './components/TenantLogin';
// import LocationForm from './components/LocationForm';
import StartPage from './components/StartPage';
import StartRegister from './components/StartRegister';
import RegisterOwner from './components/RegisterOwner';
import RegisterTenant from './components/RegisterTenant';
import LoginPage from './components/LoginPage';
// import Login from './components/Login';
function App() {
  return (
      <div className="App">
        {/* <RegisterOwner/> */}
        {/* <RegisterTenant/> */}
        {/* <StartPage/> */}
        {/* <Home/> */}
        {/* <LocationForm/> */}
        {/* <TenantSignUp/> */}
        {/* <TenantLogin/> */}
        {/* <SearchPage/> */}
        {/* <Home/> */}
        {/* <SideNav/> */}
        {/* <EditProperty/> */}
        {/* <Property/> */}
        {/* <LoginPage/> */}
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/property" element={<Property />} /> 
            <Route path="/editproperty" element={<EditProperty />} /> 
            <Route path="/bookingrequests" element={<BookingRequests />} /> 
            <Route path="/tourrequests" element={<TourRequests />} /> 
            <Route path="/logout" element={<Property />} /> 
            <Route path="/search" element={<SearchPage />} />
            {/* <Route path="/tenant-login" element={<TenantLogin />} /> */}
            {/* <Route path="/tenantsignup" element={<TenantSignUp />} /> */}
            <Route path="/home" element={<Home />} />
            <Route path="/sidenav" element={<SideNav />} />
            <Route path="/startregister" element={<StartRegister />} />
            <Route path="/registerowner" element={<RegisterOwner/>} />
            <Route path="/registertenant" element={<RegisterTenant/>} />
            <Route path="/login" element={<LoginPage/>} />
          </Routes>
      </div>
  );
}

export default App;
