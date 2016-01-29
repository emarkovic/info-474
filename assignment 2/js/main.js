
$(function () {
	generate(1, 'I feel good about myself', [
		['Technical', 30.95, 54.76, 14.29, 0, 0],
		['Homemaker', 34.13, 55.99, 5.09, 1.20, 3.59],
		['Sales', 27.14, 62.86, 7.14, 1.43, 1.43]
	]);

	generate(2, 'I feel I am a person of worth, the equal of other people', [
		['Technical', 28.57, 66.67, 4.76, 0, 0],
		['Homemaker', 32.93, 55.99, 6.59, 0.60, 3.89],
		['Sales', 27.14, 61.49, 4.29, 4.28, 2.86]
	]);

	generate(3, 'On the whole, I am satisfied with myself', [
		['Technical', 45.83, 54.76, 19.05, 0, 0],
		['Homemaker', 27.84, 53.59, 10.5, 3.59, 4.19],
		['Sales', 31.34, 51.43, 11.43, 2.86, 2.86]
	]);

	generate(4, 'I dont have enough control over the direction my life is taking', [
		['Technical', 4.76, 14.29, 59.52, 21.43, 0],
		['Homemaker', 5.39, 16.17, 50.9, 23.65, 3.89],
		['Sales', 0, 12.86, 64.29, 21.43, 1.43]
	]);

	generate(5, 'I certainly feel useless at times', [
		['Technical', 11.9, 42.86, 38.1, 7.14, 0],
		['Homemaker', 5.99, 38.32, 37.72, 13.17, 4.79],
		['Sales', 5.71, 44.29, 34.29, 12.86, 2.86]
	]);

	generate(6, 'I feel I do not have much to be proud of', [
		['Technical', 0, 9.52, 64.29, 45.83, 0],
		['Homemaker', 3.59, 11.98, 43.41, 35.93, 5.09],
		['Sales', 1.43, 10, 47.14, 38.57, 2.86]
	]);

	generate(7, 'I feel emotionally empty most of the time', [
		['Technical', 7.14, 19.05, 57.14, 16.67],
		['Homemaker', 4.79, 11.98, 47.9, 31.14, 4.19],
		['Sales', 0, 15.71, 52.86, 27.14, 4.29]
	]);
	function generate(num, question, data) {
		$('#title' + num).text(question);
		c3.generate({
			bindto: '#chart' + num,
			data: {
				columns: data,
				type: 'bar'
			},
			axis: {
				x: {
					type: 'category',
					categories: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree', 'Missing']
				}
			},
			tooltip: {
		    	show: false
		    }
		});
	}

	function graph() {		
		$.getJSON('data/data.json')
			.done(function (json) {
				var data = [];
				var count = 0;
				json.forEach(function (obj) {
					var tuple = _.values(obj);
					tuple[0] = 'num' + count;
					count++;
					data.push(tuple);
				});			
				createVis(data);
			});
	}
	
	function createVis(data) {
		$('#title').text('Occuptation of mom: service');
		c3.generate({
		    bindto: '#chart',
		    data: {
		      columns: data
		    },
		    axis: {
		    	x: {
		    		type: 'category',
		    		categories: questions
		    	},
		    	y: {
		    		min: 0,
		    		max: 5,
		    		tick: {
		    			format: function (d) {
		    				switch (d) {
		    					case 0:
		    						return 'Multiple Responses'
		    					case 1:
		    						return 'Missing'
		    					case 2:
		    						return 'Strongly Disagree'
		    					case 3:
		    						return 'Disagree'
		    					case 4:
		    						return 'Agree'
		    					case 5: 
		    						return 'Strongly Agree'
		    				}
		    			}
		    		}
		    	}
		    },
		    legend: {
		    	show: false
		    },
		    tooltip: {
		    	show: false
		    }
		});			
	}
});


