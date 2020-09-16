import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../../App';
import M from 'materialize-css';

const SignIn =  () => {
const {state, dispatch} = useContext(UserContext);
const history = useHistory();
const [password, setPassword] = useState("");
const [email, setEmail] = useState("");

const PostData = () =>{

    if(!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email))
    {
          M.toast({html: "Invalid Email", classes:"#c62828 red darken-3"});
          return 
    }

    fetch("/signin", {
        method: "post",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            password,
            email
        })
    }).then(res=>res.json())
     .then(data=>{
         if(data.error){
             M.toast({html: data.error, classes:"#c62828 red darken-3"})
         }else{
             localStorage.setItem("jwt", data.token)
             localStorage.setItem("user", JSON.stringify(data.user))
             dispatch({type:"USER",payload:data.user})  
             M.toast({html: "Login success", classes:"#43a047 green darken-1"})
             history.push('/');
         }
     })
     .catch(err=>{
         console.log(err);
     })
} 

    return (
        <div className="mycard ">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="text" 
                    placeholder="email" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input type="password" 
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
            
                <button className="btn waves-effect waves-light blue darken-1"
                 onClick = {()=> PostData()}
                >Login</button>
                <p>
                    <Link to = "/signup" className='signbottom'>Don't have an account?</Link>
                </p>
            </div>
        </div>
    )
}

export default SignIn;