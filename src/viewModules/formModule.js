import * as d3 from 'd3';

var formModule = function(data){


			var t = d3.transition()
	    					.duration(750)
								.ease(d3.easeLinear);

			var form = d3.select("#putFormHere");

			form.html('');//clear out the form

			form = d3.select("#putFormHere");
				form.attr('class','form-inline');
					// .attr('z-index',9999);

			var top = form.append('text')
					.text('Complete the form and press Submit')
					.attr('id','topOfForm');

			var p = form.selectAll("div")

					.data(data)
					.enter()
					.append('div')
					.attr('class','form-group')
					// .append("p")
					.each(function(d){
							var self = d3.select(this);

							var label = self.append("label")
									.text(d.display)
									.transition(t)
									.attr('class',"wrapper-dropdown-label")
									.attr('class',"var-labels")
									// .attr('class','label')
									// .attr('class','label-default')

							if(d.type == 'text'){
									var input = self.append("input")
											.attr({
													type: function(d){ return d.type; },
													name: function(d){ return d.name; }
											});
							}

							if(d.type == 'dropdown'){
							var select = self.append("select")
											.attr("name", "country")
											.attr("id",d.code)
											.attr('class',"wrapper-dropdown-inside")
											.attr('class',"form-control-lg")
											.attr('class',"var-drops")
											.selectAll("option")
											.data(d.values)
											.enter()
											.append("option")
											.text(function(d) { return d; });
							}

							if(d.type == 'checkbox'){
							var inputbox = self.append("input")
								.attr("type","radio")
								.attr("id",d.code)
							}

					});


	}

export default formModule;
