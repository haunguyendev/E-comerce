'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');

const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo")

/*
 Key features : Cart Service
 - add product to cart [user]
 - reduce product quantity by one [User]
 - increase quantity by one [User]
 - get cart [User]
 - Delete cart [User]
 - Delete item [User]
*/

class CartService {
    //Start repo cart//
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            },
            options = {
                upsert: true,
                new: true
            }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)


    }
    static async findProductInCart(productId) {
        const query = { 'cart_products.productId': productId }
        return await cart.findOne(query)

    }
    // static async updateUserCartQuantity({ userId, product }) {
    //     const { productId, quantity } = product;
    //     const query = {
    //         cart_userId: userId,
    //         'cart_products.productId': productId,
    //         cart_state: 'active'
    //     },
    //         updateSet = {
    //             $inc: {
    //                 'cart_products.$.quantity': quantity
    //             }
    //         },
    //         options = {
    //             upsert: true,
    //             new: true
    //         }




    //     return await cart.findOneAndUpdate(query, updateSet, options)


    // }
    static async updateUserCartQuantity({ userId, product }) {
        try {
            const { productId, quantity } = product;
            const query = {
                cart_userId: userId,
                'cart_products.productId': productId,
                cart_state: 'active'
            };
            const updateSet = {
                $inc: {
                    'cart_products.$.quantity': quantity
                }
            };
            const options = {
                upsert: true,
                new: true
            };

            console.log("Query:", query);
            console.log("Update Set:", updateSet);

            const updatedCart = await cart.findOneAndUpdate(query, updateSet, options);

            if (!updatedCart) {
                throw new Error('Failed to update user cart quantity.');
            }

            console.log("Updated Cart:", updatedCart);

            return updatedCart;
        } catch (error) {
            console.error('Error updating user cart quantity:', error);
            throw error; // Re-throw the error for the calling code to handle
        }
    }






    //End repo cart//

    static async addToCart({ userId, product = {} }) {
        //check cart ton tai hay khong
        const userCart = await cart.findOne({
            cart_userId: userId
        })

        if (!userCart) {
            return await CartService.createUserCart({ userId, product })
        }

        // new co gio hang roi nhung chua co san pham?


        if (!userCart.cart_products || userCart.cart_products.length === 0) {
            userCart.cart_products = [product]
            cconsole.log('Cart is empty. Adding the first product.');
            return await userCart.save()
        }
        const foundProduct = await CartService.findProductInCart(product.productId)
        console.log(`aaaaaaaaaaaaaaaaaaaaaaaaaaaa`, foundProduct);
        if (!foundProduct) {
            userCart.cart_products.push(product)
            return await userCart.save()

        }

        // gio hang ton tai, va co san pham nay thi update quantity

        return await CartService.updateUserCartQuantity({ userId, product })
    }

    //update cart
    /*
    shop_oder_ids: [{
      quantity,
      price,
      shopId,
      old_quantity,
      product_id
      
    }],

    version
    */
    static async addToCartV2({ userId, shop_order_ids = {} }) {
        const {
            productId, quantity, old_quantity }
            = shop_order_ids[0]?.item_products[0]

        //check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Product not exist')

        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.item_products[0].shopId)
            throw new NotFoundError('Product not belong to this shop')

        if (quantity === 0) {
            deleteUserCart({ userId, productId })
            //deleted
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,

            }
        })




    }

    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }

                }
            }

        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart


    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({
            cart_userId: userId
        }).lean()
    }

}

module.exports = CartService

