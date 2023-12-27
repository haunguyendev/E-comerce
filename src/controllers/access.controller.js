'use strict'

const AccessService = require("../services/access.service")
const { CREATED, OK, SuccessResponse } = require('../core/success.response')


class AccessController {

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout successfully!',
            metadata: await AccessService.logout(req.keyStore)

        }).send(res);

    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)

        }).send(res);

    }



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