import type {HydratedDocument, Types} from 'mongoose';
import type {Controversy} from './model';
import ControversyModel from './model';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore Controversies
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Controversy> is the output of the ControversyModel() constructor,
 * and contains all the information in Controversy. https://mongoosejs.com/docs/typescript.html
 */
class ControversyCollection {
  /**
   * Add a controversy to the collection (if the corresponding freet did not have it before; to have 1:1 relationship since a freet cannot be controversial two times; it is either controversial at the moment or not)
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Controversy>>} - The newly created Controversy of the given freet
   */
  static async addOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Controversy>> {
    const previousControversy = await ControversyModel.findOne({freetId: freetId});
    if (previousControversy !== null) {
        return previousControversy.populate('freetId')
    }
    const controversy = new ControversyModel({
      freetId,
      likes: 0,
      dislikes: 0,
      isControversial: false,
      liked: [],
      disliked: []
    });
    await controversy.save(); // Saves freet to MongoDB
    return controversy.populate('freetId');
  }

  /**
   * Find a Controversy of a freet by freetId
   *
   * @param {string} freetId - The id of the controversy to find that corresponds to a given freet
   * @return {Promise<HydratedDocument<Controversy>> | Promise<null> } - The controversy of the freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Controversy>> {
    return ControversyModel.findOne({freetId: freetId}).populate('freetId');
  }

  /**
   * Get all the controversies in the database
   *
   * @return {Promise<HydratedDocument<Controversy>[]>} - An array of all of the controversies
   */
  static async findAll(): Promise<Array<HydratedDocument<Controversy>>> {
    // Retrieves freets and sorts them from most liked to least liked (most liked generally means more numbers of disliked as well; basically sorting based on their level of controversy)
    return ControversyModel.find({}).sort({dateModified: -1}).populate('freetId');
  }

  /**
   * Get all the controversies made by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Controversy>[]>} - An array of all of the controversies
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Controversy>>> {
    const freets = await FreetCollection.findAllByUsername(username);
    const controversies = freets.map(async(freet) => {
      return await ControversyModel.findOne({freetId: freet._id}).populate('freetId');
    });
    return await Promise.all(controversies);
  }

  /**
   * Update a controversy with a like
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} userId - The username of the user who liked the freet
   * @return {Promise<HydratedDocument<Controversy>>} - The newly updated controversy
   */
  static async likeOne(freetId: Types.ObjectId | string, userId: string): Promise<HydratedDocument<Controversy>> {
    const controversy = await ControversyModel.findOne({freetId: freetId});
    if (controversy.liked.includes(userId)) { // if the user already liked the post, then cancel it
      const i: number = controversy.liked.indexOf(userId);
      controversy.liked.splice(i, 1);
      controversy.likes--;
    } else { // then increment the like
      if (controversy.disliked.includes(userId)) { // however, before everything, if the user disliked the post before, cancel that dislike
        const i: number = controversy.disliked.indexOf(userId);
        controversy.disliked.splice(i, 1);
        controversy.dislikes--;
      } // and like the post
      controversy.likes++;
      controversy.liked.push(userId);
    }
    const minimumControversyThreshold = 100; // for a freet to be "controversial", there has to be at LEAST 100 likes; arbitrary rule
    const percentDiff = 0.05; // for a freet to be "controversial", the number of dislikes must be within 5% of the number of likes
    controversy.isControversial = controversy.likes > minimumControversyThreshold && Math.abs(controversy.likes - controversy.dislikes) < percentDiff * controversy.likes;
    await controversy.save();
    return controversy.populate('freetId');
  }

  /**
   * Update a controversy with a dislike
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} userId - The username of the user who disliked the freet
   * @return {Promise<HydratedDocument<Controversy>>} - The newly updated controversy
   */
   static async dislikeOne(freetId: Types.ObjectId | string, userId: string): Promise<HydratedDocument<Controversy>> {
    const controversy = await ControversyModel.findOne({freetId: freetId});
    if (controversy.disliked.includes(userId)) { // if the user already disliked the post, then cancel it
      const i: number = controversy.disliked.indexOf(userId);
      controversy.disliked.splice(i, 1);
      controversy.dislikes--;
    } else { // then increment the dislike
      if (controversy.liked.includes(userId)) { // however, before everything, if the user liked the post before, cancel that like
        const i: number = controversy.liked.indexOf(userId);
        controversy.liked.splice(i, 1);
        controversy.likes--;
      } // and like the post
      controversy.dislikes++;
      controversy.disliked.push(userId);
    }
    const minimumControversyThreshold = 100; // for a freet to be "controversial", there has to be at LEAST 100 likes; arbitrary rule
    const percentDiff = 0.05; // for a freet to be "controversial", the number of dislikes must be within 5% of the number of likes
    controversy.isControversial = controversy.likes > minimumControversyThreshold && Math.abs(controversy.likes - controversy.dislikes) < percentDiff * controversy.likes;
    await controversy.save();
    return controversy.populate('freetId');
  }

  /**
   * Delete a controversy of the given freet (should only be called when the owner freet itself is deleted)
   *
   * @param {string} freetId - The freetId of the controversy that is going to be deleted
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await ControversyModel.deleteOne({freetId: freetId});
    return freet !== null;
  }

  /**
   * Delete all the controversies by the given user (regardless of whether isControversial == true)
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    const user = await UserCollection.findOneByUserId(authorId);
    const freets = await FreetCollection.findAllByUsername(user.username);
    const controversies = freets.map(async(freet) => {
      return await ControversyModel.deleteOne({freetId: freet._id});
    });
    await Promise.all(controversies);
  }

  /**
   * Delete all the controversies by the given profile (regardless of whether isControversial == true)
   *
   * @param {string} profileName - The name of profile whose freets are going to deleted
   */
   static async deleteManyForProfile(authorId: Types.ObjectId | string, profileName: string): Promise<void> {
    const user = await UserCollection.findOneByUserId(authorId);
    const freets = await FreetCollection.findAllByProfileName(user.username, profileName)
    const controversies = freets.map(async(freet) => {
      return await ControversyModel.deleteOne({freetId: freet._id});
    });
    await Promise.all(controversies);
  }
}

export default ControversyCollection;