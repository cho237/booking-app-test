import {useState} from 'react';
import {ICourse} from "../../../Utils/models.ts";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {FaEdit} from "react-icons/fa";
import {RiDeleteBin6Fill} from "react-icons/ri";
import {Link} from "react-router-dom";
import {convertDateFormat} from "../../../Utils/functions.ts";
import Modal from "../../../Components/Modal/Modal.tsx";

interface Props {
    course: ICourse,
    deleteCourse: (id: string | undefined) => void
}


function CourseItem({course, deleteCourse}: Props) {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [appointmentId, setAppointmentId] = useState<string | undefined>("")
    const [userName, setUserName] = useState<string>("")
    const handleBook = async (): Promise<any> => {
        try {
            if (!appointmentId || !userName) return

            const response = await axios.post('http://localhost:5000/training/book/' + appointmentId, {
                user: userName
            });
            if (response.status >= 300) return toast.error("An Error occurred!");
            toast.success("Successfully")
            setShowModal(false)
        } catch (error: any) {
            if (error.response.status === 409) {
                return toast.warning("Already booked!");
            }
            toast.error("An Error occurred!");
        }
    }

    const modalHandler = () => {
        setShowModal(!showModal)
        console.log(showModal)

    }

    return (
        <>
            <Modal openModal={showModal} setOpenModal={modalHandler}>
                <h1>Hello</h1>
            </Modal>

            <div

                className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-full"
            >
                <div className="p-5">
                    <a href="#" className="flex justify-between">
                        <h5
                            className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                        >
                            {course.name}
                        </h5>
                        <h5 className="text-white text-2xl">{course.price} FCFA</h5>
                    </a>
                    <p
                        className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2 min-h-[50px]"
                    >
                        {course.desc}
                    </p>
                    <div className="py-2">
                        <img alt="bookImage"
                             src={course.image}></img>
                    </div>
                    <div className="h-[150px] min-h-[150px] bg-slate-700 overflow-y-auto py-4 px-2">
                        <p className="text-white text-xl font-bold border-b-2">
                            Available Appointments
                        </p>
                        <div className="flex flex-col  gap-2 py-1 px-5">
                            {course.appointments?.map((appointment) =>
                                <div key={appointment._id} className="flex justify-between items-center ">
                                    <p className="text-white ">{convertDateFormat(appointment.date.toString())}</p>
                                    <a
                                        onClick={() => {
                                            setShowModal(true)
                                            setAppointmentId(appointment._id)
                                        }}
                                        className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300"
                                    >
                                        Book
                                    </a>
                                </div>
                            )}
                            {/*{showModal &&*/}
                            {/*    <div*/}

                            {/*        className="relative z-10"*/}
                            {/*        aria-labelledby="modal-title"*/}
                            {/*        role="dialog"*/}
                            {/*        aria-modal="true"*/}
                            {/*    >*/}

                            {/*        <div*/}
                            {/*            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"*/}
                            {/*        ></div>*/}

                            {/*        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">*/}
                            {/*            <div*/}
                            {/*                className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"*/}
                            {/*            >*/}

                            {/*                <div*/}
                            {/*                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"*/}
                            {/*                >*/}

                            {/*                    <div className="bg-slate-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">*/}
                            {/*                        <div className="mb-5">*/}
                            {/*                            <label*/}
                            {/*                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"*/}
                            {/*                            >Username</label*/}
                            {/*                            >*/}
                            {/*                            <input*/}
                            {/*                                onChange={(e) => setUserName(e.target.value)}*/}
                            {/*                                type="text"*/}
                            {/*                                id="text"*/}
                            {/*                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"*/}
                            {/*                                required*/}
                            {/*                            />*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}
                            {/*                    <div*/}
                            {/*                        className="bg-slate-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"*/}
                            {/*                    >*/}

                            {/*                        <button*/}
                            {/*                            onClick={handleBook}*/}
                            {/*                            type="submit"*/}
                            {/*                            className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"*/}
                            {/*                        >*/}
                            {/*                            Submit*/}
                            {/*                        </button>*/}
                            {/*                        <button*/}
                            {/*                            onClick={() => setShowModal(false)}*/}
                            {/*                            type="button"*/}
                            {/*                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"*/}
                            {/*                        >*/}
                            {/*                            Cancel*/}
                            {/*                        </button>*/}
                            {/*                    </div>*/}

                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*}*/}
                        </div>


                    </div>
                    <div className="flex justify-end py-2 gap-2 text-xl">
                        <Link to={`/manageCourse/${course._id}`}>
                            <FaEdit className="text-blue-800 cursor-pointer"/>
                        </Link>
                        <RiDeleteBin6Fill onClick={() => deleteCourse(course._id)}
                                          className="text-red-800 cursor-pointer"/>
                    </div>


                </div>
            </div>

        </>
    );
}

export default CourseItem;