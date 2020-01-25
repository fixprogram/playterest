const users = [];
const rooms = [];

const addUser = ({ socketID, id, userName, room }) => {

    if(!room) room = 'world';

    userName = userName.trim().toLowerCase();
    room = room.trim().toLowerCase();

    let notices = [];

    const user = { socketID, id, userName, room, notices };

    // const existingUser = users.find((user) => user.room === room && user.name === userName);
    const existingUser = users.find((user) => user.room === room && user.id === id);

    if(!userName || !room) return { error: 'Username and room are required.' };
    // if(!userName) return { error: 'Username required.' };
    // if(existingUser) return { error: 'Username is taken.' };
    if(!existingUser) users.push(user);

    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.socketID === id);

    if(index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const createRoom = ({ roomTitle, hostName, hostIcon, games, roomID }) => {
    const room = { roomTitle, hostName, hostIcon, games, roomID };

    rooms.push(room);

    return { room };
};

const removeRoom = (hostName) => {

    const index = rooms.findIndex((room) => {
        room.hostName = room.hostName.trim().toLowerCase();
        return room.hostName === hostName;
    });

    if(index !== -1) return rooms.splice(index, 1)[0];
};

const getRooms = () => rooms;

const addNotice = ({ userName, text }) => {
    let user = users.find((user) => user.userName === userName);
    user.notices.push(text);
    return user;
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom, createRoom, getRooms, removeRoom, addNotice };