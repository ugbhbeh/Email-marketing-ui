import {  Link } from "react-router-dom"
import { useContext } from 'react';
import AuthContext from "../services/AuthContext";


export default function Home(){
      const { logout, isLoggedIn,  } = useContext(AuthContext);
    
    return( 
    <>
    <p>hello world, top bar edition</p>
        {isLoggedIn ? (
            
        <button onClick={logout} > Logout </button>
          ) : (
            <Link to="/login"> Login </Link>
              
        )}</>
    )
}