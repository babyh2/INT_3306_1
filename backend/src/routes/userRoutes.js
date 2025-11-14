
import { Router } from "express";
import { ping } from "../controllers/userController.js";
import { listFields, getField, createBooking, getBooking, updateBooking } from "../controllers/fieldController.js";

const r = Router();

r.get("/ping", ping);

// Public: list fields
r.get('/fields', listFields);
// Get single field details
r.get('/fields/:id', getField);

// Create a booking (public for now)
r.post('/bookings', createBooking);
// Get booking details
r.get('/bookings/:id', getBooking);
// Update booking (payment, status)
r.put('/bookings/:id', updateBooking);

export default r;
