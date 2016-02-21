var margin = {top: 120, right: 120, bottom: 120, left: 120},
	width = 1500 - margin.right - margin.left,
	height = 1500 - margin.top - margin.bottom;

var i = 0,
	duration = 500,
	root;

var tree = d3.layout.tree()
			.size([height, width]);

// these are paths that connect parent and child nodes
var diagonal = d3.svg.diagonal()
			.projection(function (d) {
				return [d.x, d.y];
			});

var svg = d3.select('body')
			.append('svg')
			.attr('width', width + margin.right + margin.left)
			.attr('height', height + margin.top + margin.bottom)
			 .append('g')
			 .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

d3.json('data.json', function (error, data) {
	if (error) {
		throw error;
	}
	
	root = data;
	root.y0 = height / 2;
	root.x0 = 0;

	function collapse(d) {
		// Places the children of the node in a temporary variable. 
		// This is how the toggle visibility is implemented.
		if (d.children) {
			d._children = d.children;
			d._children.forEach(collapse);
			d.children = null;
		}
	}

	root.children.forEach(collapse);
	update(root);
});

d3.select(self.frameElement)
	.style('height', '1500px');

function update(source) {
	var nodes = tree.nodes(root)
				.reverse();

	// Links linking parent to child
	var links = tree.links(nodes);

	// spreading out the nodes 
	nodes.forEach(function (d) {
		d.y = d.depth * 180;
	});


	// attaching data to the nodes and giving each node an id
	var node = svg.selectAll('g.node')
				.data(nodes, function (d) {
					return d.id || (d.id = ++i);
				});

	// appending the nodes to the dom and adding a g element over it.
	// The g element helps with enabling interaction
	var nodeEnter = node.enter()	
				.append('g')
				.attr('class', 'node')
				.attr('transform', function (d) {
					// This makes it so that the g element is over the node by getting
					// the nodes x and y values and translating the g over to it.
					return 'translate(' + source.x0 + ', ' + source.y0 + ')';
				})
				.on('click', click);

	// Adds the circle elements for the nodes.
	nodeEnter.append('circle')
		.attr('r', 1e-6)
		.style('fill', function (d) {
			// changes the color if the node is clickable or not 
			return d._children ? '#A662A8' : '#fff';
		})
		.style('stroke', function (d) {
			return '#A662A8';
		});

	// Adds a label to the node
	nodeEnter.append("text")		
		.attr('y', function (d) {
			// Having a negative value puts the label above the circle
			return -10;
		})
		.attr('dy', '.35em')
		.attr('text-anchor', function (d) {
			return 'middle';
		})
		.text(function (d) {
			return d.name;
		})
		.style('fill', '#796360')
		.style('fill-opacity', 1e-6);

	// sets up the transition for seeing a nodes children.
	var nodeUpdate = node.transition()
		.duration(duration)
		.attr('transform', function (d) {
			return 'translate(' + d.x + ', ' + d.y + ')';
		});

	// Once a cicle that has children has been clicked the color is changed
	nodeUpdate.select('circle')
		.attr('r', 4.5)
		.style('fill', function (d) {
			return d._children ? '#A662A8' : '#fff';
		});

	nodeUpdate.select('text')
		.style('fill-opacity', 1);

	// Sets up the transition for closing a nodes children
	var nodeExit = node.exit()
		.transition()
		.duration(duration)
		.attr('transform', function (d) {
			return 'translate(' + source.x + ', ' + source.y + ')';
		})
		.remove();

	nodeExit.select('circle')
		.attr('r', 1e-6);

	nodeExit.select('text')
		.style('fill-opacity', 1e-6);

	var link = svg.selectAll('path.link')
		.data(links, function (d) {
			return d.target.id;
		});

	link.enter()
		.insert('path', 'g')
		.attr('class', 'link')
		.attr('d', function (d) {
			var o = {x: source.x0, y: source.y0};			
			return diagonal({source: o, target: o});
		})

	link.transition()
		.duration(duration)
		.attr('d', diagonal);

	link.exit()
		.transition()
		.duration(duration)
		.attr('d', function (d) {
			var o = {x: source.x, y: source.y};
			return diagonal({source: o, target: o});
		})
		.remove();

	nodes.forEach(function (d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});
}

// Controlls the interaction for the visualization. 
// This happens by moving the children of a parent to and from a temp variable.
// The tree layout is looking for 'children' variable to set up the layout so by 
// moving it to and from a temp variable we can move it in and out of the layout's view.
function click(d) {
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
	update(d);
}