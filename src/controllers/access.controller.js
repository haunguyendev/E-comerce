'use strict'

const AccessService = require("../services/access.service")
const { CREATED, OK, SuccessResponse } = require('../core/success.response')


class AccessController {


    handlerRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Get token success!',
        //     metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)

        // }).send(res);

        //v2 fixed, no need accessToken
        new SuccessResponse({
            message: 'Get token success!',
            metadata: await AccessService.handlerRefreshTokenV2(
                {
                    refreshToken: req.refreshToken,
                    user: req.user,
                    keyStore: req.keyStore


                }
            )
        }).send(res);

    }

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