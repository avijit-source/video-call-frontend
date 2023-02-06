import { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Tabs from './Tabs';
import homeImg from "../assets/home.jpg"
import JoinRoom from './JoinRoom';
import CreateRoom from './CreateRoom';
function WelcomeForm() {
    const [activeKey, setActiveKey] = useState("join");



    return (
        <Card style={{ width: '23rem' }}>
            <Card.Img variant="top" src={homeImg} />
            <Card.Body>
                <Card.Title>Welcome to video calling app</Card.Title>
                <Tabs setActiveKey={setActiveKey} activeKey={activeKey} />
                {
                    activeKey === "join" ? (
                        <JoinRoom />
                    ) : (
                        <CreateRoom />
                    )
                }
                {/* <Button variant="primary">Go somewhere</Button> */}
            </Card.Body>
        </Card>
    );
}

export default WelcomeForm;