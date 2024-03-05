import * as Yup from "yup"
import {FormikHelpers, useFormik} from "formik";
import axios from "axios";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import {Params, useParams} from "react-router-dom";
import {ICourse} from "../../Utils/models.ts";
import {convertDateFormat} from "../../Utils/functions.ts";
import {RiDeleteBin6Fill} from "react-icons/ri";


function AddCourse() {
    const [loading, setLoading] = useState<boolean>(false)
    const params: Readonly<Params<string>> = useParams()
    const [initialValues, setInitialValues] = useState<ICourse>({
        name: "",
        price: 0,
        lecturer: "",
        desc: "",
        image: ""
    })
    const inputStyle: string = "mb-5 flex flex-col gap-y-2"
    const [editMode, setEditMode] = useState<boolean>(false)
    const [date, setDate] = useState("")
    useEffect(() => {
        if (params.id) {
            const getDetails = async () => {
                const response = await axios.get('http://localhost:5000/training/course/' + params.id);
                // const initialValues: FormValues = {
                //     name: response.data.name,
                //     price: response.data.price,
                //     lecturer: response.data.lecturer,
                //     desc: response.data.desc,
                //     image: response.data.image,
                // }
                setEditMode(true)
                setInitialValues(response.data)
            }
            getDetails();
        }
    }, []);


    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is Required"),
        price: Yup.number().required("Price is Required"),
        lecturer: Yup.string().required("Lecturer is Required"),
        desc: Yup.string().required("Desc is Required"),
        image: Yup.string().required("Image is Required")
    })

    const formik = useFormik<ICourse>({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema,
        // Add your onSubmit logic here
        onSubmit: async (values: ICourse, onReset: FormikHelpers<ICourse>) => {
            try {
                setLoading(true);
                if (editMode) {
                    await axios.put('http://localhost:5000/training/course/' + initialValues._id, values, {});
                    setInitialValues(values)
                } else {
                    await axios.post('http://localhost:5000/training/course', values, {});
                    onReset.resetForm({})
                }
                setLoading(false);
                toast.success("Successfully")

            } catch (error: any) {
                setLoading(false);
                if (error.response.status === 409) return toast.warning("Duplicate");
                toast.error("An Error occurred!");

            }
        }
    });

    const handleAddAppointment = async () => {
        try {
            if (!date) return toast.warning("please enter Date");
            setLoading(true)
            const response = await axios.post('http://localhost:5000/training/appointment', {
                course: initialValues._id,
                date: date
            });
            initialValues.appointments?.push(response.data)

            toast.success("Successfully")
            setLoading(false)
        } catch (error: any) {
            setLoading(false)
            toast.error("An Error occurred!");
        }
    }
    // const handleDeleteAppointment = async(id:string) => {
    //     try {
    //         await axios.post('http://localhost:5000/training/appointment', {
    //             course: initialValues._id,
    //             date: date
    //         });
    //         toast.success("Successfully")
    //     } catch (error: any) {
    //         setLoading(false)
    //     }
    // }

    return (

        <>
            <div
                className="  bg-slate-900 general_padding flex flex-col gap-4 lg:gap-10 py-2 md:py-5 min-h-screen h-full">
                <div className="flex flex-col md:flex-row gap-y-4 md:gap-8 pt-3">
                    <form
                        onSubmit={formik.handleSubmit}
                        className="w-full mx-auto px-5 max-h-[1000px] overflow-y-auto"
                    >
                        <p className="text-xl font-bold pb-4 text-white">{editMode ? "Edit Course" : "Add Course"}</p>
                        <div className={inputStyle}>
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Name</label
                            >
                            <input
                                type="text"
                                id="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {(formik.errors.name && formik.touched.name) &&
                                <p className="text-red-600">{formik.errors.name}</p>}
                        </div>
                        <div className={inputStyle}>
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Price</label
                            >
                            <input
                                type="number"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {(formik.errors.price && formik.touched.price) &&
                                <p className="text-red-600">{formik.errors.price}</p>}
                        </div>
                        <div className={inputStyle}>
                            <label

                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Lecturer</label
                            >
                            <input
                                type="text"
                                id="lecturer"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="lecturer"
                                value={formik.values.lecturer}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}

                            />
                            {(formik.errors.lecturer && formik.touched.lecturer) &&
                                <p className="text-red-600">{formik.errors.lecturer}</p>}
                        </div>
                        <div className={inputStyle}>
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Description</label
                            >
                            <input
                                type="text"

                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="desc"
                                value={formik.values.desc}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}

                            />
                            {(formik.errors.desc && formik.touched.desc) &&
                                <p className="text-red-600">{formik.errors.desc}</p>}
                        </div>
                        <div className={inputStyle}>
                            <label

                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Image</label
                            >
                            <input
                                type="text"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="image"
                                value={formik.values.image}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}

                            />
                            {(formik.errors.image && formik.touched.image) &&
                                <p className="text-red-600">{formik.errors.image}</p>}
                        </div>
                        <button
                            disabled={loading}
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {loading ? "Loading.." : "Submit"}
                        </button>
                    </form>

                    {editMode &&
                        <div>
                            <p className="text-xl font-bold pb-4 text-white">Appointments</p>
                            <div className="flex gap-2">
                                <input
                                    onChange={(e) => setDate(e.target.value)}
                                    type="date"
                                    id="date"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />

                                <button
                                    onClick={handleAddAppointment}
                                    disabled={loading}
                                    type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    {loading ? "Loading.." : "Add"}
                                </button>
                            </div>
                            <div className="">
                                {

                                    initialValues.appointments?.map((app) =>
                                        <div
                                            key={app._id}
                                            className="text-white pt-5 flex justify-between items-center text-lg
                                         ">
                                            {convertDateFormat(app.date.toString())}
                                            <RiDeleteBin6Fill className="text-red-800 cursor-pointer"/>

                                        </div>
                                    )
                                }
                            </div>

                        </div>
                    }

                </div>

            </div>


        </>
    );
}

export default AddCourse;