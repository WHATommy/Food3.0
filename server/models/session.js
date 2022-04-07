const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
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