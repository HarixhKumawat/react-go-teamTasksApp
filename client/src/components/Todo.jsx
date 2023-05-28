import Cookies from 'js-cookie'
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {CookieJar} from "tough-cookie";
import {wrapper} from "axios-cookiejar-support";




const Todo = () => {
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar }));

    const navigate = useNavigate();
    const [formView, setFormView] = useState(false)
    const [editFormView, setEditFormView] = useState(false)
    const [tasksList, setTasksList] = useState([{
        _id: "",
        description: "",
        dueDate: "",
        title: ""
    }])
    const [taskDetails, setTaskDetails] = useState({
        "_id": "",
        "title": "",
        "description": "",
        "dueDate": ""
    })
    const baseUrl = import.meta.env.VITE_SERVER_URL


    const initList = async (sessionId) => {
        let sendData = {
           "sessionId" : sessionId
        }
        const url = baseUrl + "/getAllTasks"
        let resp = await client.post(url,sendData).catch((error)=>{
            console.log(error)
            console.error("some error")
            return
        })

        if (!(resp.data !== undefined && resp.status === 200)) {
            return
        }

        setTasksList(resp.data.tasks)
        console.log(resp)
    }


    useEffect(() => {
        console.log("we in")
        if(sessionStorage.getItem('sessionId')){
            console.log("welcome")
        } else {
            console.log("not logged in")
            navigate("/login")
        }
    }, [])

    useEffect(() => {
        const sessionId = sessionStorage.getItem('sessionId')

        initList(sessionId).then(() => {
            console.log("done")
        })
    }, [formView, editFormView])


    const task = (taskId, title , description, due_date) => {
        return (
            <>
                <div
                    className="group/item max-w-[79vw] md:max-w-[34vw]  w-fit rounded-3xl p-px bg-gradient-to-b from-blue-800 to-purple-800 hover:bg-slate-900">
                    <div className="rounded-[calc(1.5rem-1px)] p-4 bg-white ">
                        <div className=" flex gap-4 items-center">
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 text-transparent bg-clip-text bg-gradient-to-b from-blue-700 to-pink-900">{title}</h3>
                                <span className="text-sm tracking-wide text-gray-600 dark:text-gray-400">{due_date}</span>
                            </div>
                            <div className="flex invisible justify-around py-4
                                backdrop-blur-none w-fit group-hover/item:visible ml-auto mt-[-1rem]">
                                <button
                                    onClick={() => {toggleTaskFormEdit(taskId, title, description, due_date, editTask)}}
                                ><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 128 128">
                                    <path d="M 79.335938 15.667969 C 78.064453 15.622266 76.775 15.762109 75.5 16.099609 C 72.1 16.999609 69.299609 19.199219 67.599609 22.199219 L 64 28.699219 C 63.2 30.099219 63.699609 32.000781 65.099609 32.800781 L 82.400391 42.800781 C 82.900391 43.100781 83.400391 43.199219 83.900391 43.199219 C 84.200391 43.199219 84.399219 43.199609 84.699219 43.099609 C 85.499219 42.899609 86.1 42.399219 86.5 41.699219 L 90.199219 35.199219 C 91.899219 32.199219 92.4 28.700781 91.5 25.300781 C 90.6 21.900781 88.400391 19.100391 85.400391 17.400391 C 83.525391 16.337891 81.455078 15.744141 79.335938 15.667969 z M 60.097656 38.126953 C 59.128906 38.201172 58.199219 38.724609 57.699219 39.599609 L 27.5 92 C 24.1 97.8 22.200781 104.30039 21.800781 110.90039 L 21 123.80078 C 20.9 124.90078 21.5 125.99961 22.5 126.59961 C 23 126.89961 23.5 127 24 127 C 24.6 127 25.199219 126.8 25.699219 126.5 L 36.5 119.40039 C 42 115.70039 46.7 110.8 50 105 L 80.300781 52.599609 C 81.100781 51.199609 80.599219 49.3 79.199219 48.5 C 77.799219 47.7 75.899609 48.199609 75.099609 49.599609 L 44.800781 102 C 41.900781 106.9 37.899609 111.20039 33.099609 114.40039 L 27.300781 118.19922 L 27.699219 111.30078 C 27.999219 105.60078 29.699609 100 32.599609 95 L 62.900391 42.599609 C 63.700391 41.199609 63.200781 39.3 61.800781 38.5 C 61.275781 38.2 60.678906 38.082422 60.097656 38.126953 z M 49 121 C 47.3 121 46 122.3 46 124 C 46 125.7 47.3 127 49 127 L 89 127 C 90.7 127 92 125.7 92 124 C 92 122.3 90.7 121 89 121 L 49 121 z M 104 121 A 3 3 0 0 0 101 124 A 3 3 0 0 0 104 127 A 3 3 0 0 0 107 124 A 3 3 0 0 0 104 121 z"></path>
                                </svg></button>
                            </div>
                            <div className="flex invisible justify-around py-4
                                backdrop-blur-none w-fit group-hover/item:visible mt-[-1rem]">
                                <button
                                    onClick={() => {deleteTask(taskId)}}
                                ><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 64 64">
                                    <path d="M 28 7 C 25.243 7 23 9.243 23 12 L 23 15 L 13 15 C 11.896 15 11 15.896 11 17 C 11 18.104 11.896 19 13 19 L 15.109375 19 L 16.792969 49.332031 C 16.970969 52.510031 19.600203 55 22.783203 55 L 41.216797 55 C 44.398797 55 47.029031 52.510031 47.207031 49.332031 L 48.890625 19 L 51 19 C 52.104 19 53 18.104 53 17 C 53 15.896 52.104 15 51 15 L 41 15 L 41 12 C 41 9.243 38.757 7 36 7 L 28 7 z M 28 11 L 36 11 C 36.552 11 37 11.449 37 12 L 37 15 L 27 15 L 27 12 C 27 11.449 27.448 11 28 11 z M 32 23.25 C 32.967 23.25 33.75 24.034 33.75 25 L 33.75 45 C 33.75 45.966 32.967 46.75 32 46.75 C 31.033 46.75 30.25 45.966 30.25 45 L 30.25 25 C 30.25 24.034 31.033 23.25 32 23.25 z M 40.007812 23.25 C 40.972813 23.284 41.728313 24.094547 41.695312 25.060547 L 40.998047 45.146484 C 40.965047 46.092484 40.190953 46.836937 39.251953 46.835938 C 39.230953 46.835938 39.210453 46.833984 39.189453 46.833984 C 38.224453 46.799984 37.468953 45.989438 37.501953 45.023438 L 38.197266 24.9375 C 38.231266 23.9725 39.039813 23.223 40.007812 23.25 z M 23.990234 23.251953 C 24.954234 23.228953 25.766781 23.973453 25.800781 24.939453 L 26.498047 45.025391 C 26.532047 45.991391 25.776547 46.801938 24.810547 46.835938 C 24.790547 46.835937 24.769047 46.835938 24.748047 46.835938 C 23.810047 46.835938 23.033 46.091484 23 45.146484 L 22.302734 25.060547 C 22.268734 24.094547 23.024234 23.285953 23.990234 23.251953 z"></path>
                                </svg></button>
                            </div>
                        </div>
                        <p className="mt-5 dark:text-gray-600">{description}</p>
                    </div>
                </div>
            </>
        )
    }

    const deleteTask = async (taskId) => {
        console.log(taskId)
        let sendData = {
            "_id": taskId
        }
        const url = baseUrl + "/deleteTasks"
        let resp = await client.delete(url, {data: sendData}).catch((error)=>{
            console.log(error)

            console.error("some error")
            return
        })

        if (!(resp.data !== undefined && resp.status === 200)) {
            return
        }
        const sessionId = sessionStorage.getItem('sessionId')

        initList(sessionId).then(() => {
            console.log("done")
        })

        console.log(resp)
    }

    const addTask = async () => {
        setFormView(!formView)
        console.log(taskDetails)
        const url = baseUrl + "/writeTasks"
        let resp = await client.post(url,taskDetails).catch((error)=>{
            console.log(error)

            console.error("some error")
            return
        })

        if (!(resp.data !== undefined && resp.status === 200)) {
            return
        }

        console.log(resp)
        setTaskDetails({
            "_id": "",
            "title": "",
            "description": "",
            "dueDate": ""
        })
    }
    const editTask = async () => {
        setEditFormView(!editFormView)
        console.log(taskDetails)
        const url = baseUrl + "/editTasks"
        let resp = await client.put(url, taskDetails).catch((error)=>{
            console.log(error)

            console.error("some error")
            return
        })

        if (!(resp.data !== undefined && resp.status === 200)) {
            return
        }

        console.log(resp)
        setTaskDetails({
            "_id": "",
            "title": "",
            "description": "",
            "dueDate": ""
        })
    }

    const toggleTaskForm = () => {
        setFormView(!formView)
        console.log("a wild form has appeared")
        setTaskDetails({
            "_id": "",
            "title": "",
            "description": "",
            "dueDate": ""
        })
    }
    const toggleTaskFormEdit = (taskId, title, description, dueDate) => {
        console.log(taskId)
        setTaskDetails({"_id":taskId,
            "title": title,
            "description": description,
            "dueDate": dueDate
        })
        setEditFormView(!editFormView)
        console.log("a wild editing form has appeared")
    }


    const taskForm = (callFunc, toggleFunc) => {
        return (<>
            <div className="absolute inset-0 z-49 bg-black opacity-50"></div>

            <div id="modal" className="fixed inset-0 z-50">


                <div className="bg-white w-96 mx-auto my-16 p-8 rounded-lg shadow-lg">

                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">ADD TASK</h3>
                        <button className="text-gray-400 hover:text-gray-600" onClick={toggleFunc}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={taskDetails.title}
                                onChange={(e) => {setTaskDetails({...taskDetails, title:e.target.value})}}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Due Date</label>
                            <input
                                value={taskDetails.dueDate}
                                onChange={(e) => {setTaskDetails({...taskDetails, dueDate:e.target.value})}}
                                type="date" id="dueDate" name="dueDate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={taskDetails.description}
                                onChange={(e) => {setTaskDetails({...taskDetails, description:e.target.value})}}
                                id="description" name="description" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        <div className="flex text-left  justify-end">
                            <button
                                onClick={callFunc}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</button>
                        </div>

                </div>
            </div>
        </>)
    }

    return (
        <>
            <nav className="flex justify-around my-4 backdrop-blur-none
            backdrop-blur-md w-fit
            fixed bottom-2 right-10">

                <button
                    onClick={toggleTaskForm}
                ><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="72" height="72" viewBox="0 0 48 48">
                    <linearGradient id="dyoR47AMqzPbkc_5POASHa_aWZy3jlAFSa9_gr1" x1="9.858" x2="38.142" y1="-27.858" y2="-56.142" gradientTransform="matrix(1 0 0 -1 0 -18)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#9dffce"></stop><stop offset="1" stopColor="#50d18d"></stop></linearGradient><path fill="url(#dyoR47AMqzPbkc_5POASHa_aWZy3jlAFSa9_gr1)" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path d="M34,21h-7v-7c0-1.105-0.895-2-2-2h-2c-1.105,0-2,0.895-2,2v7h-7	c-1.105,0-2,0.895-2,2v2c0,1.105,0.895,2,2,2h7v7c0,1.105,0.895,2,2,2h2c1.105,0,2-0.895,2-2v-7h7c1.105,0,2-0.895,2-2v-2	C36,21.895,35.105,21,34,21z" opacity=".05"></path><path d="M34,21.5h-7.5V14c0-0.828-0.672-1.5-1.5-1.5h-2	c-0.828,0-1.5,0.672-1.5,1.5v7.5H14c-0.828,0-1.5,0.672-1.5,1.5v2c0,0.828,0.672,1.5,1.5,1.5h7.5V34c0,0.828,0.672,1.5,1.5,1.5h2	c0.828,0,1.5-0.672,1.5-1.5v-7.5H34c0.828,0,1.5-0.672,1.5-1.5v-2C35.5,22.172,34.828,21.5,34,21.5z" opacity=".07"></path><linearGradient id="dyoR47AMqzPbkc_5POASHb_aWZy3jlAFSa9_gr2" x1="22" x2="26" y1="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset=".824" stopColor="#135d36"></stop><stop offset=".931" stopColor="#125933"></stop><stop offset="1" stopColor="#11522f"></stop></linearGradient><path fill="url(#dyoR47AMqzPbkc_5POASHb_aWZy3jlAFSa9_gr2)" d="M23,13h2c0.552,0,1,0.448,1,1v20c0,0.552-0.448,1-1,1h-2c-0.552,0-1-0.448-1-1V14	C22,13.448,22.448,13,23,13z"></path><linearGradient id="dyoR47AMqzPbkc_5POASHc_aWZy3jlAFSa9_gr3" x1="13" x2="35" y1="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset=".824" stopColor="#135d36"></stop><stop offset=".931" stopColor="#125933"></stop><stop offset="1" stopColor="#11522f"></stop></linearGradient><path fill="url(#dyoR47AMqzPbkc_5POASHc_aWZy3jlAFSa9_gr3)" d="M35,23v2c0,0.552-0.448,1-1,1H14c-0.552,0-1-0.448-1-1v-2c0-0.552,0.448-1,1-1h20	C34.552,22,35,22.448,35,23z"></path>
                </svg></button>
            </nav>
            <div className="mt-20 flex flex-wrap gap-4 items-start text-left px-2 md:px-12 bg-white">
                {tasksList.map((e) => {
                    return task(e._id, e.title, e.description, e.dueDate.slice(0, 10))
                })}
            </div>

            {formView ? (taskForm(addTask, toggleTaskForm)) : (<></>)}
            {editFormView ? (taskForm(editTask, toggleTaskFormEdit)) : (<></>)}
        </>
    )
}





export default Todo;