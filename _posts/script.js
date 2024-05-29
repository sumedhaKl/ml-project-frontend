const apiBaseURL = 'https://passportgroup.stu.nighthawkcodingsociety.com';

function submitData() {
    const dataEntry = document.getElementById('data-entry').value.trim();
    const analysisType = document.getElementById('analysis-type').value;

    if (!dataEntry) {
        alert('Please enter your data.');
        return;
    }

    const rows = dataEntry.split('\n').map(row => row.split(',').map(Number));
    const data = rows.map((row, index) => {
        const obj = {};
        row.forEach((value, idx) => {
            obj[`feature${idx + 1}`] = value;
        });
        return obj;
    });

    fetch(`${apiBaseURL}/statistics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, analysis_type: analysisType })
    })
    .then(response => response.json())
    .then(data => {
        if (analysisType === 'summary_statistics') {
            document.getElementById('summary-statistics').innerText = JSON.stringify(data.summary_statistics, null, 2);
        } else if (analysisType === 'linear_regression') {
            document.getElementById('linear-regression').innerText = JSON.stringify(data.linear_regression, null, 2);
            plotRegressionGraph(data.linear_regression);
        } else if (analysisType === 'box_plot') {
            plotBoxPlot(data.box_plot);
        }
    })
    .catch(error => console.error('Error:', error));
}

function sortData() {
    const dataEntry = document.getElementById('data-entry').value.trim();
    const column = document.getElementById('sort-column').value;
    const ascending = document.getElementById('sort-order').value === 'true';

    if (!dataEntry) {
        alert('Please enter your data.');
        return;
    }

    const rows = dataEntry.split('\n').map(row => row.split(',').map(Number));
    const data = rows.map((row, index) => {
        const obj = {};
        row.forEach((value, idx) => {
            obj[`feature${idx + 1}`] = value;
        });
        return obj;
    });

    fetch(`${apiBaseURL}/sort-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, column, ascending })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('sorted-data').innerText = JSON.stringify(data.sorted_data, null, 2);
    })
    .catch(error => console.error('Error:', error));
}

function searchData() {
    const dataEntry = document.getElementById('data-entry').value.trim();
    const column = document.getElementById('search-column').value;
    const value = document.getElementById('search-value').value;

    if (!dataEntry) {
        alert('Please enter your data.');
        return;
    }

    const rows = dataEntry.split('\n').map(row => row.split(',').map(Number));
    const data = rows.map((row, index) => {
        const obj = {};
        row.forEach((value, idx) => {
            obj[`feature${idx + 1}`] = value;
        });
        return obj;
    });

    fetch(`${apiBaseURL}/search-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, column, value })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('searched-data').innerText = JSON.stringify(data.searched_data, null, 2);
    })
    .catch(error => console.error('Error:', error));
}

function plotRegressionGraph(regressionData) {
    const dataPoints = regressionData.data_points;
    const regressionLine = regressionData.regression_line;
    const features = regressionData.features;

    const trace1 = {
        x: features.map(f => f[0]),
        y: dataPoints,
        mode: 'markers',
        name: 'Data Points'
    };

    const trace2 = {
        x: features.map(f => f[0]),
        y: regressionLine,
        mode: 'lines',
        name: 'Regression Line'
    };

    const layout = {
        title: 'Linear Regression',
        xaxis: { title: 'Feature' },
        yaxis: { title: 'Target' }
    };

    Plotly.newPlot('regression-graph', [trace1, trace2], layout);
}

function plotBoxPlot(boxPlotData) {
    const data = Object.keys(boxPlotData).map(key => ({
        y: boxPlotData[key],
        type: 'box',
        name: key
    }));

    const layout = {
        title: 'Box Plot'
    };

    Plotly.newPlot('box-plot', data, layout);
}
