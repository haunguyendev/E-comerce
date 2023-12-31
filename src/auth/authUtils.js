'use strich'
const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id',
}
//service
const { findByUserId } = require('../services/keyToken.service')


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //acessToken
        const accessToken = await JWT.sign(payload, publicKey, {

            expiresIn: '2 days'
        })
        const refreshToken = await JWT.sign(payload, privateKey, {

            expiresIn: '7 days'
        })
        //
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err)

            } else {
                console.log(`decode verify::`, decode)
            }
        })


        return {
            accessToken,
            refreshToken
        }
    } catch (error) {

    }
}


const authentication = asyncHandler(async (req, res, next) => {
    /*
    1- Check userId missing???
    2- Get access token
    3- verify Token
    4- Check User in dsbs?
    5- Check keyStore with this userID
    6- Ok All => return next

    */

    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')
    //2
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found keyStore')
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId)
            throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        // console.log(`Testttttttttt`, req.keyStore)
        return next()

    }

    catch (error) {
        throw error
    }
    //4
    //5
    //6


})
const authenticationV2 = asyncHandler(async (req, res, next) => {
    /*
    1- Check userId missing???
    2- Get access token
    3- verify Token
    4- Check User in dsbs?
    5- Check keyStore with this userID
    6- Ok All => return next

    */

    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')
    //2
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found keyStore')
    //3

    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            // console.log(`refresh token:`, refreshToken)
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            console.log(`aaaaaaaaaaaaaa`, decodeUser.toString);
            if (userId !== decodeUser.userId)
                throw new AuthFailureError('Invalid UserId')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            // console.log(`Testttttttttt`, req.keyStore)
            return next()

        } catch (error) {
            throw error
        }


    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId)
            throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        req.user = decodeUser
        // console.log(`Testttttttttt`, req.keyStore)
        return next()

    }

    catch (error) {
        throw error
    }
    //4
    //5
    //6


})



const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}


module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}