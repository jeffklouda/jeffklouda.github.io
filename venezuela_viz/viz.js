// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 100, bottom: 30, left: 100},
    width = 800 - margin.left - margin.right,
    height = 725 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%y-%b").parse;
var formatDate = d3.time.format("%b %Y");

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(3);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(4);

var milestones = {
        "17-Mar":"Decline in price of oil, which accounts for 96% of Venezuelan exports, causes decline of oil production. Government policies favor paying off debt over social welfare programs, causing citizens to suffer. (1)",
        "17-Nov":"The government raises wages and prints more bolivars in an effort to make up for the increasing price of foreign goods. This creates a recipe for further inflation. (2)",
        "18-May":"Nicolás Maduro is reelected as president in an election not recognized by more than 60 nations, creating desperation in citizens. (3)",
        "18-Oct":"85% of essential medicines are scarce - citizens are only able to find 1.5 out of every 10 medications they need. (4)",
        "19-Jan":"Maduro is inaugurated for his second term. Juan Guaido, a lawmaker, assumes leadership of the opposition. Guaido swears himself in as interim president. He is recognized as the country's legitimate president by the U.S, Canada, and Brazil, among other countries. (3)",
        "19-Feb":"Maduro shuts Venezuela's border with Colombia to block U.S. sponsored attempts to deliver humanitarian aid because of the U.S.'s recognition of Guaido as president. (5)",
        "19-Apr":"U.S. implements sanctions against the Central Bank of Venezuela, cutting off the access to U.S. currency and limiting the ability to conduct international transactions, in order to put more pressure on Maduro's regime. (6)",
        "19-Jun":"Minimum wage is worth $5.43 a month, which can only purchase 2.8% of the basic food basket for a family of five. (4)"
};

var departments = [
    "Antioquia",
    "Atlantico",
    "Bogota",
    "Boyaca",
    "Bolivar",
    "Caldas",
    "Caqueta",
    "Cauca",
    "Cesar",
    "Cordoba",
    "Cundinamarca",
    "Choco",
    "Huila",
    "LaGuajira",
    "Magdalena",
    "Meta",
    "Narino",
    "NorteDeSantander",
    "Quindio",
    "Risaralda",
    "Santander",
    "Sucre",
    "Tolima",
    "ValleDelCauca"
]

var departmentMap = {
    Antioquia:"Antioquia",
    Atlantico:"Atlántico",
    Bogota:"Bogotá",
    Boyaca:"Boyacá",
    Bolivar:"Bolívar",
    Caldas:"Caldas",
    Caqueta:"Caquetá",
    Cauca:"Cauca",
    Cesar:"Cesar",
    Cordoba:"Córdoba",
    Cundinamarca:"Cundinamarca",
    Choco:"Chocó",
    Huila:"Huila",
    LaGuajira:"La Guajira",
    Magdalena:"Magdalena",
    Meta:"Meta",
    Narino:"Nariño",
    NorteDeSantander:"Norte de Santander",
    Quindio:"Quindío",
    Risaralda:"Risaralda",
    Santander:"Santander",
    Sucre:"Sucre",
    Tolima:"Tolima",
    ValleDelCauca:"Valle del Cauca"
};

// Define the lines
var valuelines = {};

valuelines["Antioquia"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Antioquia); });

valuelines["Atlantico"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Atlantico); });

valuelines["Bogota"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Bogota); });

valuelines["Boyaca"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Boyaca); });

valuelines["Bolivar"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Bolivar); });

valuelines["Caldas"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Caldas); });

valuelines["Caqueta"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Caqueta); });

valuelines["Cauca"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Cauca); });

valuelines["Cesar"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Cesar); });

valuelines["Cordoba"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Cordoba); });

valuelines["Cundinamarca"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Cundinamarca); });

valuelines["Choco"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Choco); });

valuelines["Huila"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Huila); });

valuelines["LaGuajira"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.LaGuajira); });

valuelines["Magdalena"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Magdalena); });

valuelines["Meta"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Meta); });

valuelines["Narino"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Narino); });

valuelines["NorteDeSantander"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.NorteDeSantander); });

valuelines["Quindio"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Quindio); });

valuelines["Risaralda"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Risaralda); });

valuelines["Santander"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Santander); });

valuelines["Sucre"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Sucre); });

valuelines["Tolima"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Tolima); });

valuelines["ValleDelCauca"] = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.ValleDelCauca); });

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Adds the svg canvas
var svg = d3.select("#viz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
var dSelector = {};
for (var i = 0; i < departments.length; i++) {
    dSelector[departments[i]] = true;
}

var justSet = false;

d3.select("#map-selector").on("click", function(d) {
    if (toggler && !justSet) {
        toggler = false;
        showAll();
    }
    justSet = false;
});

var maxValue = 0;

var toggler = false;

var intro = d3.select("#intro_slide");

window.setTimeout(function() {
    updateData(false);
    intro
        .transition()
        .duration(2000)
        .style("opacity", 0);
}, 2000);

window.setTimeout(function() {
    intro.remove();
}, 4000);

for (var i = 0; i < departments.length; i++) {
    d3.select(("#" + departments[i])).on("mouseover", function(d) {
        if (!toggler) {
            var dept = this.id;
            singleDepartment(dept);
        }
    })
    .on("mouseout", function(d) {
        if (!toggler) {
            showAll();
        }
    })
    .on("click", function(d){
        var dept = this.id;
        if (toggler) {
            showAll();
        } else {
            singleDepartment(dept);
            justSet=true;
            toggler = true;
        }
    });
}

function showAll() {
    for (var i = 0; i < departments.length; i++) {
        dSelector[departments[i]] = true;
    }
    updateData(false);
}

function singleDepartment(dept) {
    for (var i = 0; i < departments.length; i++) {
        dSelector[departments[i]] = false;
    }
    dSelector[dept] = true;
    updateData(true);
}

// Get the data
function updateData(solo) {

    svg.selectAll("*").remove();
    var yMax = 0;

    d3.csv("data.csv", function(error, data) {
        data.forEach(function(d) {
            d.Date = parseDate(d.Date);
            for (var i = 0; i < departments.length; i++) {
                if (dSelector[departments[i]]) {
                    d[departments[i]] = +d[departments[i]];
                    var m = d3.max(data, function(d){ return d[departments[i]] });
                    if (m > maxValue) maxValue = m;
                    if (m > yMax) yMax = m;
                }
            }
        });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.Date; }));
    y.domain([0, yMax*1.1]);

    addMilestones();
    var paths = [];

    /*for (var i = 0; i < departments.length; i++) {
        addLine(paths, data, valuelines[departments[i]], d3.max(data, function(d) { return d[departments[i]]; }), maxValue, ("#"+departments[i]));
    }*/

    for (var i = 0; i < departments.length; i++) {
        if (dSelector[departments[i]]) {
            addLine(paths, data, valuelines[departments[i]], d3.max(data, function(d) { return d[departments[i]]; }), maxValue, ("#" + departments[i]));
        } else {
            d3.select(("#" + departments[i]))
                .transition()
                .duration(250)
                .style("fill", "#BBBBBB");
        }
    }

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("fill", "#999")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("fill", "#999")
        .call(yAxis);

    svg.append("text")
      .attr("transform", "rotate(90)")
      .attr("y", - width - (margin.left / 3))
      .attr("x",0 + (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#999")
      .text("Number of Venezuelan Migrants");

    d3.selectAll('g.tick')
    .select('line')
    .style('stroke', "#BBBBBB");

    var maxArea = 5000;

    // Add interactive functionality
    for (var i = 0; i < departments.length; i++) {
        if (dSelector[departments[i]]) {
            svg.selectAll("dot")
                .data(data)
            .enter().append("circle")
                .attr("r", 2)
                .attr("department", departments[i])
                .style("fill", d3.interpolatePlasma(1 - (d3.max(data, function(d) { return d[departments[i]]; })/maxValue)))
                .style("stroke-width", 1.7)
                .attr("cx", function(d) { return x(d.Date); })
                .attr("cy", function(d) { return y(d[departments[i]]); })
                .on("mouseover", function(d) {
                    var dept = this.attributes.department.nodeValue;
                    var cArea = maxArea*(d[dept]/maxValue);
                    var cr = getRadiusFromArea(cArea);
                    svg.append("circle")
                        .attr("r", cr)
                        .style("fill", d3.interpolatePlasma(1 - (d3.max(data, function(d) { return d[dept]; })/maxValue)))
                        .style("opacity", 0)
                        .attr("cx", this.cx.baseVal.valueAsString)
                        .attr("cy", this.cy.baseVal.valueAsString)
                        .on("mouseout", function(d) {
                            div.transition()
                                .duration(200)
                                .style("opacity", 0);
                            this.remove();
                        })
                        .on("click", function(d) {
                            if (!toggler) {
                                singleDepartment(dept);
                            } else {
                                showAll(false);
                            }
                            toggler = !toggler;
                            div.transition()
                                .duration(200)
                                .style("opacity", 0);
                        })
                        .transition()
                        .duration(200)
                        .style("opacity", .5);
                    div.transition()
                        .duration(200)
                        .style("opacity", 1);
                    div
                        .html("<p><b>" + departmentMap[dept] + "</b><br>" + formatDate(d.Date) + "<br>" + d[dept].toLocaleString() + "</p>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 22 + cr) + "px");
                })
        }
    }
})};

function addLine(paths, data, line, localMax, max, id) {
    // Add the valueline path
    var deptColor = d3.interpolatePlasma(1 - localMax/max);
    paths.push(svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", deptColor)
        .attr("d", line));
    d3.select(id)
        .transition()
        .duration(750)
        .style("fill", deptColor);
}

function getRadiusFromArea(area) {
    return Math.sqrt(area/3.14);
}

function addMilestones() {
    var numDots = 40;
    for (let date in milestones) {
        for (var i = 0; i < numDots; i++) {
            svg.append("line")
                .attr("x1", x(parseDate(date)))
                .attr("y1", (height))
                .attr("x2", x(parseDate(date)))
                .attr("y2", (height-margin.top - margin.bottom) * 0.1)
                .attr("mDate", date)
                .style("stroke-width", 2)
                .style("stroke", "#EEEEEE")
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", 1);
                    if (this.x1.baseVal.value < width/2) {
                        div.html("<p><b>" + formatDate(parseDate(this.attributes.mDate.value)) + "</b><br>" + milestones[this.attributes.mDate.value] + "</p>")
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    } else {
                        div.html("<p><b>" + formatDate(parseDate(this.attributes.mDate.value)) + "</b><br>" + milestones[this.attributes.mDate.value] + "</p>")
                            .style("left", (d3.event.pageX - 250) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    }
                })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", 0);
                });
            }
    }
}
