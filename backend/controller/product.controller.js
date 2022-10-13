const productModel = require("../models/productModel")
const { successResposne, errorResponse } = require("../utils/responseHandler")


exports.addProduct = async (req, res) => {
    let resp;
    try {
        const product = await productModel.create(req.body)
        if (!product) {
            throw ("Not added")
        }
        resp = successResposne(product, ("Product Added"))
    } catch (error) {
        resp = errorResponse(error || error.message, 400)
    }
    res.status(resp.status).send(resp)
}

exports.getAllproduct = async (req, res) => {
    let resp;
    let skip = Number(req.query.skip || 0);
    let limit = Number(req.query.limit || 10)
    try {
        let query = {}
        if (req.query.keyword) {
            query = {
                name: {
                    $regex: req.query.keyword,
                    $options: "i"
                }
            }
        }
        if (req.query.priceFrom && req.query.priceTo) {
            query.price = {
                $gte: Number(req.query.priceFrom),
                $lte: Number(req.query.priceTo)
            }
        }
        if (req.query.category) {
            query.category = req.query.category
        }
        let product = await productModel.aggregate([
            { $match: query },
            {
                '$facet': {
                    count: [{ $count: 'total' }],
                    list: [
                        { $skip: skip },
                        { $limit: limit }
                    ]
                }
            }
        ])
        if (product && product.length == 0) {
            throw ("Products not found")
        }

        resp = successResposne(product ? product[0] : {}, "Product list fetched")
    } catch (error) {
        resp = errorResponse(error || error.message, 400)
    }
    res.status(resp.status).send(resp)
}

exports.getProduct = async (req, res) => {
    let resp;
    try {
        let product = await productModel.findOne({ _id: req.params.id })
        if (!product) {
            throw ("Product not found")
        }
        resp = successResposne(product, "Product fetched")
    } catch (error) {
        resp = errorResponse(error || error.message, 400)
    }
    res.status(resp.status).send(resp)
}

exports.updateProduct = async (req, res) => {
    let product = await productModel.findOne({ _id: req.params.id })
    let resp;
    try {
        if (!product) {
            throw new Error("Product not found ")
        }
        let updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        resp = successResposne(updatedProduct, "Product updated successfully")
    }
    catch (error) {
        resp = errorResponse(error || error.message, 400)
    }
    res.status(resp.status).send(resp)
}

exports.deleteProduct = async (req, res) => {
    let resp;
    try {
        let product = await productModel.findOne({ _id: req.params.id })
        if (!product) {
            throw ("Product not found ")
        }
        await productModel.deleteOne({ _id: req.params.id })
        resp = successResposne({}, "Product deleted")

    } catch (error) {
        resp = errorResponse(error || error.message, 400)
    }
    res.status(resp.status).send(resp)
}

exports.addReview = async (req, res) => {
    let resp;
    try {
        let { rating, comment, productId } = req.body;

        const review = {
            userId: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        let product = await productModel.findOne({ _id: productId })

        if (!product) throw ("Product not found")

        const isReviewed = product.reviews.find((i) => i.userId.toString() === req.user._id.toString())


        if (isReviewed) {
            for (let i of product.reviews) {
                if (i.userId.toString() == req.user._id.toString()) {
                    i.rating = review.rating
                    i.comment = review.comment
                }
            }
        } else {
            product.reviews.push(review)
            product.numOfReviews = product.reviews.length
        }
        let ratings;
        let sum = 0;
        if (product.reviews.length > 0) {
            ratings = product.reviews.map(i => {
                sum = sum + i.rating
            })
            ratings = sum
        }
        product.ratings = (ratings / product.reviews.length).toFixed(2)

        product.save({ validateBeforeSave: false })

        resp = successResposne({}, "Ratings updated")

    } catch (error) {
        console.log(error)
        resp = errorResponse(error || error.message, 400)
    }
    res.send(resp).status(resp.status)
}

exports.getProductReview = async (req, res) => {
    let resp;

    try {
        let product = await productModel.findOne({ _id: req.query.productId })
        if (!product) throw ("Product not found")

        resp = successResposne(product.reviews, "Product Reviews fetched")

    } catch (error) {
        resp = errorResponse(error || error.message, 400)
    }
    res.send(resp).status(resp.status)
}

exports.deleteReview = async (req, res) => {
    let resp;
    try {
        let product = await productModel.findOne({ _id: req.query.productId })
        if (!product) throw ("Product not found")

        if (product.reviews.length > 0) {
            let reviews = product.reviews.filter(i => i.userId.toString() !== req.query.id.toString())
            let sum = 0;
            reviews.map(i => {
                sum = sum + i.rating
            })
            let ratings = sum / reviews.length
            let numOfReviews = reviews.length
            await productModel.findOneAndUpdate({ _id: req.query.productId }, {
                reviews,
                ratings,
                numOfReviews
            })
            resp = successResposne({},"Review deleted successfully")
        }
        else {
            throw ("Reviews not found")
        }

    } catch (error) {
        resp = errorResponse(error || error.message, 400)
    }
    res.send(resp).status(resp.status)
}