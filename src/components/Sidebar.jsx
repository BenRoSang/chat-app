import { signOut } from "@firebase/auth"
import Chats from "./Chats"
import Search from "./Search"
import { auth } from "../firebase"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

function Sidebar() {
  const {currentUser} = useContext(AuthContext)
  return (
    <section className="side-bar">
        <div className="headInfo">
            <span className="logo">4T Chat</span>
            <div>
                <img src={currentUser.photoURL} alt="" />
                <span>{currentUser.displayName}</span>
                <button onClick={() => signOut(auth)}>Logout</button>
            </div>
        </div>
        <div className="search">
          <Search />
          <Chats />
        </div>
        
    </section>
  )
}

export default Sidebar