import { Schema, model, connect } from "mongoose";

export interface ICourse {
  id: string;
  name:string;
  image:string;
  desc: string;
  lecturer: string;
  price: number;
  appointments: IAppointment[];
  bookings: IBooking[]
}

export interface IAppointment {
  id: string;
  course: ICourse;
  date: Date;
  bookings: IBooking[];
  count:number
}

export interface IBooking {
  id: string;
  user: string;
  appointment: IAppointment;
}

const courseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  desc: { type: String, required: true },
  lecturer: { type: String, required: true },
  price: { type: Number, required: true },
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

export const Course = model<ICourse>("Course", courseSchema);

const appSchema = new Schema<IAppointment>({
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  date: { type: Date, required: true },
  bookings: [ {
    type: Schema.Types.ObjectId,
    ref: "Booking",
  },],
  count: {type: Number, default: 0}
});

export const Appointment = model<IAppointment>("Appointment", appSchema);

const bookingSchema = new Schema<IBooking>({
  user: { type: String, required: true },
  appointment: 
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },

});

export const Booking = model<IBooking>("Booking", bookingSchema);
