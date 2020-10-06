// @TODO: YOUR CODE HERE!

var svgWidth = 1200;
var svgHeight = 660;

var margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100,
};
var primaryXAxis = "poverty";
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

var primaryXAxis = "poverty";
var primaryYAxis = "obesity";

console.log("primary yAxis", primaryYAxis);

function xScale(healthData, primaryXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, (d) => d[primaryXAxis]) * 0.9,
            d3.max(healthData, (d) => d[primaryXAxis]) * 1.1,
        ])
        .range([0, width]);
    console.log("within the function");
    return xLinearScale;
}

function yScale(healthData, primaryYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, (d) => d[primaryYAxis]) * 0.9,
            d3.max(healthData, (d) => d[primaryYAxis]) * 1.1,
        ])
        .range([height, 0]);

    return yLinearScale;
}

// var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(healthData, d => d.smokes), d3.max(healthData, d => d.smokes)])
//     .range([height, 0]);

//setup functions to update the xAxis and yAxis on click

function createXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function createYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles

function createXCircles(circlesGroup, newXScale, primaryXAxis, yLinearScale) {
    circlesGroup
        .transition()
        .duration(1000)
        .attr("transform", function(d) {
            console.log("primaryYAxis within create X circles", primaryYAxis)
            return "translate(" +
                newXScale(d[primaryXAxis]) +
                "," +
                yLinearScale(d[primaryYAxis]) + ")"
        })

    return circlesGroup;
}


function createYCircles(circlesGroup, newYScale, primaryYAxis, xLinearScale) {

    circlesGroup.transition()
        .duration(1000)
        .attr("transform", function(d) {
            console.log("primaryXAxis within create Y circles", primaryXAxis);
            return "translate(" + xLinearScale(d[primaryXAxis]) + "," +
                newYScale(d[primaryYAxis]) + ")"
        })


    return circlesGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(primaryXAxis, primaryYAxis, circlesGroup) {
    var xLabel;
    var yLabel;
    console.log("calling tooltip1");
    if (primaryXAxis === "poverty") {
        xLabel = "In Poverty (%):";
    } else if (primaryXAxis == "age") {
        xLabel = "Age (Media):";
    } else {
        xLabel = "Household Income (Median):";
    }

    if (primaryYAxis === "obesity") {
        yLabel = "Obesity(%):";
    } else if (primaryYAxis == "smokes") {
        yLabel = "Smokes(%):";
    } else {
        yLabel = "Lacks-Healthcare (%):";
    }
    console.log("calling tooltip2");
    console.log("primary yAxis", primaryYAxis);
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>
            ${xLabel} ${d[primaryXAxis]}<br>
            ${yLabel} ${d[primaryYAxis]}`);
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

        var xLinearScale = xScale(healthData, primaryXAxis)

        var yLinearScale = yScale(healthData, primaryYAxis)

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
        var circleRadius = 12

        var circlesGroup = chartGroup.append("g").selectAll("g")
            .data(healthData)
            .enter()
            .append("g")
            // .merge(circleContainer)
            .attr("transform", function(d) {
                console.log("d.poverty", d.abbr, d.poverty)
                return "translate(" + xLinearScale(d[primaryXAxis]) + "," + yLinearScale(d[primaryYAxis]) + ")"
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
        var circlesGroup = updateToolTip(primaryXAxis, primaryYAxis, circlesGroup);
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
                if (value !== primaryXAxis) {
                    console.log("value", value);
                    // replaces primaryXAxis with value
                    primaryXAxis = value;
                    console.log("primaryXAxis", primaryXAxis);
                    //console.log("xAxis", xAxis)

                    // functions here found above csv import
                    // updates x scale for new data
                    xLinearScale = xScale(healthData, primaryXAxis);
                    console.log("herer1")
                        // updates x axis with transition
                    xAxis = createXAxis(xLinearScale, xAxis);
                    console.log("herer2")
                        // updates circles with new x values
                    circlesGroup = createXCircles(circlesGroup, xLinearScale, primaryXAxis, yLinearScale);

                    console.log("primaryYAxis =", primaryYAxis);
                    // updates tooltips with new info
                    circlesGroup = updateToolTip(primaryXAxis, primaryYAxis, circlesGroup);
                    console.log("herer4");
                    // changes classes to change bold text
                    if (primaryXAxis === "poverty") {
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
                    } else if (primaryXAxis === "age") {
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
            if (value !== primaryYAxis) {
                console.log("value", value);
                // replaces primaryXAxis with value
                primaryYAxis = value;
                console.log("primaryYAxis", primaryYAxis);
                //console.log("xAxis", xAxis)

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(healthData, primaryYAxis);
                console.log("herer1");
                // updates x axis with transition
                yAxis = createYAxis(yLinearScale, yAxis);
                console.log("herer2");
                // updates circles with new x values
                circlesGroup = createYCircles(circlesGroup, yLinearScale, primaryYAxis, xLinearScale);

                console.log("primaryXAxis =", primaryXAxis);
                // updates tooltips with new info
                circlesGroup = updateToolTip(primaryXAxis, primaryYAxis, circlesGroup);
                console.log("herer4");
                // changes classes to change bold text
                if (primaryYAxis === "obesity") {
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
                } else if (primaryYAxis === "smokes") {
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