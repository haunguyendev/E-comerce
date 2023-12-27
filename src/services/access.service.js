'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, ConflictRequestError, AuthFailureError } = require('../core/error.response')
const { findByEmail } = require("./shop.service")
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',

}
class AccessService {

    static logout = async (keyStore) => {

        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey })
        return delKey
    }


    static login = async ({ email, password, refreshToken = null }) => {
        /**
          1- Check email in dbs
          2- Match password
          3- Create token pair (AT vs RT) ans save
          4- generate token
          5- get data return login
         */
        //1
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Shop not registered');
        }
        //2
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError('Authentication error')
        //3
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        //4 generate token
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({
            userId,
            email
        },
            publicKey,
            privateKey)

        //5
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey, userId

        })
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }



    }



    static signUp = async ({ name, email, password }) => {
        // try {
        // Step1 : check email exists ??



        const holderShop = await shopModel.findOne({
            email
        }).lean()
        if (holderShop) {
            throw new BadRequestError('Error::Shops already exist!');
        }
        const passwordHas = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHas,
            roles: [RoleShop.SHOP],
        })
        if (newShop) {
            // created privateKey, publicKey


            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            console.log({ privateKey, publicKey })//save collection KeyStore
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                throw new BadRequestError('Error::Keystore error');
            }

            //created token pair
            const tokens = await createTokenPair({
                userId: newShop._id,
                email
            },
                publicKey,
                privateKey)

            console.log(`Created Token success::`, tokens)
            // const tokens = await

            // console.log(newShop);
            // console.log(getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }))
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }


        }
        return {
            code: 200,
            metadata: null
        }
        // } catch (error) {
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }

}

module.exports = AccessService