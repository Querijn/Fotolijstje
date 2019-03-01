import Server from './server-app';
import addFrontPage from './front-page';
import addImagesHandler from './image-loader';
import addWeatherHandler from './weather-api';
import addTrashHandler from './trash-api';

const server = new Server();

addTrashHandler(server);
addWeatherHandler(server);
addImagesHandler(server);
addFrontPage(server);

server.run();