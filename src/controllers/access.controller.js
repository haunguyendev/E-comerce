'use strict'

const AccessService = require("../services/access.service")
const { CREATED, OK } = require('../core/success.response')


class AccessController {
    signUp = async (req, res, next) => {


        // console.log(`[P]::signUp::`, req.body)
        new CREATED({
            message: "Sign Up Success",
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            }
        }).send(res)



    }
}

module.exports = new AccessController()