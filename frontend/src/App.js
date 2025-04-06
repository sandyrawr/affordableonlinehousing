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

function App() {
  return (
      <div className="App">
        <SearchPage/>
        {/* <Home/> */}
        {/* <SideNav/> */}
        {/* <Student /> */}
        {/* <EditProperty/> */}
        {/* <Property/> */}
        {/* <Login/> */}
        <div className='content-area'>
          <Routes>
            <Route path="/property" element={<Property />} /> 
            <Route path="/editproperty" element={<EditProperty />} /> 
            <Route path="/bookingrequests" element={<BookingRequests />} /> 
            <Route path="/tourrequests" element={<TourRequests />} /> 
            <Route path="/logout" element={<Property />} /> 
          </Routes>
        </div>  
      </div>
  );
}

export default App;
