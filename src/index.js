import React from "react";
import {render} from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";
import AppRouter from "./app-router";

import "dc/dc.css"
import "d3-context-menu/css/d3-context-menu.css"

render(
    <Router>
        <AppRouter/>
    </Router>,
    document.getElementById('root')
)
;