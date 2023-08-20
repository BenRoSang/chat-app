import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { ChatContext } from "../context/ChatContext"
import { async } from "@firebase/util"
import { arrayUnion, doc, updateDoc, Timestamp, serverTimestamp } from "@firebase/firestore"
import { db, storage } from "../firebase"
import { v4 as uuid } from 'uuid';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"


function ChatInput() {
    const [text, setText] = useState('')
    const [img, setImg] = useState(null)

    const { currentUser} = useContext(AuthContext)
    const { data } = useContext(ChatContext)


    const handleSend = async () => {
        if(img) {
            const storageRef = ref(storage, uuid());

            await uploadBytesResumable(storageRef, img).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL
                            })
                        })

                        await updateDoc(doc(db, "userChats", currentUser.uid), {
                            [data.chatId + ".lastMessage"]: {
                                text,
                            },
                            [data.chatId + ".date"]: serverTimestamp(),
                        });

                        await updateDoc(doc(db, "userChats", data.user.uid), {
                            [data.chatId + ".lastMessage"]: {
                                text,
                            },
                            [data.chatId + ".date"]: serverTimestamp(),
                        });

                    } catch (error) {
                        console.log(error)
                        throw new Error('Something went wrong')
                    }
                })
            })

        }else{
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            });

            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".lastMessage"]: {
                    text,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: {
                    text,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

        }
        setText('')
        setImg(null)
    }

    return (
        <div className="chatInput">
            <input type="text"
                placeholder="Type..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="chatItem">
                <label>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <input type="file" onChange={(e) => setImg(e.target.files[0])} id="file" className="hidden" />
                </label>
                <button type="button" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    )
}

export default ChatInput