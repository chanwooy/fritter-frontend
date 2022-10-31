import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Profile
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Profile on the backend
export type Profile = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  profileName: string;
  following: Array<string>;
  followers: Array<string>;
  username: string; // user that owns this profile
};

// Mongoose schema definition for interfacing with a MongoDB table
// Profiles stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ProfileSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // the profile's name
  profileName: {
    type: String,
    required: true
  },
  // the list of people who this profile follows
  following: {
    type: [String],
    required: false
  },
  // the list of people who follow this profile
  followers: {
    type: [String],
    required: false
  }
});

const ProfileModel = model<Profile>('Profile', ProfileSchema);
export default ProfileModel;