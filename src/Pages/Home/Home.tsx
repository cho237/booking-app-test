import CourseItem from "./CourseItem/CourseItem.tsx";
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {ICourse} from "../../Utils/models.ts";
import {toast} from "react-toastify";

function Home() {
    const [data, setData] = useState<ICourse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [searchKey, setSearchKey] = useState<string>("")
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('http://localhost:5000/training/courses?name=' + searchKey);
                setData(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        if (searchKey === '') {
            fetchData(); // Call the method directly if the condition is an empty string
        } else {
            const timeoutId = setTimeout(fetchData, 2000); // Call the method after a timeout of 3 seconds
            return () => clearTimeout(timeoutId); // Clear the timeout when the component unmounts or the condition changes
        }

    }, [searchKey]);

    const handleDelete = async (id:string | undefined):Promise<any> => {
        try {
            await axios.delete('http://localhost:5000/training/course/' + id);
            toast.success("Successfully")
            const updatedCourses: ICourse[] = data.filter((course)=> {
                return course._id !== id;
            })
            setData(updatedCourses);
        } catch (error: any) {
            toast.error("An Error occurred!");
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKey(e.target.value)
    }

    return (
        <>

            <div
                className=" bg-slate-900 general_padding flex flex-col gap-4 lg:gap-10 py-2 md:py-5 min-h-screen h-full"
            >
                <div className="">
                    <label
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >Search</label
                    >
                    <div className="relative">
                        <div
                            className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                        >
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>

                        <input

                            type="search"
                            value={searchKey}
                            onChange={handleSearch}
                            id="default-search"
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50
                    focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search Courses.."
                            required
                        />

                    </div>
                </div>
                {loading && <div className="text-white">Loading...</div>}
                {error && <div className="text-white">An Error occurred.</div>}
                {data.length > 0 &&
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3  gap-4">
                        {data.map((course) => <CourseItem deleteCourse={handleDelete} key={course._id} course={course}></CourseItem>)}
                    </div>
                }
                {(data.length === 0 && !loading) && <div className="text-white">No Course Found.</div>}
            </div>
        </>
    );
}

export default Home;