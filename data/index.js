const app = new PIXI.Application(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);
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
let photoSources = (async () => { 
	const request = await fetch("images.json");
	const images = await request.json();
	return images;
})();
const forward = { x: 0, y: 0 };
const moveAngle = (Math.random() - 0.5) * 45;
forward.x = Math.cos(moveAngle);
forward.y = Math.sin(moveAngle);

let timer = -1;
let curPhoto = 0;

app.ticker.add(function(time) {
    backgroundSprite.tilePosition.x += forward.x * PIXI.Ticker.shared.elapsedMS * 0.1;
	backgroundSprite.tilePosition.y += forward.y * PIXI.Ticker.shared.elapsedMS * 0.1;

	if (timer < 0 && photoSources) {
		addPhoto();
		timer = spawnDelay;
	}
	timer -= PIXI.Ticker.shared.elapsedMS;
});

async function addPhoto() {
	const isWaiting = !Array.isArray(photoSources);
	photoSources = isWaiting ? await photoSources : photoSources;
	shuffleArray(photoSources);

	const photoFile = photoSources[curPhoto];
	curPhoto = (curPhoto + 1) % (photoSources.length - 1);
	const photo = new Photo("images/" + photoFile);

	photo.onReady = () => {
		photo.run();
		console.log(photoFile + " was added!");
	}
	photos.push(photo);
}

class Photo {

	constructor(file) {
		this.file = file;
		this.ready = false;
		this.runner = this._update.bind(this);
		this.hasBeenOnScreen = false;
		this.isOnScreen = false;

		if (!Photo.resources || !Photo.resources[this.file])
			PIXI.Loader.shared.add(file, file).load(this._loader.bind(this));
		else setTimeout(() => this._loader(null, Photo.resources), 0);
	}
	
	run() {
		const randXOffset = Math.random() * app.renderer.width;
		const randYOffset = Math.random() * app.renderer.height;
		this.photo.position.x = randXOffset + placeDistance * -forward.x;
		this.photo.position.y = randYOffset + placeDistance * -forward.y;
		this.photo.angle = (Math.random() - 0.5) * 80;
		this.despawn = despawnDelay;

		app.stage.addChild(this.photo);
		app.ticker.add(this.runner);
	}

	_update() {
		this.photo.position.x += forward.x * PIXI.Ticker.shared.elapsedMS * 0.1;
		this.photo.position.y += forward.y * PIXI.Ticker.shared.elapsedMS * 0.1;

		this.despawn -= PIXI.Ticker.shared.elapsedMS;
		if (this.despawn < 0) {
			app.stage.removeChild(this.photo);

			const index = photos.indexOf(this);
			if (index !== -1) photos.splice(index, 1);
		}
	}

	_loader(loader, resources) {
		Photo.resources = resources;
		this.sprite = new PIXI.Sprite(resources[this.file].texture);
		const aspectRatio = this.sprite.width / this.sprite.height;
		
		this.photo = new PIXI.Graphics();
		this.photo.beginTextureFill(this._gradient('#FFFFFF', '#CFCFCF'));
		this.photo.drawRect(0, 0, 600, 600 / aspectRatio);


		this.sprite.x = this.photo.width * (1/16);
		this.sprite.y = this.photo.height * (1/16);

		this.sprite.width = this.photo.width * (7/8);
		this.sprite.height = this.photo.height - 200;
		this.photo.addChild(this.sprite);

		this.ready = true;
		if (this.onReady) this.onReady();
	}

	_gradient(from, to) {
		if (!this._texture) {
			const c = document.createElement("canvas");
			const ctx = c.getContext("2d");
			const grd = ctx.createLinearGradient(300, 0, 300, 300);
			grd.addColorStop(0, from);
			grd.addColorStop(1, to);
			ctx.fillStyle = grd;
			ctx.fillRect(0, 0, 600, 600);
			this._texture = new PIXI.Texture.from(c);
		}
		return this._texture;
	}
};

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

setTimeout(() => window.location.reload(), 1000 * 60 * 30); // 30 min