import Server from './server-app';
import * as Express from "express";
import getConfig from './config'

const ical = require('ical');
const config = getConfig().trash;

let lastQueryTime: number = 0;
let lastQuery = "";

export default async function addTrashHandler(server: Server) {
	server.get('/trash.json', async(req: Express.Request, res: Express.Response) => {

		res.header("Content-Type", "application/json");

		let currentTime = (new Date()).getTime();
		let diff = currentTime - lastQueryTime;
		if (diff < config.cacheAge) {
			const json = JSON.parse(lastQuery);
			json.cacheAge = diff / config.cacheAge;
			res.send(JSON.stringify(json));
			return;
		}

		ical.fromURL(config.url, {}, function(err: any, data: any) {
			
			lastQuery = JSON.stringify(Object.values(data));
			lastQueryTime = currentTime;
			res.send(lastQuery);
		});
	});
}