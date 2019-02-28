import * as Express from "express";
import http = require('http');
import https = require('https');
import GreenLock = require('greenlock-express');

const prod = false;
let approvedDomains = ['guesswhat.irule.at'];

export default class ServerApp {
	public app: Express.Application;

	private httpsServer: https.Server;
	private httpServer: http.Server;

	constructor() {
		const url = `https://acme${!prod ? "-staging" : ""}-v02.api.letsencrypt.org/directory`;
		console.log(`Using url ${url}`);

		console.log(`Creating express..`);
		this.app = Express();

		if (!prod) approvedDomains.push('localhost');
		console.log(`Creating GreenLock..`);
		const greenlock = GreenLock.create({
			version: 'draft-11',
			server: url,
			email: 'querijn@irule.at',
			agreeTos: true,
			approveDomains: approvedDomains,
			configDir: `config${prod ? "Prod" : "Staging"}`,
			
			debug: !prod
		});

		console.log(`Running http/https servers..`);
		this.httpsServer = https.createServer(greenlock.tlsOptions, this.app);
		this.httpServer = http.createServer(greenlock.middleware(this.app));
	}

	get(pattern: string, ...handlers: Express.RequestHandler[]): void {
		this.app.get(pattern, ...handlers);
	}
	
	run() {
		console.log(`Running!`);
		this.httpServer.listen(80);
		this.httpsServer.listen(443);
	}
}