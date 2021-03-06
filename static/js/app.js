function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  // Use `.html("") to clear any existing metadata
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  var Metadata = `/metadata/${sample}`;
  
  d3.json(Metadata).then(function(response){
  var panelData = d3.select("#sample-metadata");
  
    
  panelData.html("");

    
  var data = Object.entries(response);

  data.forEach(function(item) {
  panelData.append("div").text(item);
  });
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleData = `/samples/${sample}`;
    // @TODO: Build a Bubble Chart using the sample data
    d3.json(sampleData).then(function(response){
    var otuIDs = response.otu_ids;
    var sampleValues = response.sample_values;
    var otuLabels = response.otu_labels;
   
    var trace = {
        x: otuIDs,
        y: sampleValues,
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: sampleValues,
            color: otuIDs,
            colorscale: 'Rainbow',
        },
        text: otuLabels
    }

  
    var data = [trace]

    var layout = {
      height: 600,
      width: 600,
    }

    Plotly.newPlot("bubble", data)
  })

// @TODO: Build a Pie Chart
// HINT: You will need to use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).
 
 d3.json(sampleData).then(function(response){
   var topTenOtuIds = response.otu_ids.slice(0,10);
   var topOtuLabels = response.otu_labels.slice(0,10);
   var topTenSampleValues = response.sample_values.slice(0,10);

   var data = [{
     labels: topTenOtuIds,
     values: topTenSampleValues,
     hovertext: topOtuLabels,
     type: "pie"
   }];

   var layout = {
     height:600,
     width:600
   };
   
 Plotly.newPlot("pie", data, layout);


})
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
