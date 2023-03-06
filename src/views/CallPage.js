import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ChatList from '../components/ChatList';
import UserList from '../components/UserList';
import VideoContainer from '../components/VideoContainer';
import { BsChatLeftQuote, BsFillMicFill, BsCameraVideo } from "react-icons/bs"
import { FiVideoOff } from "react-icons/fi";
import { BiCopy } from "react-icons/bi"
import { AiOutlineAudioMuted } from "react-icons/ai"
import { ImPhoneHangUp } from "react-icons/im"
import io from "socket.io-client";
import { Alert, Badge, Container, Nav, Navbar } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, emptyMessage, removeUserStream, setDatetime, setMyStream, setOnlineUsersInroom, setSocket, setUserStream } from '../features/slice/roomSlice';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Peer } from "peerjs";
import { v4 as uuidv4 } from 'uuid';


const ENDPOINT = "https://video-call-backend-avijitweb.onrender.com";
var socket;
const ICESERVER = [{ url: 'stun:stun01.sipphone.com' },
{ url: 'stun:stun.ekiga.net' },
{ url: 'stun:stun.fwdnet.net' },
{ url: 'stun:stun.ideasip.com' },
{ url: 'stun:stun.iptel.org' },
{ url: 'stun:stun.rixtelecom.se' },
{ url: 'stun:stun.schlund.de' },
{ url: 'stun:stun.l.google.com:19302' },
{ url: 'stun:stun1.l.google.com:19302' },
{ url: 'stun:stun2.l.google.com:19302' },
{ url: 'stun:stun3.l.google.com:19302' },
{ url: 'stun:stun4.l.google.com:19302' },
{ url: 'stun:stunserver.org' },
{ url: 'stun:stun.softjoys.com' },
{ url: 'stun:stun.voiparound.com' },
{ url: 'stun:stun.voipbuster.com' },
{ url: 'stun:stun.voipstunt.com' },
{ url: 'stun:stun.voxgratia.org' },
{ url: 'stun:stun.xten.com' },
{
    url: 'turn:numb.viagenie.ca',
    credential: 'muazkh',
    username: 'webrtc@live.com'
},
{
    url: 'turn:192.158.29.39:3478?transport=udp',
    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    username: '28224511:1379330808'
},
{
    url: 'turn:192.158.29.39:3478?transport=tcp',
    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    username: '28224511:1379330808'
}]
function CallPage() {
    const firstJoined = useRef(false);
    const params = useParams()
    const location = useLocation()
    const myPeer = useRef()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [time, setTime] = useState("")
    const [show, setShow] = useState(false);
    const [myMicMuted, setIsMyMicMuted] = useState(false);
    const [myCamMuted, setIsMyCamMuted] = useState(false);

    const [socketEvents, setSocketEvents] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    console.log(location.state)
    const allusersconnected = useSelector((state) => state.room.userSteams);

    const myStream = useRef();
    const userStreamRef = useRef();

    useEffect(() => {
        socket = io(ENDPOINT, { query: { username: location.state, roomname: params.id } });
        setSocketEvents(socket);
        // socket.emit("setup", user);
        // socket.on("connected", () => {
        //     console.log("connected");
        //     setSocketConnected(true);
        // });


        myPeer.current = new Peer(location.state + uuidv4(), {
            config: {
                'iceServers': ICESERVER
            }
        },[]);


        async function getMedia() {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {width:480,height:360}
            }).then((stream) => {
                console.log("stream", myStream.current)
                myStream.current.srcObject = stream;
                myStream.current.play()
                dispatch(setMyStream(stream))

            })
        }

        getMedia()


        socket.on("updatedroomusers", (data) => {
            console.log("data", data)
            const roomids = Object.keys(data);
            if (roomids.includes(params.id)) {
                dispatch(setOnlineUsersInroom(data[params.id]))
            }
        })

        socket.on("notification", (data) => {
            toast.info(<h6>{data}</h6>)
            // console.log("peerid")
        })

        socket.on("newMessage", (message) => {
            dispatch(addMessage(message))
        })

        socket.on("datetime", (datetime) => {
            setTime(datetime)
            // dispatch(setDatetime(datetime))
            console.log("datetime", datetime)
        })

        socket.on("callconnectuser", peerid => {
            const call = myPeer.current.call(peerid.userPeerId, myStream.current.srcObject);
            call.on("stream", userVideoStream => {
                console.log("peerIdnew", userVideoStream)
                // userStreamRef.current.srcObject = userVideoStream;
                // userStreamRef.current.play()
                dispatch(setUserStream({ peerId: peerid.userPeerId, stream: userVideoStream, call: call }))
            })

            // console.log(peerid.userPeerId, "peerIdnew")
        })

        socket.on("callended", (user) => {
            // const found = allusersconnected.find((val) => val.peerId.startsWith(user));
            console.log("callended", user)
            // console.log("callended", found)
            dispatch(removeUserStream(user))
        })


        return () => {
            // socket.emit("disconnecteduser", myPeer.id)
            dispatch(emptyMessage())
        }
    }, [])

    useEffect(() => {
        if (myPeer.current) {
            myPeer.current.on("open", id => {
                console.log("opemed", id)
                   socket.emit("joinroom", { roomId: params.id }, { userPeerId: id })
                myPeer.current.on('call', call => {
                    console.log("calling", call.peer, myStream.current.srcObject)
                    call.answer(myStream.current.srcObject)
                    // console.log("callfrom", call)
                    call.on('stream', userVideoStream => {
                        // userStreamRef.current.srcObject = userVideoStream;
                        // userStreamRef.current.play()
                        dispatch(setUserStream({
                            peerId: call.peer,
                            stream: userVideoStream,
                            call: call
                        }))
                    })
                })
            })

            console.log("peerid", myPeer.current)
            myPeer.current.on("close", id => {
                console.log("peeridclose", id)
            })

        }
    }, [myPeer.current])

    useEffect(() => {
        dispatch(setSocket(socket))
    }, [socket, dispatch])

    const handleRoomLeave = () => {
        navigate(-1)
    }

    function muteMic() {
        let isMuted;

        myStream.current.srcObject.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        dispatch(setMyStream(myStream.current.srcObject))
        myStream.current.srcObject.getAudioTracks().forEach(track => {
            if (track.enabled) {
                isMuted = false
            } else {
                isMuted = true
            }
        })
        setIsMyMicMuted(isMuted)

    }

    function muteCam() {
        let isMuted;
        myStream.current.srcObject.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        dispatch(setMyStream(myStream.current.srcObject))
        myStream.current.srcObject.getVideoTracks().forEach(track => {
            if (track.enabled) {
                isMuted = false
            } else {
                isMuted = true
            }
        })
        setIsMyCamMuted(isMuted)

    }



    return (
        <div>
            <div className="canvas" style={{ position: "relative" }}>
                <Offcanvas show={show} onHide={handleClose} style={{ backgroundColor: "#2c3e50", color: "white" }}>
                    <Offcanvas.Header closeButton closeVariant='white'>
                        <Offcanvas.Title>Users and chats</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <UserList />
                        <ChatList />
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            <div className="container" style={{ position: "absolute", top: "80px" }}>
                <VideoContainer myStream={myStream} userStreamRef={userStreamRef} />
            </div>
            <div>
                <Navbar bg="dark" variant="dark" fixed='bottom'>
                    <Container>
                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <div>
                                <Button variant="primary" className="btn-canvas mx-2" onClick={handleShow}>
                                    <BsChatLeftQuote size={30} />
                                </Button>
                            </div>
                            <div>
                                <Button variant="info" className="btn-canvas mx-2" onClick={muteMic}>
                                    {
                                        myMicMuted ? (
                                            <AiOutlineAudioMuted size={30} />
                                        ) : (
                                            <BsFillMicFill size={30} />
                                        )
                                    }
                                </Button>
                            </div>
                            <div>
                                <Button variant="success" className="btn-canvas mx-2" onClick={muteCam}>
                                    {
                                        myCamMuted ? (
                                            <FiVideoOff size={30} />
                                        ) : (
                                            <BsCameraVideo size={30} />
                                        )
                                    }
                                </Button>
                            </div>
                            <div>
                                <Button variant="danger" className="btn-canvas mx-2" onClick={handleRoomLeave}>
                                    <ImPhoneHangUp size={30} />
                                </Button>
                            </div>

                        </div>
                        <div>
                            <Badge bg="light" text="dark" className='badge' onClick={() => {
                                navigator.clipboard.writeText(params.id);
                                toast.success("Copied to clipboard")
                            }}>
                                Copy RoomId <BiCopy size={20} />
                            </Badge>

                        </div>
                    </Container>
                </Navbar>
            </div>
        </div>
    );
}

export default CallPage
