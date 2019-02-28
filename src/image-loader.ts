import Server from './server-app';
import * as Express from "express";
import * as path from "path";
import * as fs from "fs-extra";

export default async function addImagesHandler(server: Server) {
	server.get('/images.json', (req: Express.Request, res: Express.Response) => {
		const files = fs.readdirSync("data/images");
		res.header("Content-Type", "application/json");
		res.send(JSON.stringify(files));
	})
}