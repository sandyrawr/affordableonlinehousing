// import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import VerifyTeacher from './components/verify';
import Property from "./components/Property";
// import EditProperty from "./components/EditProperty";
import SideNav from "./components/SideNav";

function App() {
  return (
    <Router>
      <div className="App">
        <SideNav/>
        {/* <Student /> */}
        {/* <EditProperty/> */}
        {/* <Property/> */}
        {/* <Login/> */}
        <Routes>
          <Route path="/property" element={<Property />} /> 
        </Routes> 
      </div>
    </Router> 
  );
}

export default App;
