const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    sessionID: {
        type: String,
        required: true
    },
    users: [
        {
            client_id: {
                type: String,
                required: true
            },
            username: {
                type: String
            }
        }
    ],
    restaurantList: [
        {
            type: String
        }
    ]
});

const Session = mongoose.model('sessions', SessionSchema);
module.exports = Session;