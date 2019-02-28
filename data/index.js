const app = new PIXI.Application(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);
const renderResize = app.screen.height / 1440;
const maxWidth = 1/8;
const maxHeight = 1/8;
const placeDistance = Math.max(app.screen.width, app.screen.height) * 1.1;
const spawnDelay = 7000;
const despawnDelay = 45000;

const backgroundImage = PIXI.Texture.from('background.jpg');
const backgroundSprite = new PIXI.TilingSprite(backgroundImage, app.screen.width, app.screen.height);
backgroundSprite.tileScale.x = 1.5;
backgroundSprite.tileScale.y = 1.5;
app.stage.addChild(backgroundSprite);

const photos = [];
let photoSources = null;
const forward = { x: 0, y: 0 };
const moveAngle = (Math.random() - 0.5) * 45 * 0.0174532925;
forward.x = Math.cos(moveAngle);
forward.y = Math.sin(moveAngle);

let timer = -1;
let curPhoto = 0;

app.ticker.add(function(time) {
    backgroundSprite.tilePosition.x += forward.x * PIXI.ticker.shared.elapsedMS * 0.1;
	backgroundSprite.tilePosition.y += forward.y * PIXI.ticker.shared.elapsedMS * 0.1;

	if (timer < 0 && photoSources) {
		addPhoto();
		timer = spawnDelay;
	}
	timer -= PIXI.ticker.shared.elapsedMS;
});

function addPhoto() {
	const photoFile = photoSources[curPhoto];
	curPhoto = (curPhoto + 1) % (photoSources.length - 1);
	const photo = new Photo("images/" + photoFile);

	photo.onReady = function() {
		photo.run();
		console.log(photoFile + " was added!");
	};
	photos.push(photo);
}

function Photo(file) {

	this.file = file;
	this.ready = false;
	this.runner = this._update.bind(this);
	this.hasBeenOnScreen = false;
	this.isOnScreen = false;

	if (!Photo.resources || !Photo.resources[this.file])
		PIXI.loader.add(file, file).load(this._loader.bind(this));
	else setTimeout(this._loader.bind(this, null, Photo.resources), 0);
};
		
Photo.prototype.run  = function() {
		const randXOffset = Math.random() * app.renderer.width;
		const randYOffset = Math.random() * app.renderer.height;
		this.photo.position.x = randXOffset + placeDistance * -forward.x;
		this.photo.position.y = randYOffset + placeDistance * -forward.y;
		this.photo.rotation = (Math.random() - 0.5) * 80 * 0.0174532925;
		this.despawn = despawnDelay;

		app.stage.addChild(this.photo);
		app.ticker.add(this.runner);
	}

Photo.prototype._update = function() {
	this.photo.position.x += forward.x * PIXI.ticker.shared.elapsedMS * 0.1;
	this.photo.position.y += forward.y * PIXI.ticker.shared.elapsedMS * 0.1;

	this.despawn -= PIXI.ticker.shared.elapsedMS;
	if (this.despawn < 0) {
		app.stage.removeChild(this.photo);

		const index = photos.indexOf(this);
		if (index !== -1) photos.splice(index, 1);
	}
}

Photo.prototype._loader = function(loader, resources) {
	Photo.resources = resources;
	this.sprite = new PIXI.Sprite(resources[this.file].texture);
	const aspectRatio = this.sprite.width / this.sprite.height;
	
	this.photo = new PIXI.Graphics();
	this.photo.beginFill(0xFFFFFF);
	this.photo.drawRect(0, 0, renderResize * 600, renderResize * (600 / aspectRatio));


	this.sprite.x = this.photo.width * (1/16);
	this.sprite.y = this.photo.height * (1/16);

	this.sprite.width = this.photo.width * (7/8);
	this.sprite.height = this.photo.height - renderResize * 200;
	this.photo.addChild(this.sprite);

	this.ready = true;
	if (this.onReady) this.onReady();
}

// TODO
window.addEventListener("resize", function() {
	app.renderer.resize(window.innerWidth, window.innerHeight);
	app.view.style.width = window.innerWidth;
	app.view.style.height = window.innerHeight;
	backgroundSprite.width = window.innerWidth;
	backgroundSprite.height = window.innerHeight;
	
});

function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

setTimeout(window.location.reload, 1000 * 60 * 30); // 30 min

let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       photoSources = JSON.parse(this.responseText);
    }
};
xhttp.open("GET", "images.json", true);
xhttp.send();