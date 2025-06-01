import mongoose from "mongoose";

const Schema = mongoose.Schema;
const roomsSchema = new Schema({
    roomName: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    availabilityStartTime: {
        type: String,
        required: true,
        default: '09:00' // Default start time set to 9 AM
      },
      availabilityEndTime: {
        type: String,
        required: true,
        default: '17:00' // Default end time set to 5 PM (17:00 in 24-hour format)
      }
});

const Room = mongoose.model("Room", roomsSchema);
export default Room;
