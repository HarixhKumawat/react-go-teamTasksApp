import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosCookieJarSupport from 'axios-cookiejar-support'
import tough from 'tough-cookie'


axios.defaults.withCredentials = true
const cookieJar = new tough.CookieJar()
axios.defaults.jar = cookieJar

const Login = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        "username": "",
        "password": ""
    })

    useEffect(() => {
        if(sessionStorage.getItem('sessionId')){
            console.log("already logged in")
            navigate("/")
        }
    }, [sessionStorage.getItem('token')])

    const doLogin = async() => {
        console.log(formData)

        const baseUrl = ""//import.meta.env.VITE_SERVER_URL
        const url = baseUrl + "/login"
        let res = await axios.post(url,formData).catch((error)=>{
            console.log(error)
            alert("Invalid login")
        })

        // if (!(response.data !== undefined && response.status === 200)) {
        //     return;
        // }
        // console.log(res.jar.toJSON())
        console.log(res)
        console.log(cookieJar.store)
        sessionStorage.setItem("sessionId", res.data.sessionId);
        sessionStorage.setItem("username", res.data.username);
        navigate('/');
        console.log("login succesful")
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
            <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
                <h1 className="font-bold text-center text-2xl mb-5">Your Logo</h1>
                <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
                    <div className="px-5 py-7">
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">Username</label>
                        <input 
                            value={formData.username}
                            onChange={(e) => {setFormData({...formData, username:e.target.value})}}
                            type="text" 
                            className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
                        <input 
                            onChange={(e) => {setFormData({...formData, password:e.target.value})}}
                            type="text" 
                            className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                        <button
                            onClick={doLogin} 
                            type="button" 
                            className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
                            <span className="inline-block mr-2">Login</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                    <div className="py-5">
                        <div className="grid gap-1">
                            <div className="text-center sm:text-left whitespace-nowrap">
                                <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                    <svg className="inline-block" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                                        <linearGradient id="30xKrDxgk7QXuIS2ESBh3a_foeQvjHxAbGL_gr1" x1="6.811" x2="13.198" y1="9.014" y2="33.458" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#5961c3"></stop><stop offset="1" stopColor="#3a41ac"></stop></linearGradient><path fill="url(#30xKrDxgk7QXuIS2ESBh3a_foeQvjHxAbGL_gr1)" d="M11.5,17C8.463,17,6,19.462,6,22.5V32c0,0.552,0.448,1,1,1h9c0.552,0,1-0.448,1-1v-9.5	C17,19.462,14.537,17,11.5,17z"></path><linearGradient id="30xKrDxgk7QXuIS2ESBh3b_foeQvjHxAbGL_gr2" x1="10.592" x2="16.98" y1="8.026" y2="32.47" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#5961c3"></stop><stop offset="1" stopColor="#3a41ac"></stop></linearGradient><circle cx="11.5" cy="11.5" r="3.5" fill="url(#30xKrDxgk7QXuIS2ESBh3b_foeQvjHxAbGL_gr2)"></circle><linearGradient id="30xKrDxgk7QXuIS2ESBh3c_foeQvjHxAbGL_gr3" x1="14.803" x2="23.235" y1="7.798" y2="36.841" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#5961c3"></stop><stop offset="1" stopColor="#3a41ac"></stop></linearGradient><path fill="url(#30xKrDxgk7QXuIS2ESBh3c_foeQvjHxAbGL_gr3)" d="M21,18c-3.314,0-6,2.687-6,6v11c0,0.552,0.448,1,1,1h10c0.552,0,1-0.448,1-1V24	C27,20.687,24.314,18,21,18z"></path><linearGradient id="30xKrDxgk7QXuIS2ESBh3d_foeQvjHxAbGL_gr4" x1="19.661" x2="28.093" y1="6.387" y2="35.431" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#5961c3"></stop><stop offset="1" stopColor="#3a41ac"></stop></linearGradient><circle cx="21" cy="11" r="4" fill="url(#30xKrDxgk7QXuIS2ESBh3d_foeQvjHxAbGL_gr4)"></circle><linearGradient id="30xKrDxgk7QXuIS2ESBh3e_foeQvjHxAbGL_gr5" x1="23.546" x2="36.151" y1="6.673" y2="44.233" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#5961c3"></stop><stop offset="1" stopColor="#3a41ac"></stop></linearGradient><path fill="url(#30xKrDxgk7QXuIS2ESBh3e_foeQvjHxAbGL_gr5)" d="M33,20c-4.97,0-9,4.03-9,9v13c0,0.552,0.448,1,1,1h16c0.552,0,1-0.448,1-1V29	C42,24.03,37.97,20,33,20z"></path><linearGradient id="30xKrDxgk7QXuIS2ESBh3f_foeQvjHxAbGL_gr6" x1="30.738" x2="43.343" y1="4.259" y2="41.82" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#5961c3"></stop><stop offset="1" stopColor="#3a41ac"></stop></linearGradient><circle cx="33" cy="11" r="6" fill="url(#30xKrDxgk7QXuIS2ESBh3f_foeQvjHxAbGL_gr6)"></circle>
                                    </svg>
                                    <span className="inline-block ml-1"> <Link to={"/register"}>Register</Link></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;