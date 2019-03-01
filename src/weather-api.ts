import Server from './server-app';
import * as Express from "express";
import * as path from "path";
import * as fs from "fs-extra";
import fetch from "node-fetch";
import getConfig from './config'

const config = getConfig().weather;

let lastQueryTime: number = 0;
let lastQuery = "";

export default async function addWeatherHandler(server: Server) {
	server.get('/weather.json', async(req: Express.Request, res: Express.Response) => {

		res.header("Content-Type", "application/json");
		let currentTime = (new Date()).getTime();
		let diff = currentTime - lastQueryTime;
		if (diff < config.cacheAge) {
			const json = JSON.parse(lastQuery);
			json.cacheAge = diff / config.cacheAge;
			res.send(JSON.stringify(json));
			return;
		}

		const requestUrl = `http://weerlive.nl/api/json-data-10min.php?key=${config.key}&locatie=${config.town}`;
		const request = await fetch(requestUrl);
		lastQuery = await request.text();
		lastQueryTime = currentTime;
		res.send(lastQuery);
	})
}
