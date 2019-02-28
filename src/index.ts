import Server from './server-app';
import addFrontPage from './front-page';
import addImagesHandler from './image-loader';

const server = new Server();

addImagesHandler(server);
addFrontPage(server);

server.run();