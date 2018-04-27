
const Server = require("./server.js"),
    db = require("./db.js"),
    rp = require('request-promise');


var bot = new builder.UniversalBot(Server.connector, [
    function (session) {
        console.log('lol')
        session.beginDialog('start');
    }
]).set('storage', Server.memory);

bot.dialog("start", [
    (session, args, next) => {
        console.log('Works fine');
    }
]);