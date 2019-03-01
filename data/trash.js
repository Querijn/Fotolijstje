function runTrash() {
	
function requestTrashInfo(onReceived) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			onReceived(JSON.parse(xhttp.responseText));
		}
	};
	xhttp.open("GET", "trash.json", true);
	xhttp.send();
}

let trashLine = new Querijn.Text("", {
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
trashLine.x = 300;
trashLine.y = 10;

var tickerAdded = false;
function trashFrame(time) {
	app.stage.addChild(trashLine);
}

function updateTrash() {
	requestTrashInfo(function (data) {

		let text = "";
		for (let i = 0; i < data; i++) {

			if (i !== 0) text += "\n";
			const trash = data[i];
			text += trash.summary;
		}

		// Somehow when you set text to "", it becomes " ", so I have to put it in another var.
		trashLine.text = text;
		
		if (!tickerAdded) {
			app.ticker.add(trashFrame);
			tickerAdded = true;
		}
	});

	setTimeout(updateTrash, 1000 * 60 * 20);
};

updateTrash();
}