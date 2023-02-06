import Nav from 'react-bootstrap/Nav';

function Tabs({ activeKey, setActiveKey }) {
    console.log(activeKey)
    return (
        <Nav variant="pills" activeKey={activeKey} className="mt-3">
            <Nav.Item onClick={() => setActiveKey("join")}>
                <Nav.Link eventKey={"join"}>Join a room</Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => setActiveKey("create")}>
                <Nav.Link eventKey="create">Create a room</Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export default Tabs;