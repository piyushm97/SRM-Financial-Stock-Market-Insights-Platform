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
// client/src/App.jsx
import { useState } from "react";
import { t, setLanguage } from "./i18n";

function App() {
  const [lang, setLang] = useState("en");

  const handleChangeLang = (e) => {
    const value = e.target.value;
    setLang(value);
    setLanguage(value);
  };

  return (
    <div>
      <header>
        <h1>{t("app.title")}</h1>
        <p>{t("app.subtitle")}</p>

        <select value={lang} onChange={handleChangeLang}>
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
      </header>

      <main>
        <h2>{t("dashboard.welcome")}</h2>
      </main>
    </div>
  );
}

export default App;
