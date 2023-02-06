import EmojiPicker from 'emoji-picker-react';
import React from 'react'
import { Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BiSend } from "react-icons/bi"

function EmojiModal({ show, handleClose, setMessage, handleMessageSend, message }) {
    return (
        <div>
            <Modal show={show} onHide={handleClose} animation={false} centered>
                <Modal.Body>
                    <EmojiPicker emojiStyle='apple' width={"100%"} onEmojiClick={(emoji) => {
                        // console.log(emoji);
                        setMessage((prev) => prev + " " + emoji.emoji);
                    }} />
                </Modal.Body>
                <Modal.Footer>
                    <InputGroup>
                        <Form.Control
                            placeholder="message"
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
                        <Button variant="primary" onClick={() => {
                            handleMessageSend();
                            handleClose();
                        }}>
                            <BiSend />
                        </Button>
                    </InputGroup>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EmojiModal