import React, {Component} from "react";
import {HashRouter, Route, Switch, withRouter} from "react-router-dom";
import AppWrapper from "./components/app-wrapper";

class AppRouter extends Component {

    constructor(props){
        super(props);
        this.state = {
            mounted: false
        }
    }

    componentDidMount(){
        this.setState({mounted:true})
    }

    render() {

        return (
            <HashRouter hashType='noslash'>
                <Switch>
                    <Route path='/' render={() =>
                    [
                        <div id="timeLineChart">
                            <AppWrapper mounted={this.state.mounted}/>
                        </div>,
                        <div id="scrollChart"/>
                    ]
                        }/>
                </Switch>
            </HashRouter>
        );
    }
}

export default withRouter(AppRouter)