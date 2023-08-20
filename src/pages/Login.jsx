import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Navigate, useNavigate } from "react-router";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {

    const [error, setError] = useState('')
    const navigate = useNavigate();
    const handleLogin = async(e) => {
        e.preventDefault();
        const email = e.target[0].value
        const password = e.target[1].value

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/')
        } catch (error) {
            console.log(error)
            setError('Something went wrong')
        }

    }

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">TiTiTarTar Chat</span>
                <span className="title">Login</span>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>

                    <button type="submit" className="btn-primary">Sign in</button>
                </form>
                { error && <span>{error}</span>}
                <span>You don't have a account? <Link to={'/register'}>Register</Link></span>
            </div>
        </div>
    )
}

    export default Login