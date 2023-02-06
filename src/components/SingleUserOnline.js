import React from 'react'

function SingleUserOnline({ value }) {
    return (
        <div className="d-flex justify-content-between p-2">
            <h6>{value}</h6>
            <span className="dot" style={{ backgroundColor: "#3de34e" }}></span>
        </div>
    )
}

export default SingleUserOnline