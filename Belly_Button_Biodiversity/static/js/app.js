function buildMetadata(sample) {
  var metaUrl= `/metadata/${sample}`
  d3.json(metaUrl).then(function(data) {
  // Use d3 to select the panel with id of `#sample-metadata`
  var metadata = d3.select("#sample-metadata");
  // @TODO: Complete the following function that builds the metadata panel
  // First Use `d3.json` to fetch the metadata for a sample
    // Use `.html("") to clear any existing metadata
    metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      metadata.append("h6").text(`${key}: ${value}`);
    });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    });
  };

 // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  var sampleURL = `/samples/${sample}`;
  
  d3.json(sampleURL).then((sample) => {
    console.log(sample);
    var data = [];
    var color = [];
    for (var i=0; i<sample.otu_ids.length; i++) {
    data.push({'id': sample.otu_ids[i], 'label': sample.otu_labels[i], 'value': sample.sample_values[i]});
    color.push(i*2);
    }
    
    data.sort(function(a, b){return b.value-a.value})
    var slicedData= data.slice(0, 10);
    console.log(slicedData);
   

    // @TODO: Build a Pie Chart
    var pieTrace = {"labels": slicedData.map(sd=>sd.id),
                  "values": slicedData.map(sd => sd.value),
                  "type": "pie",
                  "hovertext": slicedData.map(sd=>sd.label),
    };
    
    var pieData =[pieTrace];
    Plotly.newPlot("pie", pieData);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
     // @TODO: Build a Bubble Chart using the sample data
    console.log(color)

     var bubbleTrace = {
      x: sample.otu_ids,
      y: sample.sample_values,
      mode: "markers",
      text: sample.otu_labels,
      marker: {
        color: color,
        size: sample.sample_values
      }
    };

    var layout = {
      xaxis: {title: 'OTU ID'},
      yaxis: {title: '# of specimens found'},
      showlegend: false,
    };

    var bubbleData = [bubbleTrace]
    Plotly.newPlot("bubble", bubbleData, layout)
  
  });
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
