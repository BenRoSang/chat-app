import { useContext, useEffect, useState } from "react"
import { ChatContext } from "../context/ChatContext"
import { AuthContext } from "../context/AuthContext";
import { doc, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase";
import EachMessage from "./EachMessage";

function ChatMessage() {
    const { data } = useContext(ChatContext);
    const [ messages, setMessages] = useState([])

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages)
        })

        return () => {
            unsub();
        }
    }, [data.chatId])

    return (
        <div className="chatMessage" >
            { messages.length > 0 && messages.map((message, i) => (
                <EachMessage message={message} key={i} />
            ))}
        </div>
    )
}

export default ChatMessage