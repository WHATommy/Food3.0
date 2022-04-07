const users = [];

const join = async (id, username, session) => {
    const user = { id, username, session };
    user.push(user);
    return user;
};

const leave = async(id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

// Get session users
function getUsers(session) {
    return users.filter(user => user.session === session);
  }

module.exports = { join, leave, getUsers };