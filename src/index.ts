import Server from './server-app';
import addFrontPage from './front-page';
import addImagesHandler from './image-loader';
import addWeatherHandler from './weather-api';

const server = new Server();

addWeatherHandler(server);
addImagesHandler(server);
addFrontPage(server);

server.run();