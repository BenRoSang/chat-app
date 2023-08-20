import { doc, onSnapshot } from "firebase/firestore";

import { useContext, useEffect, useState } from "react"
import { db } from "../firebase"
import { AuthContext } from "../context/AuthContext"
import { ChatContext } from "../context/ChatContext";

function Chats() {
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext);

  const [chats, setChats] = useState([])

  useEffect(() => {
      const getChats = () => {
        const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
          setChats(doc.data());
        });
        return () => {
          getChats()
        }
      }

    currentUser.uid && getChats();
  }, [currentUser.uid])

  const handleSelect = (user) => {
    dispatch({ type: 'CHANGE_USER', payload: user })
  }

  console.log(Object.entries(chats))

  return (
    <>
      { chats && Object.entries(chats).sort((a,b) => b[1].date - a[1].date).map((chat, i) => (
        <div className="search-user" key={i} onClick={() => handleSelect(chat[1].userInfo)}>
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="user-info">
                <span>{chat[1].userInfo.displayName}</span>
                {
                  typeof chat[1].lastMessage != 'undefined' ?
                    ( <p>{chat[1].lastMessage.text}</p> ) : ''
                }
            </div>
        </div>
      ))}
    </>

  )
}

export default Chats