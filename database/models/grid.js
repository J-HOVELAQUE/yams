var mongoose = require('mongoose');

const gridSchema = mongoose.Schema({

    name: String,
    AS: Number,
    DEUX: Number,
    TROIS: Number,
    QUATRE: Number,
    CINQ: Number,
    SIX: Number,
    maximum: Number,
    minimum: Number,
    total: Number,
    suite: Number,
    full: Number,
    carre: Number,
    yams: Number
});

var GridModel = mongoose.model('grid', gridSchema);

module.exports = GridModel;