
import './App.css'
import {Route, Routes} from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.tsx";
import Home from "./Pages/Home/Home.tsx";
import AddCourse from "./Pages/AddCourse/AddCourse.tsx";
import {ToastContainer} from "react-toastify";


function App() {


  return (
    <>
        <ToastContainer/>
        <Navbar></Navbar>
        <Routes>
            <Route path="/manageCourse">
                <Route index element={<AddCourse/>}></Route>
                <Route path=":id" element={<AddCourse/>}></Route>
            </Route>

            <Route path="/">
                <Route index element={<Home/>}></Route>
                <Route path=":id" element={<h1>Details </h1>}></Route>
            </Route>
        </Routes>
    </>
  )
}

export default App
