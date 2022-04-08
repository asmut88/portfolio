//**Connect the express, destination - wrapper over nodeJS
const express = require('express')
//**Connect the config, destination - storing constants
const config = require('config')
//**Connect the mongoose, destination - working with the MongoDB
const mongoose = require('mongoose')

//**Create app
const app = express()

//**Let's set the connection parameters
const PORT = config.get('port') || 5000
const DBURI = config.get('mongoUri')

//**Endpoint routes
app.use('/api/auth', require('./routes/auth.routes'))

async function start() {
    try{
        await mongoose.createConnection(DBURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`App has been started ${PORT}...`))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()

