import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import VideoComp from './VideoComp'

function VideoContainer({ myStream, userStreamRef }) {
    const userStreams = useSelector((state) => state.room.userStreams)

    useEffect(() => {
        if (myStream.current) {
            myStream.current.muted = true
        }
    }, [myStream])
    // useEffect(() => {
    //     if (userStreams && userStreams.length > 0) {
    //         userStreams.forEach((val, i) => {
    //             console.log(val, "userstreams111")

    //             const video = document.createElement("video");
    //             video.srcObject = val.stream
    //             video.style.maxWidth = "400px";
    //             video.style.maxHeight = "300px"
    //             video.addEventListener("loadedmetadata", () => {
    //                 video.play()
    //             })
    //             console.log("")
    //             // setUserVids([...uservids, video])
    //             parentVidRef.current.append(video)
    //         })

    //     }
    // }, [userStreams])
    return (
        <div className="videos d-flex flex-wrap">
            <div className="video mx-auto" style={{ maxWidth: "400px", maxHeight: "300px" }}>
                <video ref={myStream} style={{ width: "100%", height: "100%" }}></video>
            </div>


            {
                userStreams && userStreams.map((val) => (
                    <div className="video mx-auto" style={{ maxWidth: "400px", maxHeight: "300px" }}>
                        <VideoComp stream={val.stream} />
                    </div>
                ))
            }
        </div>
    )
}

export default VideoContainer