'use strict';


const Comment = require('../models/comment.model')
const { convertToObjectIdMongodb } = require('../utils/index')


/*
key features : Comment service
 +add comment [User/Shop]
 + get a list of comments [User/shop]
 + delete a comment [User/shop/admin]
*/
class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_parentId: parentCommentId,
            comment_userId: userId,
            comment_content: content,
        })
        let rightValue
        if (parentCommentId) {
            //reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if (!parentComment) {
                throw new NotFoundError('Parent comment not found')
            }
            rightValue = parentComment.comment_right
            // update

            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: {
                    comment_right: 2
                }
            })

            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: {
                    comment_left: 2
                }
            })



        } else {
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectIdMongodb(productId)
            }, 'comment_right', { sort: { comment_right: -1 } })

            if (maxRightValue) {
                rightValue = maxRightValue.right + 1
            } else {
                rightValue = 1

            }

        }
        //insert to comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment

    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0

    }) {
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId)
            if (!parent) throw new NotFoundError('Not found comment for product')
            const comments = await Comment.find({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gte: parent.comment_left },
                comment_right: { $lt: parent.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1

            }).sort({ comment_left: 1 })
            return comments

        }
        const comments = await Comment.find({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_parentId: convertToObjectIdMongodb(parentCommentId)
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1

        }).sort({ comment_left: 1 })
        return comments




    }
}

module.exports = CommentService

