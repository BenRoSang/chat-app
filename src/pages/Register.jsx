import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const handleRegister = async(e) => {
        e.preventDefault();
        const displayName = e.target[0].value
        const email = e.target[1].value
        const password = e.target[2].value
        const file = e.target[3].files[0];

        try {
        // createUserWithEmailAndPassword(auth, email, password)
        const res = await createUserWithEmailAndPassword(auth, email, password)

        const storageRef = ref(storage, displayName);

        await uploadBytesResumable(storageRef, file).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
                try {
                    await updateProfile(res.user, {
                        displayName,
                        photoURL: downloadURL
                    })

                    await setDoc(doc(db, "users", res.user.uid), {
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL
                    });

                    await setDoc(doc(db, "userChats", res.user.uid), {});
                    navigate("/")
                } catch (error) {
                    console.log(error)
                    throw new Error('Something went wrong')
                }
            })
        })


        } catch (error) {
            console.log(error)
            throw new Error('Something went wrong')
        }

    }

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">TiTiTarTar Chat</span>
                <span className="title">Register</span>
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <label htmlFor='file'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 svg-icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span>Add a avatar</span>
                        <input type="file" id="file" className="hidden"/>
                    </label>
                    <button type="submit" className="btn-primary">Sign up</button>
                </form>
                <span>You do have a account? <Link to={'/login'}>Login</Link></span>
            </div>
        </div>
    )
}

export default Register