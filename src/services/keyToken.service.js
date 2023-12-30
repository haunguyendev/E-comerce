'use strict'

const keytokenModel = require("../models/keytoken.model")
const { Types, ObjectId } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            //lv0
            // const publicKeyString = publicKey.toString()
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            //return tokens ? tokens.publicKey : null
            //lv xxx
            const filter = { user: userId }, update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            }, options = {
                upsert: true,
                new: true,
            }
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null;



        } catch (error) {
            return error

        }

    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: new Types.ObjectId(id) }).lean()
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken }).lean()
    }
    static deleteKeyById = async (userId) => {
        return await keytokenModel.findByIdAndDelete({ user: userId })
    }
    static updateOne = async (filter, update, options) => {
        return await keytokenModel.findOneAndUpdate(filter, update, options).lean()
    }
}

module.exports = KeyTokenService