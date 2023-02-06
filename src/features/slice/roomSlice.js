import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    username: "",
    usersInroom: [],
    messages: [],
    socket: null,
    datetime: "",
    myPeer: null,
    myStream: null,
    userStreams: []
}

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload
        },
        setOnlineUsersInroom: (state, action) => {
            state.usersInroom = action.payload
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        },
        setSocket: (state, action) => {
            state.socket = action.payload
        },
        emptyMessage: (state) => {
            state.messages = []
        },
        setDatetime: (state, action) => {
            state.datetime = action.payload
        },
        setMyPeer: (state, action) => {
            state.myPeer = action.payload
        },
        setMyStream: (state, action) => {
            state.myStream = action.payload
        },
        setUserStream: (state, action) => {
            const includes = state.userStreams.find(val => val.peerId === action.payload.peerId)
            if (!includes) {
                state.userStreams.push({
                    peerId: action.payload.peerId,
                    stream: action.payload.stream,
                    call: action.payload.call
                })
            }
        },
        removeUserStream: (state, action) => {
            const includes = state.userStreams.find(val => val.peerId.startsWith(action.payload));
            if (includes) {
                includes.call.close()
                state.userStreams = state.userStreams.filter(val => !val.peerId.startsWith(action.payload))
            }
        },
        emptyUserStream: (state) => {
            state.userStreams = []
        }
    },
})

// Action creators are generated for each case reducer function
export const { setUsername, setOnlineUsersInroom, addMessage, setSocket, emptyMessage, setDatetime, setMyPeer, setMyStream, setUserStream, removeUserStream, emptyUserStream } = roomSlice.actions

export default roomSlice.reducer