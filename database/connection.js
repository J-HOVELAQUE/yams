const mongoose = require('mongoose');
// const config = require('config');

// const keyConfig = config.get('password.db');

// console.log('NODE_ENV:', process.env.NODE_ENV);


var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// console.log("TEST CONFIG:", keyConfig);

async function connection() {
    await mongoose.connect('mongodb+srv://yams:yams@lacapsule.fd7ap.mongodb.net/yams?retryWrites=true&w=majority',
        options
    );
    console.info('*** Database connection: Success ***');
}

module.exports = connection;