const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Add your Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Add Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Add Price"],
        maxLength: [8, "Price can not be greater than 8 figure"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        require: [true, "Please Enter category"]
    },
    stock: {
        type: Number,
        require: true,
        maxLength: [4, "Can not exceed more than 4 char"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            require: true
        },
        name: {
            type: String,
            require: true
        },
        rating: {
            type: Number,
            require: true
        },
        comment: {
            type: String
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product", productSchema, "Product")