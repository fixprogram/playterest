const users = [];
let rooms = [];

const addUser = ({socketID, id, userName, room}) => {

    if (!room) room = 'world';

    userName = userName.trim().toLowerCase();
    room = room.trim().toLowerCase();

    let notices = [];

    const user = {socketID, id, userName, room, notices};

    const existingUser = users.find((user) => user.room === room && user.id === id);

    if (!userName || !room) return {error: 'Username and room are required.'};
    if (!existingUser) users.push(user);

    return {user};
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.socketID === id);

    if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id = '', socketID = '') => {
    return users.find((user) => {
        console.log('id ' + id);
        console.log('userID ' + user.id);
        return user.id === id || user.socketID === socketID
    });
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const createRoom = ({roomTitle, host, games, roomID}) => {
    const room = {roomTitle, host, games, roomID, users: [host]};

    rooms.push(room);

    return {room};
};

const changeRoom = (userID = '', userSocket = '', room) => {
    const user = getUser(userID, userSocket);
    user.room = room.toLowerCase();
    removeUser(userSocket);
    users.push(user);
    return user;
};

const removeRoom = (hostName) => {

    const index = rooms.findIndex((room) => room.host.name.toLowerCase() === hostName.toLowerCase());

    if (index !== -1) return rooms.splice(index, 1);

};

const removeUserFromRoom = (userName) => {
    rooms.forEach((room) => {
        room.users.forEach((user, i) => {
            if (user.name.toLowerCase() === userName.toLowerCase()) room.users.splice(1, i);
        })
    });
    return rooms;
};

const updateRoom = (hostName, newRoom) => rooms.forEach((room) => {
    if (room.host.name === hostName) room = newRoom
});

const getRoom = (userName) => rooms.find((room) => room.host.name === userName);

const getRooms = () => rooms;

const addNotice = ({userName, text}) => {
    let user = users.find((user) => user.hostName === userName);
    user.notices.push(text);
    return user;
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    createRoom,
    changeRoom,
    getRooms,
    removeRoom,
    addNotice,
    getRoom,
    updateRoom,
    removeUserFromRoom
};