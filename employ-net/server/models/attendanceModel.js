import mongoose from "mongoose";



// This code defines a MongoDB schema for attendance records using Mongoose. 
// It includes fields for the user (employee) ID, date, check-in and check-out timestamps, total hours worked, and status. 
// The schema provides structure for storing and managing attendance data within the database.


const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,   // The user ID of the employee
    ref: "Employee",
    required: true,
    index: true
  },
  date: {
    type: String,                  //the date is to track the current day's checkin/checkout status
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  checkInTime: {
    type: Date,             // The check-in timestamp
    default: null,
  },
  checkOutTime: {
    type: Date,
    default: null,      // The check-out timestamp
  },
  status: {
    type: String,
    default: "Pending",       //to keep track of whether employee is checked in for the day or not
  },
  monthlyHoursWorked : [
    {
      date: {
        type: String,
        required: true,
      },
      hoursWorked: {
        type: Number,
        default: 0,
      },
      attendanceStatus: {     //can be Present, absent, paid leave, or unpaid leave
        type: String,
        required: true,
      },
      
    }
  ],
  monthlyCheckInTime: [
    {
      date: {
        type: String,
      },
      cInTime: {
        type: String,
      }
    }
  ],
  monthlyCheckOutTime: [
    {
      date: {
        type: String,
      },
      cOutTime: {
        type: String,
      }
    }
  ],
  totalMonthlyHoursWorked: {
    type: Number,   // The total hours worked for the month
    default: 0,
  },
  totalOvertimeHours: {
    type: Number,
    default: 0,
  },
  totalDaysPresent: {
    type: Number,   // The total days present for the month
    default: 0,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
