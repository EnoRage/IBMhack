const restify = require('restify'),
 builder = require('botbuilder'),
 app = require('./appID.js');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var inMemoryStorage = new builder.MemoryBotStorage();

var connector = new builder.ChatConnector({
    appId: app.APP_ID,
    appPassword: app.PASSWORD
}); 

server.post('/api/messages', connector.listen());

module.exports.server = server;
module.exports.connector = connector;
module.exports.memory = inMemoryStorage;
module.exports.recognizer = recognizer;