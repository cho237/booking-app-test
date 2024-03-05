"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.Appointment = exports.Course = void 0;
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    desc: { type: String, required: true },
    lecturer: { type: String, required: true },
    price: { type: Number, required: true },
    appointments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Appointment",
        },
    ],
    bookings: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Booking",
        },
    ],
});
exports.Course = (0, mongoose_1.model)("Course", courseSchema);
const appSchema = new mongoose_1.Schema({
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course" },
    date: { type: Date, required: true },
    bookings: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Booking",
        },],
    count: { type: Number, default: 0 }
});
exports.Appointment = (0, mongoose_1.model)("Appointment", appSchema);
const bookingSchema = new mongoose_1.Schema({
    user: { type: String, required: true },
    appointment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Appointment",
    },
});
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
