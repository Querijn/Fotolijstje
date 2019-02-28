import Server from './server-app';
import * as Express from "express";
import * as path from "path";
import * as fs from "fs-extra";

export default async function addFrontPage(server: Server) {
	server.get('*', (req: Express.Request, res: Express.Response) => {
		if (req.url == '/') req.url = "/index.html";
		req.url = decodeURI(req.url.substr(1)).replace(/[\/]/g, "")

		const resultPath = path.join(__dirname, "..", "data", req.url);

		if (fs.existsSync(resultPath)) {
			res.status(200).sendFile(resultPath);
			return;
		}

		res.status(404).send("???");
	})
}