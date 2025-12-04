import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Navbar from './components/Navbar'


export default function App(){
return (
<div className="app">
<Navbar />
<main className="container">
<Outlet />
</main>
</div>
)
}
