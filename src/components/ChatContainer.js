import ChatDisplay from "./ChatDisplay"
import ChatHeader from "./ChatHeader"
import MatchesDisplay from "./MatchesDisplay"
import { useState } from 'react'


const ChatContainer = ({ user }) => {
    const [clickedUser, setClickedUser] = useState(null)

    // console.log('clickedUser', clickedUser)
    return (
        <div className="chat-container">Chat here
        <ChatHeader user={user}/>
        

        <div>
            <button className="options" onClick={() => setClickedUser(null)}>Matches</button>
            <button className="options" disabled={!clickedUser}>Chat</button>

        </div>
        {!clickedUser && <MatchesDisplay matches={user.matches} setClickedUser={setClickedUser}/>}

        {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser}/>}
        </div>
    )
}

export default ChatContainer