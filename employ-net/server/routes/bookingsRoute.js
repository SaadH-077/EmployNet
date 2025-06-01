import express from 'express';
import Room from '../models/roomModel.js';
import Booking from '../models/bookingsModel.js';
import Employee from '../models/employeeModel.js';
import mongoose from 'mongoose';
import nodemailer from "nodemailer";

const router = express.Router();

// Endpoint to fetch all rooms
router.get('/get-rooms', async (req, res) => 
{
    try 
    {
      const rooms = await Room.find({});

      res.json({ success : true, rooms: rooms });
    } 
    catch (error) 
    {
      res.status(500).json({ message: 'Error fetching room data' });
    }
});


// Endpoint to fetch available slots for a room on a given date
router.get('/get-available-slots/:roomId/:date', async (req, res) => {
  const { roomId, date } = req.params;

  try 
  {
    const slots = ['First Slot', 'Second Slot', 'Third Slot', 'Fourth Slot']; // Slot names
    const slotTimes = {
      'First Slot': { startTime: '9:00 AM', endTime: '11:00 AM' },
      'Second Slot': { startTime: '11:00 AM', endTime: '1:00 PM' },
      'Third Slot': { startTime: '1:00 PM', endTime: '3:00 PM' },
      'Fourth Slot': { startTime: '3:00 PM', endTime: '5:00 PM' },
    };

    const dayStart = new Date(date);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      roomId: roomId,
      bookingDate: {
        $gte: dayStart,
        $lt: dayEnd
      },
      'slot.booked': true
    }).select('slot.name -_id');

    // Get the names of the booked slots
    const bookedSlotNames = bookings.map((booking) => booking.slot.name);

    // Filter out the names of the slots that are not booked
    const availableSlotNames = slots.filter((slotName) => !bookedSlotNames.includes(slotName));

    // Map the available slot names to their corresponding time ranges
    const availableSlots = availableSlotNames.map((slotName) => ({
      name: slotName,
      ...slotTimes[slotName],
      booked: false  // Indicates these slots are available
    }));

    res.json({ success: true, availableSlots });
  } 
  catch (error) 
  {
    res.status(500).json({ message: 'Error fetching available slots' });
  }
});


// Creating a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

//Creating a route to send an email
const sendEmail = async (to, subject, text) => {
  try 
  {
      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: to,
          subject: subject,
          text: text,
      });
      return { success: true, message: "Email sent successfully" };
  } 
  catch (error) 
  {
      return { success: false, message: "Internal server error" };
  }
};


// Endpoint to make a booking
router.post('/make-booking', async (req, res) => {
  const { employeeId,roomId,roomName, bookingDate, slot } = req.body;

  // console.log("Employee ID: ", employeeId, " Room ID: ", roomId, " Room Name: ", roomName, " Booking Date: ", bookingDate, " Slot: ", slot);

  const slotTimes = {
    'First Slot': { startTime: '9:00 AM', endTime: '11:00 AM' },
    'Second Slot': { startTime: '11:00 AM', endTime: '1:00 PM' },
    'Third Slot': { startTime: '1:00 PM', endTime: '3:00 PM' },
    'Fourth Slot': { startTime: '3:00 PM', endTime: '5:00 PM' },
  };

  try 
  {
    const employee = await Employee.findById(employeeId);
    if (!employee)
    {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Extract the email from the employee document
    const employeeEmail = employee.Email;

    const newBooking = new Booking({
      employeeId: employeeId,
      roomId: roomId,
      roomName: roomName,
      bookingDate: new Date(bookingDate),
      slot: {
        name: slot.name,
        startTime: slotTimes[slot.name].startTime, 
        endTime: slotTimes[slot.name].endTime,
        booked: true
      }
    });

    await newBooking.save();

    // Construct the email message
    const emailSubject = "Booking Confirmation";
    const emailBody = `
    Dear ${employee.FirstName} ${employee.LastName},

    We are pleased to confirm your meeting room booking. Here are the details of your reservation:
    
    - Room: ${roomName}
    - Date: ${bookingDate}
    - Time: ${slotTimes[slot.name].startTime} to ${slotTimes[slot.name].endTime}
    
    Please ensure you arrive at the room a few minutes early to set up, and be mindful to vacate the room promptly at the end of your booking to accommodate subsequent reservations.
    
    If you need to cancel or modify your booking, please do so with adequate notice to allow other teams the opportunity to book the space.
    
    For any technical needs or assistance during your meeting, you can contact our support team at employnetlums@gmail.com.
    
    Thank you for using our meeting room booking system. We wish you a productive meeting.
    
    Best regards,
    EmployNet Team`;

    const emailResponse = await sendEmail(employeeEmail, emailSubject, emailBody);
    if (emailResponse.success) 
    {
      res.json({ success: true, message: 'Booking successful and email sent', booking: newBooking })
    }
    else
    {
      res.status(500).json({ success: false, message: 'Booking successful but email could not be sent.' });
    }

  } 
  catch (error) 
  {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

router.get('/view-bookings', async (req, res) => {
  try 
  {
    const bookings = await Booking.find({});

    res.json({ success: true, bookings });
  } 
  catch (error) 
  {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

export { router }; 
