import {Schema, model, connect} from 'mongoose';







export interface Ingredient {
    id: string;
    name: string;
    amount: number;
}

export interface Recipe {
    id: string;
    name: string;
    description: string;
    imagePath: string;
    ingredients: Ingredient[];
}

export interface Post {
    id: string;
    title: string;
    content: string;
}

export interface IUser {
    id: string;
    email: string;
    password: string;
    idToken?: string;
    expiresIn?: string;
}

const userSchema = new Schema<IUser>({
    email: {type: String, required: true},
    password: {type: String, required: true}
}, {timestamps: true})

export const User = model<IUser>('User', userSchema)

export interface ITag {
    name: string
}

export interface IFood {
    name: string;
    price: number;
    imageUrl: string;
    cookTime: string;
    origins: string[];
    tags: ITag[];
    favourite: boolean,
    createdBy: IUser
}




const tagSchema = new Schema<ITag>({
    name: {type: String, required: true}
}, {timestamps: true})
export const Tag = model<ITag>('Tag', tagSchema)

const foodSchema = new Schema<IFood>({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    imageUrl: {type: String, required: true},
    cookTime: {type: String, required: true},
    origins: [{type: String, required: true}],
    favourite:[{type:Boolean, required:true, default: false}],
    createdBy: {type: Schema.Types.ObjectId, ref: "User"},
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag",
    }],

}, {timestamps: true})
export const Food = model<IFood>('Food', foodSchema)

