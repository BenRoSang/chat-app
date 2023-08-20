import ChatInput from "./ChatInput"
import ChatMessage from "./ChatMessage"
import ChatNav from "./ChatNav"

function Chat() {
  return (
    <div className="chat">
      <ChatNav />
      <ChatMessage />
      <ChatInput />
    </div>
  )
}

export default Chat