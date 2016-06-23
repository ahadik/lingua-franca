import Input from './Input.js';

var textInput;
window.onload = ()=>{
	textInput = new Input(document.querySelector('#translationTextField'), document.querySelector('#translationTextSubmit'), createGraph);
};

var createGraph = (data) => {

	document.querySelector('#translationGraph').classList.add('open');

	var binsize = 2;
	var minbin = 0;
	var maxbin = 100;
	var numbins = (maxbin - minbin) / binsize;

	// whitespace on either side of the bars in units of MPG
	var binmargin = .2; 
	var margin = {top: 10, right: 30, bottom: 50, left: 60};
	var width = 450 - margin.left - margin.right;
	var height = 250 - margin.top - margin.bottom;

	// Set the limits of the x axis
	var xmin = minbin - 1
	var xmax = maxbin + 1

	var histdata = new Array(numbins);
	for (var i = 0; i < numbins; i++) {
		histdata[i] = { numlangs: 0, meta: "" };
	}

	// Fill histdata with y-axis values and meta data
	for (let d of data.translations){
		var bin = Math.floor((d.width - minbin) / binsize);
		if ((bin.toString() != "NaN") && (bin < histdata.length)) {
			histdata[bin].numlangs += 1;
			histdata[bin].meta += "<tr><td>" + d.langName +
				"</td><td>" + 
				d.width + " pixels</td></tr>";
		}
	};

	// This scale is for determining the widths of the histogram bars
	// Must start at 0 or else x(binsize a.k.a dx) will be negative
	var x = d3.scale.linear()
		.domain([0, (xmax - xmin)])
		.range([0, width]);

	// Scale for the placement of the bars
	var x2 = d3.scale.linear()
		.domain([xmin, xmax])
		.range([0, width]);
	
	var y = d3.scale.linear()
		.domain([0, d3.max(histdata, function(d) { 
						return d.numlangs; 
						})])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x2)
		.orient("bottom");
	var yAxis = d3.svg.axis()
		.scale(y)
		.ticks(8)
		.orient("left");

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.direction('e')
		.offset([0, 20])
		.html(function(d) {
		return '<table id="tiptable">' + d.meta + "</table>";
	});

	// put the graph in the "mpg" div
	var svg = d3.select("#translationGraph").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + 
						margin.top + ")");

	svg.call(tip);

	// set up the bars
	var bar = svg.selectAll(".bar")
		.data(histdata)
		.enter().append("g")
		.attr("class", "bar")
		.attr("transform", function(d, i) { return "translate(" + 
			 x2(i * binsize + minbin) + "," + y(d.numlangs) + ")"; })
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	// add rectangles of correct size at correct location
	bar.append("rect")
		.attr("x", x(binmargin))
		.attr("width", x(binsize - 2 * binmargin))
		.attr("height", function(d) { return height - y(d.numlangs); });

	// add the x axis and x-label
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
	svg.append("text")
		.attr("class", "xlabel")
		.attr("text-anchor", "middle")
		.attr("x", width / 2)
		.attr("y", height + margin.bottom)
		.text("Width in Pixels");

	// add the y axis and y-label
	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(0,0)")
		.call(yAxis);
	svg.append("text")
		.attr("class", "ylabel")
		.attr("y", 0 - margin.left) // x and y switched due to rotation
		.attr("x", 0 - (height / 2))
		.attr("dy", "1em")
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "middle")
		.text("# of languages");
}