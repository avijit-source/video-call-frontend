import React, { useEffect, useMemo, useState } from 'react'
import { BsChatLeftQuote, BsImage, BsFillEmojiLaughingFill } from "react-icons/bs"
import { BiSend } from "react-icons/bi"
import SingleUserOnline from './SingleUserOnline'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import EmojiModal from './EmojiModal';
import moment from 'moment/moment';


function ChatList() {
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const chatList = useSelector((state) => state.room.messages)
    const socket = useSelector((state) => state.room.socket)
    const handleMessageSend = () => {
        if (!message) {
            return false;
        }
        socket.emit("sendMessage", message);
        setMessage("")

    }

    useEffect(() => {
        document.getElementById('input-file').addEventListener('change', function () {

            console.log("image check")
            const reader = new FileReader();
            reader.onloadend = function () {
                const bytes = new Uint8Array(this.result);
                socket.emit('imageMessage', bytes);
            };
            reader.readAsArrayBuffer(this.files[0]);

        }, false);

    }, [])

    const renderImg = (imgfile) => {
        // create image with
        // change image type to whatever you use, or detect it in the backend 
        // and send it if you support multiple extensions
        return (
            <img width={200} height={200} src={`data:image/jpg;base64,${imgfile}`} />
        )
    }

    useEffect(() => {
        const tabScroll = document.getElementById("tabScroll");
        tabScroll.scrollTop = tabScroll.scrollHeight
    }, [chatList])




    return (
        <div style={{ position: "absolute", bottom: "10px" }}>
            <h4 className="mt-4">Chat list <BsChatLeftQuote /></h4>
            <div className="chats-container" id="tabScroll">
                {
                    chatList && chatList.length > 0 && (
                        chatList.map((val, i) => (
                            <div className="bubbleWrapper">
                                <div className="inlineContainer">
                                    <div className="otherBubble other">
                                        {val.message}
                                        {val.image && renderImg(val.image)}
                                    </div>
                                </div>
                                <div className="innerspan">
                                    <span className="other" style={{ marginRight: "18px" }}>{val.username}</span>
                                    <span className="other">{moment(val.date).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                </div>

                            </div>

                        ))
                    )
                }
            </div>

            <InputGroup className='mt-2'>
                <Form.Control
                    placeholder="Enter message"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleMessageSend()
                        }
                    }}
                />
                <Button variant="primary" onClick={handleShow}>
                    <BsFillEmojiLaughingFill />
                </Button>

                <div className='file mx-2'>
                    <label htmlFor='input-file'>
                        <BsImage />
                    </label>
                    <input id='input-file' type='file' accept='image/*' />
                </div>
                <Button variant="primary" id="button-addon2" onClick={handleMessageSend}>
                    <BiSend />
                </Button>
            </InputGroup>
            <EmojiModal show={show} handleClose={handleClose} message={message} handleMessageSend={handleMessageSend} setMessage={setMessage} />
        </div>

    )
}

export default ChatList
