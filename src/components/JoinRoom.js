import React, { useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsCheckLg } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsername } from '../features/slice/roomSlice';


function JoinRoom() {
    const formRef = useRef();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [validated, setValidated] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [username, setUsername1] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = formRef.current;
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
    // const handleJoin = (e)=>{
    //     e.preventDefault();

    // }
    return (
        <div className="container mt-3">
            <Form noValidate validated={validated} ref={formRef}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enter room ID</Form.Label>
                    <Form.Control required onChange={(e) => setRoomId(e.target.value)} type="text" placeholder="Enter or paste room id" />
                    <Form.Control.Feedback type="invalid">
                        Please provide a roomId.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Enter your username</Form.Label>
                    <Form.Control required onChange={(e) => setUsername1(e.target.value)} type="text" placeholder="username" />
                    <Form.Control.Feedback type="invalid">
                        Please provide a username.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Join
                </Button>
            </Form>
        </div>
    )
}

export default JoinRoom