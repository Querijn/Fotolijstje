import Server from './server-app';
import addFrontPage from './front-page';

const server = new Server();

addFrontPage(server);

server.run();