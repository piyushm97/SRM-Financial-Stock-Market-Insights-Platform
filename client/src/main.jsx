import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import MarketData from './pages/MarketData'
import './App.css'


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<Routes>
<Route path="/" element={<App />}>
<Route index element={<Home />} />
<Route path="market" element={<MarketData />} />
</Route>
</Routes>
</BrowserRouter>
</React.StrictMode>
)
