import { onAuthStateChanged } from "@firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const unset = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })

        return () => {
            unset();
        }
    }, [])

    return <AuthContext.Provider value={{currentUser}}>{children}</AuthContext.Provider>

}