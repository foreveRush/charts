import React, {Component} from "react";
import {HashRouter, Route, Switch, withRouter} from "react-router-dom";
import AppWrapper from "./components/app-wrapper";

class AppRouter extends Component {

    render() {
        return (
            <HashRouter hashType='noslash'>
                <Switch>
                    <Route path='/' render={() => <AppWrapper/>}/>
                </Switch>
            </HashRouter>
        );
    }
}

export default withRouter(AppRouter)