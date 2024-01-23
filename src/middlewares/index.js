'use strict';

const Logger = require('../loggers/discord.log.lv2')

const pushToLogDiscord = async (req, res, next) => {
    try {
        Logger.sendToFormatCode({
            title: `Mothod::${req.method}`,
            code: req.method == 'GET' ? req.query : req.body,
            message: `${req.get('host')}${req.originalUrl}`,


        })
        return next()
    } catch (err) {
        next(err)

    }
}

module.exports = {
    pushToLogDiscord
}