import Input from './Input.js';

var textInput;
window.onload = ()=>{
	textInput = new Input(document.querySelector('#translationTextField'), document.querySelector('#translationTextSubmit'), createGraph);
};

var createGraph = (data) => {
	var graphElement = document.querySelector('#translationGraph');
	var existingGraph = graphElement.querySelector('svg');
	graphElement.classList.add('open');
	if(existingGraph){
		graphElement.removeChild(existingGraph);
	}
	for(let sourceLabel of [...document.querySelectorAll(".sourceLanguageLabel")]){
		sourceLabel.innerHTML = data.sourceLangName;
	}
	var binsize = .3;
	var minbin = (data.translations[0].width/data.sourceWidth);
	var maxbin = (data.translations[data.translations.length - 1].width/data.sourceWidth);
	var numbins = Math.ceil((maxbin - minbin) / binsize);

	var availableWidth = window.innerWidth*.6;
	var availableHeight = window.innerHeight*.6;

	var binmargin = .05; 
	var margin = {top: 10, right: 30, bottom: 50, left: 60};
	var width = availableWidth - margin.left - margin.right;
	var height = availableHeight - margin.top - margin.bottom-100;

	// Set the limits of the x axis
	var xmin = minbin - .2 ? minbin - .2 : minbin;
	var xmax = maxbin + .2;

	var histdata = new Array(numbins);
	for (var i = 0; i < numbins; i++) {
		histdata[i] = { numlangs : 0, langs: [], meta: ""};
	}

	// Fill histdata with y-axis values and meta data
	for (let d of data.translations){
		var bin = Math.floor(((d.width/data.sourceWidth) - minbin) / binsize);
		if ((bin.toString() != "NaN") && (bin < histdata.length)) {
			histdata[bin].numlangs += 1;
			histdata[bin].meta += "<tr><td>" + d.langName +
				"</td><td>" + 
				(d.width/data.sourceWidth).toFixed(2) + "x</td></tr>";
			histdata[bin].langs.push(d.language);
		}
	};

	let count = 0;
	let sourceBar = histdata.length;
	let numLess = 0;
	let numGreater = 0;
	for(let bar of histdata){
		if (bar.langs.indexOf(data.sourceLang) >= 0){
			sourceBar = count;
			document.querySelector('#langCompareEqual').innerHTML = Math.floor(bar.langs.length/data.translations.length*100) + "%"
		}else{
			if (count > sourceBar){
				numGreater += bar.langs.length;
			}else{
				numLess += bar.langs.length;
			}
		}
		count++;
	}
	document.querySelector('#langCompareLess').innerHTML = Math.floor(numLess/data.translations.length*100) + '%';
	document.querySelector('#langCompareGreater').innerHTML = Math.floor(numGreater/data.translations.length*100) + '%';


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
	var svg = d3.select("#translationGraph").insert("svg", '.translation-output__stats')
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("class", "translation-output__graph")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + 
						margin.top + ")");

	svg.call(tip);

	// set up the bars
	var bar = svg.selectAll(".translation-output__bar")
		.data(histdata)
		.enter().append("g")
		.attr("class", function(d, i){
			let baseClass = "translation-output__bar";
			if (d.langs.indexOf(data.sourceLang) >= 0){
				return baseClass+' '+baseClass+'--source';
			}else{
				return baseClass;
			}
		})
		.attr("transform", function(d, i) { return "translate(" + 
			 x2(i * binsize + minbin) + "," + y(d.numlangs) + ")"; })
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	// add rectangles of correct size at correct location
	bar.append("rect")
		.attr("x", x(binmargin))
		.attr("width", x(binsize - .2 * binmargin))
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
		.attr("y", height + margin.bottom-10)
		.text("Translated Width as Multiple of Source Width");

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