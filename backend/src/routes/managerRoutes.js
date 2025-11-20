
import { Router } from "express";
import { ping } from "../controllers/managerController.js";
import { listBookings, approveBooking, rejectBooking } from "../controllers/fieldController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const r = Router();

r.get("/ping", requireAuth, requireRole("manager"), ping);

// Booking management (public for now - TODO: add auth)
r.get('/bookings', listBookings);
r.put('/bookings/:id/approve', approveBooking);
r.put('/bookings/:id/reject', rejectBooking);

export default r;
