const users = [];
let rooms = [];

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

const createRoom = ({ roomTitle, host, games, roomID }) => {
    const room = { roomTitle, host, games, roomID, users: [host] };

    rooms.push(room);

    return { room };
};

const removeRoom = (hostName) => {

    const index = rooms.findIndex((room) => room.host.name === hostName);

    if(index !== -1) return rooms.splice(index, 1)[0];

};

const updateRoom = (hostName, newRoom) => rooms.forEach((room) => {
    if(room.host.name === hostName) room = newRoom
});

const getRoom = (userName) => rooms.find((room) => room.host.name === userName);

const getRooms = () => {
    // rooms = rooms.filter((item, pos) => rooms.indexOf(item) === pos);
    return rooms;
};

const addNotice = ({ userName, text }) => {
    let user = users.find((user) => user.hostName === userName);
    user.notices.push(text);
    return user;
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom, createRoom, getRooms, removeRoom, addNotice, getRoom, updateRoom };