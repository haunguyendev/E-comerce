'use strict'

const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectIdMongodb = id => Types.ObjectId(id)

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
};
//
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))

}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))

}
const removeUnderfinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] === null || obj[k] === undefined) delete obj[k]
    })
    return obj
}

const updateNestedObjectParser = (obj, prefix = "") => {
    const result = {};
    Object.keys(obj).forEach(key => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        // console.log(newKey)
        if (obj[key] === null || obj[key] === undefined) {
            console.log(`ingore keyaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`, key);
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            Object.assign(result, updateNestedObjectParser(obj[key], newKey));
        } else {
            result[newKey] = obj[key];
        }
    });

    return result;
};
module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUnderfinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb
}
