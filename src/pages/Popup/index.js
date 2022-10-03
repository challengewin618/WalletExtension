import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Create from './create';
import Main from './main';
import Send from "./send";

import { render } from 'react-dom';
import './index.css';

render(<MemoryRouter>
    <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/create" element={<Create />} />
        <Route path="/send" element={<Send />} />
    </Routes>
</MemoryRouter>, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();