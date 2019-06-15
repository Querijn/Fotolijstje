import Server from './server-app';
import * as Express from "express";
import * as fs from "fs-extra";

export default async function addImagesHandler(server: Server) {
	server.get('/images.json', (req: Express.Request, res: Express.Response) => {
		const files = fs.readdirSync("data/images/pictures");
		res.header("Content-Type", "application/json");
		res.send(JSON.stringify(files));
	})
}