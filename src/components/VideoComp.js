import React, { useEffect, useRef } from 'react'

function VideoComp({ stream }) {
    const localVideo = useRef();

    useEffect(() => {
        console.log("stream", stream)
        if (localVideo.current && stream) {
            localVideo.current.srcObject = stream
            localVideo.current.play()
        }
    }, [stream, localVideo]);
    return (
        <video ref={localVideo} style={{ width: "100%", height: "100%" }}></video>
    )
}

export default VideoComp