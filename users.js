const users = [];
const rooms = [];

const addUser = ({ socketID, id, userName, room }) => {

    if(!room) room = 'world';

    userName = userName.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const user = { socketID, id, userName, room };

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

const createRoom = ({ roomTitle, hostName, roomID }) => {
    const room = { roomTitle, hostName, roomID };

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

module.exports = { addUser, removeUser, getUser, getUsersInRoom, createRoom, getRooms, removeRoom };