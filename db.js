const mongoose = require("mongoose"),
    app = require('./appID.js'),
Vote = require('./schemas/voteSchema.js'),
    Voter = require('./schemas/voterSchema.js'),
    User = require('./schemas/userSchema.js'),
    Organisation = require('./schemas/oraganisationSchema.js'),
    ObjectId = mongoose.Types.ObjectId;

mongoose.Promise = global.Promise;

const options = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 1000,
    bufferMaxEntries: 0
};
const db = mongoose.connect(app.DB_URL, options).then(console.log('Mongo DB works fine'));

var vote = {
    create: (description) => {
        Vote.create({
            description: description
        }, (err, doc) => {
            if (err) {
                console.log(err);
            }

            return;
        })
    },
    findOne: (organisation_id, callback) => {
        Vote.find({
            organisationID: organisation_id
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }

            callback(doc[0]);
        });
    },
    findAll: () => {
        Vote.find({}, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }

            callback(doc);
        });
    }
}

var voter = {
    doVote: (voteID, user_id, vote) => {
        Voter.create({
            voteID: voteID,
            userID: user_id,
            vote: vote
        }, (err, doc) => {
            if (err) {
                console.log(err);
            }

            return;
        })
    },
    findVoterByUserID: (userID, callback) => {
        Voter.find({
            userID: userID
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }

            callback(doc[0]);
        })
    },
    findVotersByVoteID: (voteID, callback) => {
        Voter.find({
            voteID: voteID
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }

            callback(doc);
        })
    }
}

var user = {
    create: (userID, nickname) => {
        User.create({
            userID: userID,
            name: {
                nickname: nickname
            }
        }, (err, doc) => {
            if (err) {
                console.log(err);
            }

            return;
        })
    },
    find: (userID, callback) => {
        User.find({
            userID: userID
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }

            callback(doc);
        })
    },
    balance: (userID, callback) => {
        User.find({userID: userID}, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }

            callback(doc[0].balance);
        })
    },
    addOrganisation: (userID, organisationID, sum) => {
        User.find({
            userID: userID
        }, (err, res) => {
            let organisations = res[0].organisations.slice();
            organisations.push({organisationID: organisationID, sum: Number(sum)});
            User.update({
                userID: userID
            }, {
                organisations: organisations
            }, (err, res) => {
                if (err) {
                    console.log(err);
                }

                return;
            })
        })
    },
    updateBalance: (userID, sum) => {
        User.find({userID: userID}, (err, doc) => {
            User.update({userID: userID}, {balance: doc[0].balance - Number(sum)}, (err, res) => {
                if (err) {
                    console.log(err);
                }

                return;
            })
        })
    }
}

var organisation = {
    findAll: (callback) => {
        Organisation.find({}, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }

            callback(doc);
        })
    },
    findOne: (organisationID, callback) => {
        Organisation.find({
            organisationID: Number(organisationID)
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return;
            }

            callback(doc[0]);
        })
    },
    create: (organisationID, name, foundateDate, capital, country, mission, balance) => {
        Organisation.create({
            organisationID: Number(organisationID),
            name: name,
            foundateDate: foundateDate,
            capital: Number(capital),
            country: country,
            mission: mission,
            balance: Number(balance)
        }, (err, doc) => {
            if (err) {
                console.log(err)
            }
            console.log(doc)
            return;
        })
    },
    updateBalance: (organisationID, sum) => {
        Organisation.find({organisationID: Number(organisationID)}, (err, doc) => {
            Organisation.update({organisationID: Number(organisationID)}, {balance: doc[0].balance + Number(sum)}, (err, res) => {
                if (err) {
                    console.log(err);
                }

                return;
            })
        })
    }
}

module.exports.vote = vote;
module.exports.user = user;
module.exports.voter = voter;
module.exports.organisation = organisation;