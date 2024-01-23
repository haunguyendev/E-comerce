'use strict'
const express = require('express')
const NotificationController = require('../../controllers/notification.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()
//Here not login
//authentication

router.use(authenticationV2)

//////////////////////

router.get('', asyncHandler(NotificationController.listNotiByUser))


module.exports = router