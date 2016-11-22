let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let commentSchema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId, required: true, unique: true
        },
        content: {
            type: String, required: true
        },
        username: {
            type: String, required: true
        },
        timestamp: {
            type: Date, required: true, default: Date.now
        }
    },
    {
        collection: 'comments'
    }
);

let eventSchema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId, required: true, unique: true
        },
        title: {
            type: String, required:true
        },
        time: {
            type: Date, required: true
        },
        owner: {
            type: Schema.Types.Mixed
        },
        type: {
            type: String, required: true
        },
        private: {
            type: Boolean, required: true
        },
        notification: {
            type: Boolean, required: true, default: false
        },
        value: {
            type: Number, required: true, default: 0
        },
        share: {
            type: Number, required: true, default: 0
        }
    },
    {
        collection: 'events'
    }
);

let userSchema = new Schema(
    {
        username: {
            type: String, required: true, unique:true
        },
        password: {
            type: String, required: true
        },
        birthday: {
            type: String, required: true
        },
        name: {
            type: String, required: true
        },
        gender: {
            type: String, required: true
        },
        email: {
            type: String, required: true
        },
        notification: {
            type: Boolean, required: true
        },
        comments: {
            type: [commentSchema],default: []
        },
        events: {
            type: [eventSchema],default: []
        },
        following: {
            type: [this], default: []
        },
        followedBy: {
            type: [this] ,default: []
        },
        adminPrivilege: {
            type: Boolean, required: true, default: false
        }
    },
    {
        collection: 'users'
    }
);





mongoose.connect('mongodb://localhost/usersdb');
let schema = {'User': mongoose.model('User', userSchema), 'Event': mongoose.model('Event', eventSchema),
              'Comment': mongoose.model('Comment', commentSchema)
};
module.exports = schema;