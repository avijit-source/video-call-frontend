import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WelcomeForm from '../components/WelcomeForm'
import { emptyUserStream } from '../features/slice/roomSlice'

function Home() {
    const dispatch = useDispatch()
    const userStreamStillOn = useSelector((state) => state.room.myStream)
    const socket = useSelector((state) => state.room.socket);

    useEffect(() => {

        if (userStreamStillOn) {
            userStreamStillOn.getTracks().forEach(function (track) {
                track.stop();
            });
            dispatch(emptyUserStream())
            console.log('userstream', userStreamStillOn)
        }
        if (socket) {
            socket.disconnect();
        }
    })
    return (
        <div className="container">
            <div className="inner">
                <WelcomeForm />
            </div>
        </div>
    )
}

export default Home