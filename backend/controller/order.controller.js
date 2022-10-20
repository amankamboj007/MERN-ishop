const orderModel = require("../models/orderModel")
const productModel = require("../models/productModel")
const { successResposne, errorResponse } = require("../utils/responseHandler")

exports.newOrder = async (req, res) => {
    let resp;
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body
        const order = await orderModel.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        })
        resp = successResposne(order, "Order added successfully")
    } catch (error) {
        console.log(error)
        resp = errorResponse(error || error.message, 400)
    }
    res.send(resp).status(res.status)
}

exports.getSingleOrder = async (req, res) => {
    let resp;
    try {
        let order = await orderModel.findOne({ _id: req.params.id }).populate("user", "name email")
        if (!order) {
            throw ("Order not found for the Id ")
        }
        resp = successResposne(order, "Order fetched")
    } catch (error) {
        console.log(error)
        resp = errorResponse(error || error.message, 400)

    }
    res.send(resp).status(resp.status)
}

exports.myOrders = async (req, res) => {
    let resp;
    try {
        let myOrders = await orderModel.find({ user: req.user._id })
        resp = successResposne(myOrders)
    } catch (error) {
        console.log(error)
        resp = errorResponse(error || error.message, 400)
    }
    res.send(resp).status(resp.status)

}

exports.getAllOrders = async (req, res) => {
    let resp;
    try {
        let orders = await orderModel.find()
        let amount = 0;

        orders.forEach(i => {
            amount += order.totalPrice
        });

        let finalResp = {
            orders,
            amount
        }
        resp = successResposne(finalResp, "All orders fetched")
    } catch (error) {
        resp = errorResponse(error || error.message, 400)
    }
    res.send(resp).status(resp.status)
}

exports.updateOrder = async (req, res) => {
    let resp;
    try {
        let order = await orderModel.findOne({ _id: req.params.id })
        if (!order) {
            throw ("Order not found")
        }
        if (order && order.orderStatus == "Delivered") {
            throw ("Order already delivered")
        }

        order.orderItems.forEach(async (i) => {
            await updateStock(i.product, i.quantity)
        })

        order.orderStatus = req.body.status

        await order.save({ validateBeforeSave: false })

        resp = successResposne({}, "OrderStatus updated successfully")
    } catch (error) {
        resp = errorResponse(error || error.message, 400)
    }
    res.send(resp).status(resp.status)
}

const updateStock = async (product, quantity) => {
    const product = await productModel.findOne({ _id: product })

    product.updateStock -= quantity

    await product.save({ validateBeforeSave: false })
}

exports.deleteOrder = async (req, res) => {
    let resp;
    try {
        const order = await orderModel.findOne({ _id: req.params.id })
        if (!order) {
            throw ("order not found")
        }
        await order.remove()
        resp = successResposne({}, "Order deleted")
    }
    catch (error) {
        console.log(error)
        resp = errorResponse(error || error.message, 400)
    }
    res.send(resp).status(resp.status)

}

