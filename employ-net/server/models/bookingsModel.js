import mongoose from "mongoose";

const Schema1 = mongoose.Schema;
const slotSchema = new Schema1({
    name: {
      type: String,
      required: true,
      enum: ['First Slot', 'Second Slot', 'Third Slot', 'Fourth Slot'], // Restrict to these values
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    booked: {
      type: Boolean,
      required: true,
      default: false, // By default, a slot is not booked
    }
  });

/* Holds all bookings references by employee who made the booking, 
their team ID, the room booked, and the date/time it was booked for */
const Schema2 = mongoose.Schema;
const bookingsSchema = new Schema2({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    roomName: {
        type: String,
        required: true,
    },
    bookingDate: {
        type: Date,
        required: true,
    },
    slot: slotSchema
});

const Booking = mongoose.model("Booking", bookingsSchema);
export default Booking;