import { useState } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'

import Login from './components/Login'
import Register from './components/Register'
import Todo from './components/Todo'


function App() {

  return (<BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Todo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
      
  )
}

export default App;
