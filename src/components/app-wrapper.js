import React, {Component} from "react"
import dc from "dc"
import crossfilter from "crossfilter"
import * as d3 from "d3"
import {d3Time} from "d3"
import {testData} from "../data/data-provider"
import contextMenu from "d3-context-menu"

export default class AppWrapper extends Component {

    constructor(props) {
        super(props);

        dc.config.defaultColors(d3.schemeCategory10)
        this.timeLineChart = null;
        this.scrollChart = null;
        this.dblclickTimer = 0;
        this.state = {
            mounted: false
        }
    }

    componentDidMount() {

        this.setState({mounted:true})
        d3.select('body').on('click.d3-context-menu', function () {
            d3.select('.d3-context-menu').style('display', 'none');
        });
    }

    render() {

        const {mounted} = this.state;

        if (mounted) {
            let ndx = crossfilter(testData);
            let dim = ndx.dimension(d => new Date(d.timestamp));

            // let group = dim.group().reduceSum(d => 1);
            let group = dim.group().reduce(
                (previousState, objectToAdd) => {
                    if (!previousState.objs[objectToAdd.id]) {
                        previousState.objs[objectToAdd.id] = objectToAdd
                    }
                    previousState.sum++;
                    return previousState;
                },
                (previousState, objectToRemove) => {
                    previousState.sum--;
                    delete previousState.objs[objectToRemove.id];
                    return previousState;
                },
                () => ({sum: 0, objs: {}})
            );

            let chart = this.timeLineChart ? this.timeLineChart : dc.barChart('#timeLineChart');

            let scrollChart = this.scrollChart ? this.scrollChart : dc.barChart('#scrollChart');

            chart
                .width(1200)
                .height(300)
                // .x(d3.scaleLinear().domain([0, 10]))
                .brushOn(false)

                // .transitionDuration(1000)
                // .margins({top: 10, right: 20, bottom: 20, left: 30})

                // .yAxisLabel("This is the Y Axis!")

                .dimension(dim)
                .mouseZoomable(true)
                .rangeChart(scrollChart)
                // .x(d3.timeMinutes(new Date('October 12, 1996 06:35:32'), new Date('October 19, 1996 06:35:32')))
                // .x(d3.scaleTime().domain([new Date(2000, 0, 1), new Date(2000, 0, 5)]))
                .x(d3.scaleTime().domain([new Date("2019-04-05T18:00:00.000"), new Date("2019-04-05T18:10:00.000")]))
                // .elasticY(true)
                // .x(d3.scaleTime())
                //
                // onClick callback only works for bar charts with an ordinal X axis, we have timeline
                .on("pretransition", chart => {

                    chart.selectAll("rect.bar").each(function (d) {
                        let actionType = Object.values(d.data.value.objs)[0].name;

                        var menu = [
                            {
                                title: 'Item #1',
                                action: object => {
                                    let data = Object.values(object.data.value.objs)[0];
                                    alert(`Item #1 clicked!\nID: ${data.id}\nAction: ${data.name}`)
                                }
                            },
                            {
                                title: 'Item #2',
                                action: object => {
                                    let data = Object.values(object.data.value.objs)[0];
                                    alert(`Item #2 clicked!\nID: ${data.id}\nAction: ${data.name}`)
                                }
                            }
                        ]

                        d3.select(this)
                            .style("width", 5)
                            .style("fill", () => {
                                switch (actionType) {
                                    case "startGame":
                                        return "aqua";
                                    case "kick":
                                        return "red";
                                    case "out":
                                        return "yellow";
                                    case "goal":
                                        return "green";
                                    case "pass":
                                        return "black";
                                    case "endGame":
                                        return "aqua";
                                    default :
                                        return "black"
                                }
                            })
                            //if we'll use on "click" and on "dblclick" handlers, then "dblclick" event fires twice "click"
                            .on("click", () => {

                                if (this.dblclickTimer) {
                                    clearTimeout(this.dblclickTimer);
                                    this.dblclickTimer = 0;
                                    alert("dblclick on " + actionType)

                                } else {
                                    this.dblclickTimer = setTimeout(() => {
                                        this.dblclickTimer = 0;
                                        alert("click on " + actionType)
                                    }, 250)
                                }
                            })
                            .on('contextmenu', contextMenu(menu))

                    })

                })


                .group(group)
                .valueAccessor(p => p.value.sum)
                .yAxis().ticks(4)
            // .gap(10)
            // .controlsUseVisibility(true)
            ;

            scrollChart
                .width(1200)
                .height(40)
                .margins({top: 0, right: 50, bottom: 20, left: 30})
                .dimension(dim)
                .group(group)
                .x(d3.scaleTime().domain([new Date("2019-04-05T18:00:00.000"), new Date("2019-04-05T18:10:00.000")]))
                .elasticY(true)
                .round(d3.timeMinute().round)
                .valueAccessor(p => p.value.sum)
                .alwaysUseRounding(true)
                .xUnits(d3.timeSeconds)
                .yAxis().ticks(0);

            if (!this.timeLineChart) {
                chart.render();
                scrollChart.render();
            } else {
                chart.redraw();
                scrollChart.redraw();
            }
            this.timeLineChart = chart;
            this.scrollChart = scrollChart;

            /*chart.selectAll("rect.bar").each(function (d) {
             let actionType = Object.values(d.data.value.objs)[0].name;

             d3.select(this)
             .style("width", 3)
             .style("fill", () => {
             switch (actionType) {
             case "startGame":
             return "aqua";
             case "kick":
             return "red";
             case "out":
             return "yellow";
             case "goal":
             return "green";
             case "pass":
             return "black";
             case "endGame":
             return "aqua";
             default :
             return "black"
             }
             })
             //if we'll use on "click" and on "dblclick" handlers, then "dblclick" event fires twice "click"
             .on("click", () => {

             if (this.dblclickTimer) {
             clearTimeout(this.dblclickTimer);
             this.dblclickTimer = 0;
             console.log("dblclick on " + actionType)

             } else {
             this.dblclickTimer = setTimeout(() => {
             this.dblclickTimer = 0;
             console.log("click on " + actionType)
             }, 250)
             }
             })
             // .on("dblclick", () => console.log("dblclick on " + actionType))
             // .style("color")

             debugger
             })*/

            // let chartBars = chart.selectAll("rect.bar").style("width", 3);

        }


        // chart.render()


        return [
            <div id="timeLineChart" key="timeLineChart"/>,
            <div id="scrollChart" key="scrollChart"/>
        ]
    }
}