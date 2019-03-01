function requestWeather(onReceived) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			onReceived(JSON.parse(xhttp.responseText));
		}
	};
	xhttp.open("GET", "weather.json", true);
	xhttp.send();
}

const loader = new PIXI.loaders.Loader();
let weatherLine = new Querijn.Text("", {
	fontFamily: 'Arial', 
	fontSize: 18,
	fill: 0xffffff, 
	align: 'left',
	dropShadow: true,
	dropShadowAngle: 0,
	dropShadowBlur: 10,
	dropShadowColor: "black",
	dropShadowDistance: 0
});
weatherLine.x = weatherLine.y = 10;

let weatherIcons = {
	zonnig: null,
	bliksem: null,
	regen: null,
	buien: null,
	hagel: null,
	mist: null,
	sneeuw: null,
	bewolkt: null,
	halfbewolkt: null,
	zwaarbewolkt: null,
	nachtmist: null,
	helderenacht: null,
	wolkennacht: null,
};

for (let iconName in weatherIcons) 
	loader.add(iconName, 'images/icons/' + iconName + '.png');
loader.load(setupWeatherIcons);

function setupWeatherIcons(loader, resources) {
	for (let iconName in weatherIcons) {
		weatherIcons[iconName] = Querijn.Text.addImage(resources[iconName].texture);
		// console.log("Loaded weather icon for " + iconName);
	}

	updateWeather();
}

var tickerAdded = false;
function weatherFrame(time) {
	app.stage.addChild(weatherLine);
}

function updateWeather() {
	requestWeather(function (data) {

		let text = "";
		for (let i = 0; i < data.liveweer.length; i++) {

			if (i !== 0) text += "\n";
			const weather = data.liveweer[i];

			text += weather.plaats + ":\n";
			text += "nu " + weather.temp + " °C, voelt als " + weather.gtemp + " °C\n";
			text += "vandaag " + weatherIcons[weather.d0weer] + " " + weather.d0tmin + "~" + weather.d0tmax + " °C\n";
			text += "morgen " + weatherIcons[weather.d1weer] + " " + weather.d1tmin + "~" + weather.d1tmax + " °C\n";
		}

		// Somehow when you set text to "", it becomes " ", so I have to put it in another var.
		weatherLine.text = text;
		
		if (!tickerAdded) {
			app.ticker.add(weatherFrame);
			tickerAdded = true;
		}
	});

	setTimeout(updateWeather, 1000 * 60 * 20);
};