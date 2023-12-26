'use strict'
const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000;
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections ::${numConnection}`)
}

// check over load
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUse = process.memoryUsage().rss;
        //Example maximum number of connections baseed on number ofs cores
        const maxConnections = numCores * 5;
        console.log(`Active connections :: ${numConnection}`)
        console.log(`Memory usage:: ${memoryUse / 1024 / 1024} MB`)
        if (numConnection > maxConnections) {
            console.log(`Connections overload detected!`)
            //notify.send(....)
        }
    }, _SECONDS) //Monitor every 4 seconds
}
module.exports = {
    countConnect,
    checkOverload
}