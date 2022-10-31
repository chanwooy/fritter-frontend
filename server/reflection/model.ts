import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Profile} from '../profile/model';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Reflection
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Reflection on the backend
export type Reflection = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  profileName: string;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Reflections stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReflectionSchema = new Schema<Reflection>({
  // The author userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  profileName: {
    // Use Types.ObjectId outside of the schema
    type: String,
    required: true,
  },
  // The date the reflection was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the reflection
  content: {
    type: String,
    required: true
  },
  // The date the reflection was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const ReflectionModel = model<Reflection>('Reflection', ReflectionSchema);
export default ReflectionModel;
