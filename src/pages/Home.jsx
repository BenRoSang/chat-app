import Chat from "../components/Chat"
import Sidebar from "../components/Sidebar"

function Home() {
  return (
    <main className="homeContainer">
        <div className="homeWrapper">
            <Sidebar />
            <Chat />
        </div>
    </main> 
  )
}

export default Home