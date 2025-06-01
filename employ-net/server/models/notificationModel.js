import mongoose from "mongoose";

//this is the notification schema
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "userModel",
        required: true,
        index: true,
    },

    userModel: {
        type: String,
        required: true,
        enum: ["Employee", "Manager"], // Specify the possible models that can be referenced
    },

    notifications: [
        {
            //each notification object has a title, content, date, and isRead field. Each user has an array of notifications
            notif_index: {
                type: Number,
                required: true,
                default: 0,
            },
            notif_type: {
                type: String,
                required: true,
                default: "standard",
            },
            content: {
                type: String,
                required: true,
                default: "",
            },
            time: {
                type: String,
            },
            isRead: {
                type: Boolean,
                default: false,
            },
        },
    ],
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
