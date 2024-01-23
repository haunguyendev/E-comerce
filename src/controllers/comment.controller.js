'use strict';
const { SuccessResponse } = require('../core/success.response');
const { createComment, getCommentsByParentId, deleteComment } = require('../services/comment.service')


class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "create new comment",
            metadata: await createComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: "List comments by parent",
            metadata: await getCommentsByParentId(req.query)
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Deleted successfully",
            metadata: await deleteComment(req.body)
        }).send(res)
    }
}

module.exports = new CommentController();