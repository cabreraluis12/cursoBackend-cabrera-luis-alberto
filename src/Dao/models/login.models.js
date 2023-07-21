import { Schema, model } from 'mongoose';
import monsoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 100,
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
    },
    role: {
        type: String,
        default: 'user',
    },
});

schema.plugin(monsoosePaginate);
export const UserModel = model('users', schema);