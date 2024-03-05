"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const training_1 = require("../models/training");
const router = (0, express_1.Router)();
router.get("/courses", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filter = {};
        if (req.query.name && req.query.name !== "") {
            filter.name = { $regex: req.query.name, $options: "i" };
        }
        const courses = yield training_1.Course.find(filter)
            .populate("appointments")
            .populate("bookings");
        if (!courses)
            return next(new errorHandler_1.default("No Course found!", 404));
        res.status(200).json(courses);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.get("/course/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield training_1.Course.findOne({ _id: req.params.id })
            .populate("appointments")
            .populate("bookings");
        if (!course)
            return next(new errorHandler_1.default("No Course found!", 404));
        res.status(200).json(course);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.get("/appointment/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointment = yield training_1.Appointment.findOne({ _id: req.params.id })
            .populate("bookings");
        if (!appointment)
            return next(new errorHandler_1.default("No Course found!", 404));
        res.status(200).json(appointment);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.delete("/course/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield training_1.Course.deleteOne({ _id: req.params.id });
        res.status(200).json("success");
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.get("/appointments/:filter", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filter = {};
        if (req.params.filter != "all") {
            if (!req.query.minDate || !req.query.minDate)
                return next(new errorHandler_1.default("Enter Filters", 400));
            const firstDay = new Date(req.query.minDate);
            const lastDay = new Date(req.query.maxDate);
            const minDate = new Date(firstDay.setHours(1, 0, 0));
            const maxDate = new Date(lastDay.setHours(1, 0, 0));
            filter.date = { $gte: minDate, $lte: maxDate };
        }
        const appointments = yield training_1.Appointment.find(filter).populate("course").populate("bookings");
        let appointmentCourses = [];
        for (const app of appointments) {
            appointmentCourses.push(app.course);
        }
        const uniqueCourses = Array.from(new Set(appointmentCourses.map(course => course.name))).map(name => {
            return {
                name: name,
                id: appointmentCourses.find(course => course.name === name)._id
            };
        });
        res.status(200).json({ appointments, uniqueCourses });
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.post("/course", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingCourse = yield training_1.Course.findOne({ name: req.body.name });
        const body = req.body;
        if (existingCourse)
            return next(new errorHandler_1.default("Course Exist", 409));
        const course = new training_1.Course({
            name: body.name,
            desc: body.desc,
            image: body.image,
            lecturer: body.lecturer,
            price: body.price,
        });
        const newCourse = yield course.save();
        res.status(201).json(newCourse);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.put("/course/:courseId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const existingCourse = yield training_1.Course.findOne({
            _id: req.params.courseId
        });
        if (!existingCourse)
            return next(new errorHandler_1.default("Course Not Found", 404));
        existingCourse.name = body.name;
        existingCourse.desc = body.desc;
        existingCourse.image = body.image;
        existingCourse.lecturer = body.lecturer;
        existingCourse.price = body.price;
        const updatedCourse = yield existingCourse.save();
        res.status(200).json(updatedCourse);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.post("/appointment", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const date = new Date(body.date);
        const existingApp = yield training_1.Appointment.findOne({
            course: body.course,
            date: date,
        });
        if (existingApp)
            return next(new errorHandler_1.default("Appointment Exist", 409));
        const existingCourse = yield training_1.Course.findOne({ _id: body.course });
        if (!existingCourse)
            return next(new errorHandler_1.default("Couse Not Found", 404));
        const apppointment = new training_1.Appointment({
            course: body.course,
            date: body.date,
        });
        const newAppointment = yield apppointment.save();
        existingCourse.appointments.push(newAppointment);
        yield existingCourse.save();
        res.status(201).json(newAppointment);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.put("/appointment/:appId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const existingApp = yield training_1.Appointment.findOne({
            _id: req.params.appId
        });
        if (!existingApp)
            return next(new errorHandler_1.default("Appointment Not Found", 404));
        existingApp.date = body.date;
        existingApp.course = body.course;
        const updatedAppointment = yield existingApp.save();
        res.status(200).json(updatedAppointment);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.post("/book/:appId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const existingApp = yield training_1.Appointment.findOne({ _id: req.params.appId });
        if (!existingApp)
            return next(new errorHandler_1.default("Appointment Not Found", 404));
        const existingBooking = yield training_1.Booking.findOne({
            user: body.user,
            appointment: req.params.appId
        });
        if (existingBooking)
            return next(new errorHandler_1.default("Already Booked", 409));
        const booking = new training_1.Booking({
            user: body.user,
            appointment: existingApp._id,
        });
        const newBooking = yield booking.save();
        if (existingApp.count >= 10) {
            return next(new errorHandler_1.default("Boking Limit", 400));
        }
        existingApp.bookings.push(newBooking._id);
        existingApp.count = existingApp.count + 1;
        yield existingApp.save();
        res.status(200).json(newBooking);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
exports.default = router;
