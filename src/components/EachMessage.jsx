import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { formatDistanceToNow } from 'date-fns'


function EachMessage({message}) {

    const [timeAgo, setTimeAgo] = useState(formatDistanceToNow(message.date.toMillis(), { addSuffix: true }))
    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)
    const ref = useRef()

    useEffect(() => {
        ref.current?.scrollIntoView({behavior: 'smooth'})

    }, [message])

    useEffect(() => {
        const updateInterval = setInterval(() => {
            setTimeAgo( formatDistanceToNow(message.date.toMillis(), { addSuffix: true }))
        }, 60000);

        return () => {
        clearInterval(updateInterval)
        }
    }, [message.date])

    return (
        <div ref={ref} className={`message ${currentUser.uid === message.senderId && 'owner'}`}>
            <div className="messageInfo">
                <img src={currentUser.uid === message.senderId ? currentUser.photoURL : data.user.photoURL} alt="" />
                <span>{timeAgo.replace(/almost|about|over|less than/g, "")}</span>
            </div>
            <div className="messageContent">
                <img src={message.img && message.img} alt="" />
                <p>{message.text}</p>
            </div>
        </div>
    )
}

export default EachMessage