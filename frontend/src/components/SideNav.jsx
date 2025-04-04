import React from 'react'
import "../App.css";
import { SideNavData } from './SideNavData';
import { Link } from 'react-router-dom';

function SideNav() {
  return ( 
  <div className="SideNav">
    <ul className="SidebarList">
        {SideNavData?.map((val, key )=>{
          return(
            <li 
                key={key}
                className="row"
                id= {window.location.pathname == val.link ? "active": ""}
                onClick={() =>{
                window.location.pathname = val.link;
              }}                
            >
                <div id='icon'>{val.icon}</div>
                <div id='title'>{val.title}</div>
            </li>
          );
        })} 
    </ul>
  </div>
    
  );
}

export default SideNav;
