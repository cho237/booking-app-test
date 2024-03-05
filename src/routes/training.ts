import { Router } from "express";
import HttpError from "../utils/errorHandler";
import isAuth from "../middleware/is-auth";
import {
  Appointment,
  Booking,
  Course,
  IAppointment,
  IBooking,
  ICourse,
} from "../models/training";
import { promises } from "dns";
const router = Router();

export interface PRequest extends Request {
  userId: string;
  body: any;
  query: any;
  params: any;
}

router.get("/courses", async (req:PRequest, res:any, next:any) => {
  try {
    let filter:any = {};
    if(req.query.name && req.query.name !== ""){
      filter.name = {$regex:req.query.name, $options: "i"}
    }
    const courses = await Course.find(filter)
      .populate("appointments")
      .populate("bookings");
    if (!courses) return next(new HttpError("No Course found!", 404));
    res.status(200).json(courses);
  } catch (e) {
    return next(new HttpError(e, 500));
  }
});

router.get("/course/:id",  async (req:PRequest, res:any, next:any) => {
  try {
    const course = await Course.findOne({_id : req.params.id})
      .populate("appointments")
      .populate("bookings");
    if (!course) return next(new HttpError("No Course found!", 404));
    res.status(200).json(course);
  } catch (e) {
    return next(new HttpError(e, 500));
  }
})

router.get("/appointment/:id",  async (req:PRequest, res:any, next:any) => {
  try {
    const appointment = await Appointment.findOne({_id : req.params.id})
      .populate("bookings");
    if (!appointment) return next(new HttpError("No Course found!", 404));
    res.status(200).json(appointment);
  } catch (e) {
    return next(new HttpError(e, 500));
  }
})

router.delete("/course/:id",  async (req:PRequest, res:any, next:any) => {
  try {
    await Course.deleteOne({_id : req.params.id})
  
    res.status(200).json("success");
  } catch (e) {
    return next(new HttpError(e, 500));
  }
})

router.get(
  "/appointments/:filter",
  async (req: PRequest, res: any, next: any) => {
    try {
      let filter: any = {};
      if (req.params.filter != "all") {
        if(!req.query.minDate || !req.query.minDate ) return next(new HttpError("Enter Filters", 400));

        const firstDay = new Date(req.query.minDate);
        const lastDay = new Date(req.query.maxDate);

        const minDate = new Date(firstDay.setHours(1, 0, 0));
        const maxDate = new Date(lastDay.setHours(1, 0, 0));
        filter.date = { $gte: minDate, $lte: maxDate };
      }

      const appointments = await Appointment.find(filter).populate("course").populate("bookings");
      let appointmentCourses: any[] = [];
      for (const app of appointments) {
        appointmentCourses.push(app.course);
      }

      const uniqueCourses = Array.from(new Set(appointmentCourses.map(course => course.name))).map(name => {
        return {
            name: name,
            id: appointmentCourses.find(course => course.name === name)._id
        };
    });
    
      res.status(200).json({appointments, uniqueCourses });

    } catch (e) {
      return next(new HttpError(e, 500));
    }
  }
);


router.post("/course", async (req, res, next) => {
 
  try {
    const existingCourse = await Course.findOne({ name: req.body.name });
    const body = req.body as ICourse;
    if (existingCourse) return next(new HttpError("Course Exist", 409));

    const course = new Course({
      name: body.name,
      desc: body.desc,
      image: body.image,
      lecturer: body.lecturer,
      price: body.price,
    });
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (e) {
    return next(new HttpError(e, 500));
  }
});

router.put("/course/:courseId", async (req: PRequest, res: any, next: any)=> {
  try{

    const body = req.body as ICourse;
    const  existingCourse: any = await Course.findOne({
      _id: req.params.courseId
    });

    if (!existingCourse) return next(new HttpError("Course Not Found", 404));
    
    existingCourse.name = body.name;
    existingCourse.desc = body.desc;
    existingCourse.image = body.image;
    existingCourse.lecturer = body.lecturer;
    existingCourse.price = body.price;
  
    const updatedCourse = await existingCourse.save()
    res.status(200).json(updatedCourse);
  }catch (e) {
    return next(new HttpError(e, 500));
  }
})

router.post("/appointment", async (req, res, next) => {
  try {
    const body = req.body as IAppointment;
    const date = new Date(body.date);
    
    const existingApp = await Appointment.findOne({
      course: body.course,
      date: date,
    });

    if (existingApp) return next(new HttpError("Appointment Exist", 409));

    const existingCourse = await Course.findOne({ _id: body.course });
    if (!existingCourse) return next(new HttpError("Couse Not Found", 404));

    const apppointment = new Appointment({
      course: body.course,
      date: body.date,
    });

    const newAppointment: any = await apppointment.save();
    existingCourse.appointments.push(newAppointment);
    await existingCourse.save();

    res.status(201).json(newAppointment);
  } catch (e) {
    return next(new HttpError(e, 500));
  }
});

router.put("/appointment/:appId", async (req: PRequest, res: any, next: any)=> {
  try{
    const body = req.body as IAppointment;
    const  existingApp: any = await Appointment.findOne({
      _id: req.params.appId
    });

    if (!existingApp) return next(new HttpError("Appointment Not Found", 404));
    existingApp.date = body.date;
    existingApp.course = body.course;

    const updatedAppointment = await existingApp.save()
    res.status(200).json(updatedAppointment);
  }catch (e) {
    return next(new HttpError(e, 500));
  }
})

router.post("/book/:appId", async (req: PRequest, res: any, next: any) => {
  try {
    const body = req.body as IBooking;
    const existingApp:any = await Appointment.findOne({ _id: req.params.appId });
    if (!existingApp) return next(new HttpError("Appointment Not Found", 404));

    const existingBooking = await Booking.findOne({
      user: body.user,
      appointment: req.params.appId
    });

    if (existingBooking) return next(new HttpError("Already Booked", 409));

    const booking = new Booking({
      user: body.user,
      appointment: existingApp._id,
    });

    const newBooking: any = await booking.save();
    
    if(existingApp.count >= 10){
      return next(new HttpError("Boking Limit", 400))
    }
    existingApp.bookings.push(newBooking._id)
    existingApp.count = existingApp.count + 1
    await existingApp.save();

    res.status(200).json(newBooking);
  } catch (e) {
    return next(new HttpError(e, 500));
  }
});


export default router;

