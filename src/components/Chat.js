const Chat = ({ descendingOrderMessages }) => {
    return (
        <>
            <div className="chat-display">
                {descendingOrderMessages.map((message, _index) => (
                    <div key={_index}>
                        <div className= "chat-bubble">
                        <div className="chat-message-header">
                            <div className="img-container">
                                <img src={message.img} alt={message.first_name + ' profile'} />
                            </div>
                            <hr></hr>
                            <p>{message.name}</p>

                        </div>
                        <p>{message.message}</p>
                        <hr></hr>
                        </div>
                    </div>
                ))}
            </div>
        </>

    )
}

export default Chat