// Wrapped in an updateGraph function.
function updateGraph(time) {
  $('#pageviews-chart').empty();
var date = new Date();
var hour = date.getHours();
var minute = date.getMinutes();
// Filter out an array with the users in past 60 minutes
function filter(data) {
  // this gives you an array of tuples where the first element is the hour, second element is the minute and the last element is the # of users
  var result = data.rows.map(
    function(elem) {
      return [elem[0], elem[1], elem[2]]
    })

  var minute = date.getMinutes();
  var x = [];

  // sort result by hour and minute in ascending order
  result.sort(function(a, b) {
    var n = a[0] - b[0];
    if(n !== 0) {
      return n;
    }
    return parseInt(a[1]) - parseInt(b[1]);
  });

  // push number of pageviews in the past 60 minutes to an array
  // Since the proxy is delayed, we are taking the data from a 60 minute time frame
  // which ends at 10 minutes prior to current time
  // ie: if it is 6:20pm, we take data in an array from  [5:10pm to 6:10pm]
  var counter = 0;
  var counter2 = 0;
  var subtractHour1 = 0;
  var subtractHour2 = 0;

  if(minute < 10) {
    subtractHour1 = subtractHour1 + 2;
    subtractHour2++;
  } else {
    counter = minute - 10;
    subtractHour1++;
  }


  for(var i = 0; i < result.length; i++) {
    // reset counter after 60 min mark
    if(counter == 59) {
      counter = 0;
    }
    // Fixed the filter function. This was causing the data points to disappear.
    if((result[i][0] == (hour-subtractHour1)) && (result[i][1] >= counter) || result[i][0] == hour-subtractHour2) {
      if(counter2 >= 60) {
        break;
      }
      x.push(Number(result[i][2]));
      counter++;
      counter2++;
    }
  }
  // filtered array in past hour
  return x;
}

var request = $.ajax({
  type: 'GET',
  url: ENDPOINTS.pageviews.hour,
  dataType: 'jsonp',
  //This only triggers if the ajax call was successful
  //TODO: Define failure case
  success: function(data) {
    drawGraph(data);
  }
});


function formatMinute(data) {
  // start time range from
  var temp = data + minute - 10;
  if(temp < 0) {
    temp = 60 + temp;
  }
  if(temp > 60) {
    temp = temp - 60;
    if(temp < 10) {
      temp = "0" + temp;
    }
    return temp;
  }
  return temp;
}


function formatHour(data) {
  var temp = data + minute - 10;
  var tempHour = hour;
  // If hour is negative, we are taking a time range starting from 2 hours prior to
  // current hour
  if(temp < 0) {
    tempHour--;
  }
  if(temp < 60) {
    return tempHour - 1;
  } else {
    return tempHour;
  }
}


function drawGraph(reply){
  console.log('Here is the data from the ajax call')
  console.log(reply)
  console.log('now we can filter it!')
  var yData = filter(reply)
  var xData = []
  console.log(yData)
  console.log('and use it to draw the graph.')



  for (var i = 0; i < yData.length; i++) {
    xData.push(i);
  }

  var width = $('#pageviews-chart').width(),
      height = $('#pageviews-chart').height();

  var data = [ { label: "",
                 x: xData,
                 y: yData }, ] ;

  var xy_chart = d3_xy_chart()
      .width(width)
      .height(height)

  var svg = d3.select("#pageviews-chart").append("svg")
      .datum(data)
      .call(xy_chart) ;

  function d3_xy_chart() {
      var width = width,
          height = height,
          xlabel = "X Axis Label",
          ylabel = "Y Axis Label" ;

      function chart(selection) {
          selection.each(function(datasets) {
              //
              // Create the plot.
              //
              var margin = {top: 20, right: 80, bottom: 30, left: 50},
                  innerwidth = width - margin.left - margin.right,
                  innerheight = height - margin.top - margin.bottom ;


              var x_scale = d3.scale.linear()
                  .range([0, innerwidth])
                  .domain([ d3.min(datasets, function(d) { return d3.min(d.x); }),
                            d3.max(datasets, function(d) { return d3.max(d.x); }) ]) ;

              var y_scale = d3.scale.linear()
                  .range([innerheight, 0])
                  .domain([ d3.min(datasets, function(d) { return 0; }),
                            d3.max(datasets, function(d) { return d3.max(d.y); }) ]) ;

              var color_scale = d3.scale.category10()
                  .domain(d3.range(datasets.length)) ;


              var x_axis = d3.svg.axis()
                  .scale(x_scale)
                  .orient("bottom")
                  .tickFormat(function(d) { return formatHour(d) + ':' + formatMinute(d); })

              var y_axis = d3.svg.axis()
                  .scale(y_scale)
                  .orient("left")
                  .ticks(8)
                  .tickSize(-width);

              var area = d3.svg.area()
                  .x(function(d) { return x_scale(d[0]); })
                  .y0(height - 50)
                  .y1(function(d) { return y_scale(d[1]); });

              var draw_line = d3.svg.line()
                  .interpolate("linear")
                  .x(function(d) { return x_scale(d[0]); })
                  .y(function(d) { return y_scale(d[1]); }) ;


              var svg = d3.select(this)
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

              var data_lines = svg.selectAll(".d3_xy_chart_line")
                  .data(datasets.map(function(d) {return d3.zip(d.x, d.y);}))
                  .enter().append("g")
                  .attr("class", "d3_xy_chart_line") ;

                  svg.append("g")
                      .attr("class", "y axis")
                      .call(y_axis)
                      .append("text")
                      .attr("transform", "rotate(-g90)")
                      .attr("y", 6)


              data_lines.append("path")
                  .attr("class", "line")
                  .attr("d", function(d) {return draw_line(d); })
                  .attr("stroke", function(_, i) {return color_scale(i);}) ;


              data_lines.append("path")
                  .attr("class", "area")
                  .attr("d", area);


                  var data_circles = svg.selectAll(".d3_xy_chart_circle")
                    .data(d3.zip(datasets[0].x, datasets[0].y))
                      .enter().append("circle")
                      .attr("r", 5)
                      .attr("class", "d3_xy_chart_circle")
                      .attr("cx", function(d) { return x_scale(d[0]) })
                      .attr("cy", function(d) { return y_scale(d[1]) })


              svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + (height - 45) + ")")
                  .style("fill", "red")
                  .call(x_axis)
                  .append("text")
                  .attr("x", 6)


              data_lines.append("text")
                  .datum(function(d, i) { return {name: datasets[i].label, final: d[d.length-1]}; })
                  .attr("transform", function(d) {
                      return ( "translate(" + x_scale(d.final[0]) + "," +
                               y_scale(d.final[1]) + ")" ) ; })
                  .attr("x", 3)
                  .attr("dy", ".35em")
                  .attr("fill", function(_, i) { return color_scale(i); })
                  .text(function(d) { return d.name; }) ;



          }) ;
      }

      chart.width = function(value) {
          if (!arguments.length) return width;
          width = value;
          return chart;
      };

      chart.height = function(value) {
          if (!arguments.length) return height;
          height = value;
          return chart;
      };

      chart.xlabel = function(value) {
          if(!arguments.length) return xlabel ;
          xlabel = value ;
          return chart ;
      } ;

      chart.ylabel = function(value) {
          if(!arguments.length) return ylabel ;
          ylabel = value ;
          return chart ;
      } ;

      return chart;
  }

}

}

// Updates every 5 seconds. This function can be called in index.js for final copy.
// $(document).ready(function() {
//   updateGraph();
// setInterval(updateGraph, 50000);
// });

function updateTimePeriod(time) {
  switch(time) {
    case "hour":
      return "day";
    case "day":
      return "week";
    case "week":
      return "hour";
  }
}

// Updates every 5 seconds. This function can be called in index.js for final copy.
$(document).ready(function() {
  var time = "week";
  updateGraph(time);
  setInterval(function() {
    updateData(time);
  }, 15000);

  updateClock();
  setInterval(updateClock, 1000);

  setInterval(function() {
    time = updateTimePeriod(time);
  }, 15000);
});
