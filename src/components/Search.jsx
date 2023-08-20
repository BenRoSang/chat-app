import { useContext, useState } from "react"
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { async } from "@firebase/util";
import { AuthContext } from "../context/AuthContext";


function Search() {
  const { currentUser } = useContext(AuthContext)
  const [userName, setUserName ] = useState('')
  const [user, setUser ] = useState(null)
  const [error, setError ] = useState(false)

  const handleSearch = async() => {
    const userRef = collection(db, 'users');
    const q = query(userRef, where("displayName", "==", userName));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setUser(doc.data());
      });
    } catch (error) {
      console.log(error)
      setError(true)
    }

  }

  const handleKey = (e) => {
    console.log(e.code , 'in enter')
    e.code === 'Enter' ? handleSearch() : setUser(null)
  }

  const handleSelect = async() => {
    //check wether the group(chats in firestore) exits, if not create
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid
    try {
      const res = await getDoc(doc(db, "chats", combinedId))
      console.log(res)
      if(!res.exists()) {
        await setDoc(doc (db, "chats", combinedId), { messages: []})

        //create user chats
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId+".userInfo"] : {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId+".date"]: serverTimestamp()
        })

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId+".userInfo"] : {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId+".date"]: serverTimestamp()
        })
      }
    } catch (error) {
      console.log(error)
    }
    //create user chats
    setUser(null)
    setUserName('')
  }

  return (
    <div className="search-form">
        <input type="text" value={userName}
          onKeyDown={handleKey}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Search"/>
          { error && <p>User not found!</p>}
          { user &&
            (<div className="search-user" onClick={handleSelect}>
              <img src={user.photoURL} alt="" />
              <div className="user-info">
                  <span>{user.displayName}</span>
              </div>
            </div>
            )
          }
    </div>
  )
}

export default Search