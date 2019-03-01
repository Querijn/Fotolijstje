function runTrash() {
const months = [ "januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december" ];

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

		let text = "Afval:\n";
		let done = {};
		let dates = [];
		
		for (let i = 0; i < data.length; i++) {
			const trash = data[i];
			const date = new Date(trash.start);
			data[i].actualDate = date;

			const today = new Date();
			today.setHours(0,0,0,0);
			if (date < today)
				continue;

			if (done[trash.summary])
				continue;
			done[trash.summary] = true;

			dates.push(trash);
		}
		
		dates.sort(function(a, b){
			return a.actualDate - b.actualDate;
		});

		let first = true;
		for (let i = 0; i < dates.length; i++) {

			if (!first) text += "\n";
			else first = false;
			
			const trash = dates[i];
			const date = trash.actualDate;
			text += trash.summary + ": " + date.getDate() + " " + months[date.getMonth()];
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