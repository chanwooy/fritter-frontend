import type {HydratedDocument, Types} from 'mongoose';
import type {Profile} from './model';
import ProfileModel from './model';

/**
 * This file contains a class with functionality to interact with profiles stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<Profile> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class ProfileCollection {

  static async findAll(): Promise<Array<HydratedDocument<Profile>>> {
    return ProfileModel.find({});
  }

  /**
   * Add a new profile
   *
   * @param {string} username - The username of the user
   * @param {string} profileName - The name of the new profile
   * @return {Promise<HydratedDocument<Profile>>} - The newly created profile
   */
  static async addOne(username: string, profileName: string): Promise<HydratedDocument<Profile>> {
    const profile = new ProfileModel({username, profileName});
    await profile.save(); // Saves profile to MongoDB
    return profile;
  }

  /**
   * Find every profile of a user.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<Profile>> | Promise<null>} - The user with the given username, if any
   */
  static async findManyByUsername(username: string): Promise<HydratedDocument<Profile>[]> {
    return ProfileModel.find({username: username});
  }

  /**
   * Find a profile(s) of a user given its name (case insensitive).
   *
   * @param {string} username - The name of the user whose profiles are of interest
   * @param {string} profileName - The name of the profile to find
   * @return {Promise<HydratedDocument<Profile>> | Promise<null>} - The profile with the given username, if any;
   */
  static async findOneByProfileName(username: string, profileName: string): Promise<HydratedDocument<Profile>> {
    return ProfileModel.findOne({username: username, profileName: new RegExp(`^${profileName.trim()}$`, 'i')});
  }

  /**
   * Allows a profile to follow another user's profile
   *
   * @param {string} username - The userId of the user to update
   * @param {string} profileName - The name of the profile that is going to be updated
   * @param {Object} otherUsername - The userId of a user to be followed
   * @param {Object} otherProfileName - The name of the profile to be followed
   * @return {Promise<HydratedDocument<Profile>>} - The updated user
   */
  static async followOne(username: string, profileName: string, otherUsername: string, otherProfileName: string): Promise<HydratedDocument<Profile>> {
    const profile = await ProfileModel.findOne({username: username, profileName: profileName});
    const otherProfile = await ProfileModel.findOne({username: otherUsername, profileName: otherProfileName});
    if (profile != null && otherProfile != null) {
			const otherJSON = JSON.stringify([otherUsername, otherProfileName]);
    	profile.following.push(otherJSON);
			profile.save()
			const userJSON = JSON.stringify([username, profileName]);
			otherProfile.followers.push(userJSON);
			otherProfile.save();
    }
    return profile;
  }

		/**
		 * Allows a profile to unfollow another user's profile
		 *
		 * @param {string} username - The userId of the user to update
		 * @param {string} profileName - The name of the profile that is going to be updated
		 * @param {Object} otherUsername - The userId of a user to be followed
		 * @return {Promise<HydratedDocument<Profile>>} - The updated profile
		 */
		static async unfollowOne(username: string, profileName: string, otherUsername: string, otherProfileName: string): Promise<HydratedDocument<Profile>> {
				const profile = await ProfileModel.findOne({username: username, profileName: profileName});
				const otherProfile = await ProfileModel.findOne({username: otherUsername, profileName: otherProfileName});
				if (profile != null && otherProfile != null) {
						const otherJSON = JSON.stringify([otherUsername, otherProfileName]);
						const otherRemoveIndex = profile.following.indexOf(otherJSON);
						if (otherRemoveIndex !== -1) {
								profile.following.splice(otherRemoveIndex);
						}
						profile.save()

						const userJSON = JSON.stringify([username, profileName]);
						const userRemoveIndex = otherProfile.followers.indexOf(userJSON);
						if (userRemoveIndex !== -1) {
								otherProfile.followers.splice(userRemoveIndex);
						}
						otherProfile.save();
				}
				return profile;
		}

		/**
		 * Delete a profile from the collection.
		 *
		 * @param {string} profileName - The userId of user to delete
		 * @return {Promise<Boolean>} - true if the profile has been deleted, false otherwise
		 */
		static async deleteOne(username: string, profileName: string): Promise<boolean> {
				const user = await ProfileModel.deleteOne({username: username, profileName: profileName});
				return user !== null;
		}
}

export default ProfileCollection;