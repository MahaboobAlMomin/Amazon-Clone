import {React,useContext } from 'react'
import Avatar from '@mui/material/Avatar';
import { LoginContext } from "../context/ContextProvider";
import { NavLink } from 'react-router-dom';
import { Divider } from '@mui/material';
import "./rightheader.css";
import LogoutIcon from '@mui/icons-material/Logout';



const Rightheader = ({ logclose,Logoutuser }) =>
{
     const { account, setAccount } = useContext(LoginContext);
    return (
      
      <>
          <div className='rightheader'>
              <div className='right_nav'>
                   {
            account ? <Avatar className="avatar2" >{ account.fname[0].toUpperCase() }</Avatar>:<Avatar className="avatar" ></Avatar>
                    }
                    {
                        account ? <h3>Hello,{ account.fname.toUpperCase() }</h3>:""
                 }   
          
                </div >
                <div className='nav_btn' onClick={()=>logclose()}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/">Shop By category</NavLink>
                    <Divider style={{width:"100%" , marginLeft:"-20px"}} />
                    <NavLink to="/">Todays Deal</NavLink>
                    {
                        account ? <NavLink to="/buynow">Your orders</NavLink> :<NavLink to="/login">Your orders</NavLink>
                    }
                    <Divider style={{width:"100%" , marginLeft:"-20px"}} />
                    <div className='flag'></div>
                    <NavLink to="/">Settings</NavLink>
                    <img src='./india.png' style={{width:35,marginLeft:70,marginTop:-45}} alt=''/>

                </div>
                {
                    account ? 
                        <div className='flag'>
                            <LogoutIcon style={ { fontSize: 25,marginLeft:10,marginTop:5} } />
                            <h3 onClick={ () => Logoutuser() } style={{cursor:"pointer",fontWeight:500,marginLeft:40,marginTop:-30}}>Logout</h3>
                        </div> :
                        <NavLink to="login" style={{marginLeft:40}}>SignIn</NavLink>
                }

              
          </div>
      </>
  )
}

export default Rightheader