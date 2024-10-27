const routeObject = getRouteObject();
// Used to test on the web
window.userLocation = [40.71775244918452, -73.9990371376651]
window.iconFileLocations = getIconFileLocations()
const testing = document.getElementById('testing')
const busInput = document.getElementById('busApiKey')
const arrivalsContent = document.getElementById('arrivalsContent');
const arrivals = document.getElementById('arrivals');
const trainToShow = document.getElementById('trainToShow');
const northbound = document.getElementById('northbound');
const southbound = document.getElementById('southbound');
const northboundArrivals = document.getElementById('northboundArrivals');
const southboundArrivals = document.getElementById('southboundArrivals');
const alertsDropdown = document.getElementById('alertsDropdown');
const alertsContent = document.getElementById('alertsContent');
const trainIcons = document.getElementById('trainIcons')
const refreshArrivals = document.getElementById('refreshArrivals');
const stopnameElem = document.getElementById('stopname')
const lastRefreshed = document.getElementById('lastRefreshed')

const trainLinesWithIcons = ["1", "2", "3", "4", "5", "6", "6x", "7", "7x", "a", "b", "c", "d", "e", "f", "g", "h", "j", "l", "m", "n", "q", "r", "s", "sf", "sir", "sr", "t", "w", "z"].map((item) => { return item.toUpperCase() })
alertsDropdown.addEventListener("click", async () => {
    const alerts = await getTrainServiceAlerts(true, false);
    const lines = Object.keys(alerts);
    const text = Object.values(alerts);
    for (var i = 0; i < lines.length; i++) {
        const line = document.createElement('img');
        if (["FX", "6X", "7X"].includes(lines[i])) {
            continue;
        }
        let filepath = window.iconFileLocations[trainLinesWithIcons.indexOf(lines[i])]
        line.src = filepath;
        alertsContent.appendChild(line)
        const headerText = document.createElement('p');
        headerText.innerHTML = text[i]["headerText"];
        alertsContent.appendChild(headerText)
    }
    alertsContent.style.display = 'block';
})

const arrivalsX = document.getElementById('arrivalsX');
arrivalsX.addEventListener('click', () => {
    arrivals.className = 'removeAnimation'
    arrivals.style.display = 'none'
    setTimeout(() => {
        arrivals.className = ''
    }, 1000)
})


// Super inefficient function but works lol
// refreshArrivals.addEventListener('click', async () => {
//     const trainButtons = document.getElementsByClassName('trainButton')
//     var trainLine = '';
//     var trainLines = [];
//     for (var i = 0; i < trainButtons.length; i++) {
//         if (trainButtons[i].style.opacity == 0.5) {
//             // ./images/svg/n.svg
//             trainLine = trainButtons[i].src.slice(trainButtons[i].src.indexOf('svg/') +4, trainButtons[i].src.indexOf('.svg')).toUpperCase();
//             trainLines.push(trainButtons[i].innerText)
//         }
//     }
//     const targetStopID = stopnameElem.getAttribute('data-stop')
//     console.log(targetStopID)
//     const date = Date.now();
//     var direction = 'N';
//     for (var i = 0; i < options.length; i++) {
//         // If the option is selected by the user
//         if (options[i].style.backgroundColor != '') {
//             if (options[i].id == 'northbound') {
//                 direction = 'N';
//             } else {
//                 direction = 'S';
//             }
//         }
//     }
//     const feed = await getFeedData(trainLine);
//     const realtime = await getTrainArrivals(feed, trainLines, targetStopID, date, direction);
//     renderArrivals(realtime)
// })
refreshArrivals.addEventListener('click', async () => {
    lastRefreshed.innerText = "0 seconds ago";
    const trainButtons = document.getElementsByClassName('trainButton')
    for (var i = 0; i < trainButtons.length; i++) {
        if (trainButtons[i].style.opacity == 1) {
            trainButtons[i].click()
        }
    }
})

const options = document.getElementsByClassName('option');

for (var i = 0; i < options.length; i++) {
    // Pass in i to make sure it can access options[i]
    (function (i) {
        options[i].addEventListener('click', () => {
            if (options[i].id == 'northbound') {
                northboundArrivals.style.display = 'block';
                northbound.style.backgroundColor = 'rgba(0, 0, 0, 0.343)';
                southboundArrivals.style.display = 'none';
                southbound.style.backgroundColor = 'initial';
            } else {
                southboundArrivals.style.display = 'block';
                southbound.style.backgroundColor = 'rgba(0, 0, 0, 0.343)';
                northboundArrivals.style.display = 'none';
                northbound.style.backgroundColor = 'initial';
            }
        })
    })(i);
}

var map = L.map('map').setView(window.userLocation, 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 18,
}).addTo(map);
var markerLayer = L.layerGroup().addTo(map);

map.on('click', function (e) {
    // e.latlng contains the latitude and longitude of the click event
    var latitude = e.latlng.lat;
    var longitude = e.latlng.lng;
    // console.log("Map clicked at Latitude: " + latitude + ", Longitude: " + longitude);
    window.userLocation = [latitude, longitude]
    test()
    markerLayer.clearLayers();
});

function renderArrivals(realtime) {
    northboundArrivals.innerHTML = ''
    southboundArrivals.innerHTML = ''

    var northboundArrivalsArr = [];
    var southboundArrivalsArr = [];
    for (var i = 0; i < realtime.length; i++) {
        if (realtime[i]["direction"] == 'S') {
            southboundArrivalsArr.push(Number(realtime[i]["arrivalTime"]))
        } else {
            northboundArrivalsArr.push(Number(realtime[i]["arrivalTime"]))
        }
    }
    for (var i = 0; i < southboundArrivalsArr.length; i++) {
        const arrivalElement = document.createElement('div');
        arrivalElement.innerHTML = `In ${southboundArrivalsArr[i]} minute${southboundArrivalsArr[i] == 1 ? '' : 's'}`;
        southboundArrivals.appendChild(arrivalElement)
    }
    for (var i = 0; i < northboundArrivalsArr.length; i++) {
        const arrivalElement = document.createElement('div');
        arrivalElement.innerHTML = `In ${northboundArrivalsArr[i]} minute${northboundArrivalsArr[i] == 1 ? '' : 's'}`;
        northboundArrivals.appendChild(arrivalElement)
    }
}

async function test() {
    var trainLineShapes = await getTrainLineShapes(outputShapes());
    // var trainLineCoords = await getAllTrainStopCoordinates(outputStops());
    let allTrainStopCoordinates = await getAllTrainStopCoordinates(outputTrainStops());
    // console.log(processedTrainStopData)
    // const distance = 0.004;
    const distance = 0.01;
    var nearbyTrainLineCoords = await getNearbyStops(allTrainStopCoordinates, window.userLocation, distance);
    console.log(nearbyTrainLineCoords)
    // const latSpan = "0.005";
    // const lonSpan = "0";
    // const nearbyBusStopCoords = await getNearbyBusStops(exampleLocation, latSpan, lonSpan, busInput.value);
    // var nearbyBusStopCoords = await getNearbyStops(processedBusStopData, exampleLocation, 0.004);
    function renderTrainLineShapes() {
        // Render train shapes
        // console.log(trainLineShapes)
        let TLSKeys = Object.keys(trainLineShapes);
        let TLSVals = Object.values(trainLineShapes);
        for (var i = 0; i < TLSKeys.length; i++) {
            // console.log(Object.keys(trainLineShapes)[i])
            // console.log(TLSKeys[i])
            let currObj = TLSVals[i]
            let latlngs = currObj["layers"];
            let color = currObj["color"]
            if (color == "") {
                color = 'black';
            }
            let test = [];
            for (var z = 0; z < latlngs.length; z += 2) {
                test.push(latlngs[z])
            }
            var polyline = L.polyline(test, { color: color, smoothFactor: '1.00' }).addTo(map);
            map.addLayer(polyline);
            // map.fitBounds(polyline.getBounds());
        }
    }

    function renderMarkers(providedCoords) {
        // Render train coordinates
        let tLCVals = Object.values(providedCoords)
        let tlcKeys = Object.keys(providedCoords)
        // Last value is null
        for (var i = 0; i < tLCVals.length; i++) {
            // console.log(tLCVals[i])
            let latlng = tLCVals[i]["coordinates"];
            let stopname = tLCVals[i]["stopname"]
            let stopID = tlcKeys[i]
            let trainLines = tLCVals[i]["trainLine"]
            stopID = stopID.slice(0, stopID.length - 1)
            stopnameElem.innerText = stopname;
            stopnameElem.setAttribute('data-stop', stopID)
            // let marker = L.marker(latlng).addTo(map);
            // continue
            if (trainLines) {
                let splitTrainLines = trainLines.split('-');
                let iconHTML = '';
                // const trainLinesWithIcons = ["1", "2", "3", "4", "5", "6", "6x", "7", "7x", "a", "b", "c", "d", "e", "f", "g", "h", "j", "l", "m", "n", "q", "r", "s", "sf", "sir", "sr", "t", "w", "z"].map((item) => { return item.toUpperCase() })
                let decrement = 0;
                for (var j = 0; j < splitTrainLines.length; j++) {
                    // console.log(splitTrainLines[j])
                    if (["FX", "6X", "7X"].includes(splitTrainLines[j])) {
                        // Make sure to put j-- to make sure the train images don't go to far to the left
                        decrement += 1;
                        continue;
                    }
                    // let filepath = './images/svg/' + splitTrainLines[j] + '.svg';
                    // Basically, window.iconFileLocations is ordered the same with trainLinesWithIcons so just get the index of the train line based on the train lines which are found in stops.txt
                    let filepath = window.iconFileLocations[trainLinesWithIcons.indexOf(splitTrainLines[j])]
                    // iconHTML += '<img src="' + filepath + '/' + splitTrainLines[j] + '.svg"' + ' style="position: absolute; width: 20px; height: 20px; left: ' + j * 20 + 'px;">';
                    iconHTML += '<img src="' + filepath + '" style="position: absolute; width: 20px; height: 20px; left: ' + (j - decrement) * 20 + 'px;">';
                    // console.log('<img src="' + filepath + ' style="position: absolute; width: 20px; height: 20px; left: ' + j * 20 + 'px;">')
                }
                var customIcon = L.divIcon({
                    className: 'custom-icon',
                    // Doing this because if you use a tick backslash it will break it in webviewcontent.js
                    html: [
                        '<div style="position: relative; width: 40px; height: 20px;">',
                        String(iconHTML),
                        '<div style="position: absolute; top: 20px; left: 0; width: 100%; text-align: center; font-size: 12px;">',
                        String(stopname),
                        '</div>',
                        '</div>'].join('\n'),
                    iconSize: [5, 5] // Adjust the size as needed
                });
                let marker = L.marker(latlng, { icon: customIcon }).addTo(markerLayer);
                // doesn't matter which train line - they are all grouped together
                // console.log(trainLines)
                marker.on('click', async function (stopID, stopname, trainLines, northboundArrivals, southboundArrivals, trainLinesWithIcons) {
                    const targetStopID = stopID
                    const direction = ""
                    const date = Date.now()
                    const feed = await getFeedData(trainLines[0]);
                    window.lastRefreshed = Date.now();
                    lastRefreshed.innerText = '0 seconds';
                    const realtime = await getTrainArrivals(feed, trainLines[0], targetStopID, date, direction);
                    // If realtime returns nothing, then that means the station isn't being served or there is an error
                    if (realtime.length == 0) {
                        alert(`The ${trainLines} aren't running at this station right now. Please check the service alerts to learn more.`);
                        return;
                    }
                    arrivals.style.display = 'block';
                    var trainButtons = document.createElement('div');
                    var trainButtonArr = [];
                    for (var z = 0; z < trainLines.length; z++) {
                        var trainButton = document.createElement('img');
                        trainButton.className = 'trainButton'
                        if (z != 0) {
                            trainButton.style.opacity = '0.5';
                        } else {
                            trainToShow.innerText = trainLines[z]
                        }
                        trainButton.src = window.iconFileLocations[trainLinesWithIcons.indexOf(trainLines[z])];
                        trainButtons.appendChild(trainButton)
                        trainButtonArr.push(trainButton)
                    }
                    trainIcons.innerHTML = '';
                    trainIcons.appendChild(trainButtons);

                    for (var i = 0; i < trainButtonArr.length; i++) {
                        // Pass in i to make sure it can access options[i]
                        (function (i, trainLines) {
                            trainButtonArr[i].addEventListener('click', async () => {
                                for (var t = 0; t < trainButtonArr.length; t++) {
                                    if (t == i) {
                                        trainButtonArr[t].style.opacity = '1';
                                    } else {
                                        trainButtonArr[t].style.opacity = '0.5';
                                    }
                                }
                                // Use the same feed but different train line
                                trainToShow.innerText = trainLines[i]
                                stopname.innerText = stopname;
                                const feed2 = await getFeedData(trainLines[i]);
                                window.lastRefreshed = Date.now();
                                const realtime2 = await getTrainArrivals(feed2, trainLines[i], targetStopID, date, direction);
                                renderArrivals(realtime2)
                            })
                        })(i, trainLines);
                    }
                    renderArrivals(realtime)
                }.bind(null, stopID, stopname, trainLines.split('-'), northboundArrivals, southboundArrivals, trainLinesWithIcons));
            } else {
                // console.log(stopname)
                var busIcon = L.icon({
                    iconUrl: './busSvgs/' + 'Bx1' + '.svg',
                    iconSize: [0, 0],
                    iconAnchor: [22, 94],
                    popupAnchor: [-3, -76],
                    // shadowUrl: 'my-icon-shadow.png',
                    // shadowSize: [68, 95],
                    // shadowAnchor: [22, 94]
                });
                marker = L.marker(latlng, { icon: busIcon }).addTo(markerLayer);
            }
            // marker.bindTooltip(stopname)
        }
    }

    renderTrainLineShapes();
    renderMarkers(nearbyTrainLineCoords);
    // renderMarkers(nearbyBusStopCoords);
    L.circle(window.userLocation, { radius: 200 }).addTo(markerLayer);
}

// busInput.addEventListener('change', async () => {
//     test();
// })
setTimeout(test, 500)

setInterval(() => {
    console.log(arrivals.style.display)
    if (arrivals.style.display == 'block') {
        const seconds = ((Date.now() - window.lastRefreshed) / 1000).toFixed(0);
        if (seconds >= 60) {
            lastRefreshed.innerText = (seconds / 60).toFixed(0) + " minutes ago";
        } else {
            lastRefreshed.innerText = seconds + " seconds ago";
        }
    }
}, 10000)