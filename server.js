const restify = require('restify'),
 builder = require('botbuilder'),
 app = require('./appID.js');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var inMemoryStorage = new builder.MemoryBotStorage();

var connector = new builder.ChatConnector({
    appId: "57456c4d-6eb3-4bbe-b33d-98c81dbd5281",
    appPassword: "wxVCV0)[;bbktcGQIE7000("
}); 

server.post('/api/messages', connector.listen());

module.exports.server = server;
module.exports.connector = connector;
module.exports.memory = inMemoryStorage;