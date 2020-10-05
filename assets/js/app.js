// @TODO: YOUR CODE HERE!

var svgWidth = 1200;
var svgHeight = 660;
console.log("Hi There?");
var margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100,
};
var chosenXAxis = "poverty";
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;


// x axes options
// In Poverty (%)
// Age (Media)
// Household Income (Median)

// y axes options
// Obesity(%)
// Smokes(%)
// Lacks-Healthcare (%)

// append svg and group
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


//setup functions to scale the x axis and y axis upon selection of axis

var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

console.log("chosen yAxis", chosenYAxis);

function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, (d) => d[chosenXAxis]) * 0.9,
            d3.max(healthData, (d) => d[chosenXAxis]) * 1.1,
        ])
        .range([0, width]);
    console.log("within the function");
    return xLinearScale;
}

function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, (d) => d[chosenYAxis]) * 0.9,
            d3.max(healthData, (d) => d[chosenYAxis]) * 1.1,
        ])
        .range([height, 0]);

    return yLinearScale;
}

// var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(healthData, d => d.smokes), d3.max(healthData, d => d.smokes)])
//     .range([height, 0]);

//setup functions to update the xAxis and yAxis on click

function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles

function renderXCircles(circlesGroup, newXScale, chosenXAxis, yLinearScale) {
    circlesGroup
        .transition()
        .duration(1000)
        .attr("transform", function(d) {
            console.log("chosenYAxis within render X circles", chosenYAxis)
            return "translate(" +
                newXScale(d[chosenXAxis]) +
                "," +
                yLinearScale(d[chosenYAxis]) + ")"
        })

    return circlesGroup;
}


function renderYCircles(circlesGroup, newYScale, chosenYAxis, xLinearScale) {

    circlesGroup.transition()
        .duration(1000)
        .attr("transform", function(d) {
            console.log("chosenXAxis within render Y circles", chosenXAxis);
            return "translate(" + xLinearScale(d[chosenXAxis]) + "," +
                newYScale(d[chosenYAxis]) + ")"
        })


    return circlesGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xLabel;
    var yLabel;
    console.log("calling tooltip1");
    if (chosenXAxis === "poverty") {
        xLabel = "In Poverty (%):";
    } else if (chosenXAxis == "age") {
        xLabel = "Age (Media):";
    } else {
        xLabel = "Household Income (Median):";
    }

    if (chosenYAxis === "obesity") {
        yLabel = "Obesity(%):";
    } else if (chosenYAxis == "smokes") {
        yLabel = "Smokes(%):";
    } else {
        yLabel = "Lacks-Healthcare (%):";
    }
    console.log("calling tooltip2");
    console.log("chosen yAxis", chosenYAxis);
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>
            ${xLabel} ${d[chosenXAxis]}<br>
            ${yLabel} ${d[chosenYAxis]}`);
        });
    console.log("calling tooltip3");

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

//  Import the data and start the promise

d3.csv("./assets/data/data.csv").then(function(healthData, err) {
        if (err) throw err;
        console.log("healthData", healthData);
        console.log([healthData]);

        //tidy data to make sure it is all numbers

        healthData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.povertyMoe = +data.povertyMo
            data.age = +data.age
            data.ageMoe = +data.ageMoe
            data.income = +data.income
            data.incomeMoe = +data.incomeMoe
            data.healthcare = +data.healthcare
            data.healthcareLow = +data.healthcareLow
            data.healthcareHigh = +data.healthcareHigh
            data.obesity = +data.obesity
            data.obesityLow = +data.obesityLow
            data.obesityHigh = +data.obesityHigh
            data.smokes = +data.smokes
            data.smokesLow = +data.smokesLow
            data.smokesHigh = +data.smokesHigh

        })
        console.log("check")
            // create x and y scales

        var xLinearScale = xScale(healthData, chosenXAxis)

        var yLinearScale = yScale(healthData, chosenYAxis)

        // Create axis functions
        console.log("check1")
        var bottomAxis = d3.axisBottom(xLinearScale);

        var leftAxis = d3.axisLeft(yLinearScale);

        //appending axes to the chart

        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        //create circles for data
        chartGroup.exit()
        var circleRadius = 15

        var circlesGroup = chartGroup.append("g").selectAll("g")
            .data(healthData)
            .enter()
            .append("g")
            // .merge(circleContainer)
            .attr("transform", function(d) {
                console.log("d.poverty", d.abbr, d.poverty)
                return "translate(" + xLinearScale(d[chosenXAxis]) + "," + yLinearScale(d[chosenYAxis]) + ")"
            });

        var circle = circlesGroup
            .append("circle")
            .attr("r", circleRadius)
            .classed("stateCircle", true);

        circlesGroup.append("text")
            .style("text-anchor", "middle")
            .classed("stateText", true)
            // .attr("dx", function(d){return -10})
            .attr("dy", function(d) { return circleRadius - 10 })
            .text((d) => d.abbr);

        // updateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        // Append axes titles
        //need to make groups for each of the sets of labels

        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)

        var povertyLabel = xLabelsGroup.append("text")
            // .attr("transform", `translate(${width / 2}, ${height + margin.top - 20})`)
            .classed("active", true)
            .attr("value", "poverty") // value to grab for event listener
            .text("In Poverty (%)");

        var ageLabel = xLabelsGroup.append("text")
            .attr("dy", "1.5em")
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

        var incomeLabel = xLabelsGroup.append("text")
            .attr("dy", "3em")
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income (Median)");

        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate( ${0 - margin.left + 70}, ${0 + height / 2} )` + " rotate(-90)")

        var obesityLabel = yLabelsGroup.append("text")
            .classed("active", true)
            .attr("value", "obesity") // value to grab for event listener
            .text("Obesity (%)");

        var smokesLabel = yLabelsGroup.append("text")
            .classed("inactive", true)
            .attr("value", "smokes") // value to grab for event listener
            .attr("dy", "-1.5em")
            .text("Smokes (%)");

        var healthcareLabel = yLabelsGroup.append("text")
            .classed("inactive", true)
            .attr("value", "healthcare") // value to grab for event listener
            .attr("dy", "-3em")
            .text("Lacks Healthcare (%)");
        console.log("code?");

        // make x-axis active and update all data based on selection and change look of axis
        xLabelsGroup.selectAll("text")
            .on("click", function() {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {
                    console.log("value", value);
                    // replaces chosenXAxis with value
                    chosenXAxis = value;
                    console.log("chosenXAxis", chosenXAxis);
                    //console.log("xAxis", xAxis)

                    // functions here found above csv import
                    // updates x scale for new data
                    xLinearScale = xScale(healthData, chosenXAxis);
                    console.log("herer1")
                        // updates x axis with transition
                    xAxis = renderXAxis(xLinearScale, xAxis);
                    console.log("herer2")
                        // updates circles with new x values
                    circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale);

                    console.log("chosenYAxis =", chosenYAxis);
                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                    console.log("herer4");
                    // changes classes to change bold text
                    if (chosenXAxis === "poverty") {
                        povertyLabel
                            .classed("active", true)
                            .classed("inactive", false)
                            .enter();
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    } else if (chosenXAxis === "age") {
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);

                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);

                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    } else {
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);

                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);

                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                }
            });

        // make y-axis active and update all data based on selection and change look of axis
        yLabelsGroup.selectAll("text").on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
                console.log("value", value);
                // replaces chosenXAxis with value
                chosenYAxis = value;
                console.log("chosenYAxis", chosenYAxis);
                //console.log("xAxis", xAxis)

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(healthData, chosenYAxis);
                console.log("herer1");
                // updates x axis with transition
                yAxis = renderYAxis(yLinearScale, yAxis);
                console.log("herer2");
                // updates circles with new x values
                circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis, xLinearScale);

                console.log("chosenXAxis =", chosenXAxis);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                console.log("herer4");
                // changes classes to change bold text
                if (chosenYAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false)
                        .enter();
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenYAxis === "smokes") {
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);

                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);

                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);

                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        });
    })
    .catch(function(error) {
        console.log(error);
    });