import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { setUsername } from '../features/slice/roomSlice';


function CreateRoom() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [validated, setValidated] = useState(false);
    const [username, setusername] = useState("");
    const [roomId, setRoomId] = useState("")

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (!roomId || !username) {
            setValidated(true);
            return
        }
        dispatch(setUsername(username))
        navigate("/call/" + roomId, { state: username })
        console.log("clicked")
    };
    return (
        <div className="container mt-3">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Click the button to generate room id</Form.Label>
                    <Form.Control value={roomId} type="text" placeholder="roomId" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Username</Form.Label>
                    <Form.Control required value={username} onChange={(e) => setusername(e.target.value)} type="text" placeholder="username" />
                    <Form.Control.Feedback type="invalid">
                        Please provide a username.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="button" onClick={(e) => {
                    // e.preventDefault()
                    setRoomId(uuidv4())
                }}>
                    Generate id
                </Button>
                <br />
                {
                    roomId !== "" && (
                        <Button className='mt-3' variant="info" type="submit">
                            Join room
                        </Button>
                    )
                }
            </Form>
        </div>
    )
}

export default CreateRoom