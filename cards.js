const builder = require('botbuilder');

function voteCard(session, msg, voteID) {
    return new builder.ReceiptCard(session)
        .title(msg)
        .facts([

        ])
        .items([])
        .buttons([
            builder.CardAction.imBack(session, 'vote_1'+voteID, 'Да'),
            builder.CardAction.imBack(session, 'vote_0'+voteID, 'Нет'),
        ]);
};

module.exports.voteCard = voteCard;

