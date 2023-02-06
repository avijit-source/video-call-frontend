import React from 'react'
import { BiUser } from "react-icons/bi"
import { useSelector } from 'react-redux'
import SingleUserOnline from './SingleUserOnline'
function UserList() {
    const usersOnline = useSelector((state) => state.room.usersInroom)
    return (
        <>
            <h4>Users online <BiUser /></h4>
            <div className="users-container">
                {
                    usersOnline && (
                        usersOnline.map((val, i) => (
                            <SingleUserOnline value={val} />
                        ))
                    )
                }

            </div>
        </>
    )
}

export default UserList