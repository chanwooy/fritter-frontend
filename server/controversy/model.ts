import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Controversy concept
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Controversy on the backend
export type Controversy = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  likes: number;
  dislikes: number;
  isControversial: boolean;
  liked: Array<string>;
  disliked: Array<string>;
};

export type PopulatedControversy = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Freet;
  likes: number;
  dislikes: number;
  isControversial: boolean;
  liked: Array<string>;
  disliked: Array<string>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Controversies stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ControversySchema = new Schema<Controversy>({
  // The author userId
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  likes: {
    type: Number,
    required: true
  },
  dislikes: {
    type: Number,
    required: true
  },
  isControversial: {
    type: Boolean,
    required: true
  },
  liked: {
    type: [String],
    required: true
  },
  disliked: {
    type: [String],
    required: true
  }
});

const ControversyModel = model<Controversy>('Controversy', ControversySchema);
export default ControversyModel;