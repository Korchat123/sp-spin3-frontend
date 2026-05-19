import { useContext, useEffect, useState } from "react"
import { usersInfo } from "../assets/usersInfo"
import { UserContext } from "../context/userContext/UserContext";
import { useNavigate,Link } from 'react-router-dom';

export default function Login(){
const navigate= useNavigate();
const {myUserInfo,setMyUserInfo}=useContext(UserContext)

   
const [loginText,setLoginText]=useState("Hello");
const [inputUsername,setInputUsername]=useState("");
const [inputPassword,setInputPassword]=useState("");
const inputUsernameHandle=(event)=>{setInputUsername(event.target.value);}
const inputPasswordHandle=(event)=>{setInputPassword(event.target.value);}


const checkLogin=()=>{

    const user=usersInfo.find((user)=>(user.username===inputUsername))
    if(user){
        if(user.password===inputPassword){
            setMyUserInfo(user); 
            setLoginText("LoginSuccessful");
            if(user.role==="customer")
             navigate('/menu');
            else if(user.role==="cook"){
             navigate('/cookBoard');
            }
        }
        else{setLoginText("worngPassword");}
        console.log(user);
    }else{
        setLoginText("unkownUsername");
        console.log(loginText);
        
    }

}
    const logoutBtn=()=>{
          setMyUserInfo(""); 
    }


return(
<div className="flex flex-col min-w-full  bg-secondary"> 
    
  {!myUserInfo?
    <form onSubmit={checkLogin} className="flex flex-col justify-evenly items-center content-evenly  min-h-[80vh] m-[10vh] bg-neutral">
    <h1  className="text-2xl font-bold mb-4">Login</h1>
    
    <span className="font-bold">Username :  
        <input className="  border" value={inputUsername} onChange={inputUsernameHandle} type="text"></input></span>
    <span className="font-bold">password :  
        <input className=" border" value={inputPassword} onChange={inputPasswordHandle} type="password"></input></span>
    
    
    <button type="submit" 
            className="w-[20vh] bg-secondary 
                                    hover:bg-accent text-neutral px-6 py-2 rounded-lg 
                                    font-semibold transition duration-300 cursor-pointer">
                                        Submit</button>

    <span className="text-secondary font-bold">{loginText}</span>
    <span className="hover:text-secondary text-blue-500 font-bold"><Link to="/register">don't have account? click here to register</Link></span>
                                   
    </form >
    :<form onSubmit={logoutBtn} className="flex flex-col justify-evenly items-center content-evenly  min-h-[80vh] m-[10vh] bg-neutral">
        <h1  className="text-2xl font-bold mb-4">You're Login</h1>
            <span className="flex flex-row  font-bold">name : <h2 className="text-secondary text-xl">{myUserInfo.name}</h2></span>
            <span className="flex flex-row font-bold">email:<h2 className="text-secondary text-xl">{myUserInfo.email}</h2></span>
            <button type="submit" 
            className="w-[20vh] bg-secondary hover:bg-accent text-neutral px-6 py-2 rounded-lg font-semibold transition duration-300 cursor-pointer">
                                        Logout</button>
    </form>}
    
    
    
    

</div>
)

}