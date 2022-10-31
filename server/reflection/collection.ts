import type {HydratedDocument, Types} from 'mongoose';
import type {Reflection} from './model';
import ReflectionModel from './model';
import UserCollection from '../user/collection';
import ControversyCollection from '../controversy/collection'

/**
 * This files contains a class that has the functionality to explore reflections
 * stored in MongoDB, including adding, finding, updating, and deleting reflections.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Reflection> is the output of the FreetModel() constructor,
 * and contains all the information in Reflection. https://mongoosejs.com/docs/typescript.html
 */
class ReflectionCollection {
  /**
   * Add a reflection to the collection
   *
   * @param {string} authorId - The id of the author of the reflection
   * @param {string} content - The id of the content of the reflection
   * @return {Promise<HydratedDocument<Reflection>>} - The newly created reflection
   */
  static async addOne(userId: Types.ObjectId | string, profileName="default", content: string): Promise<HydratedDocument<Reflection>> {
    const date = new Date();
    const reflection = new ReflectionModel({
      userId: userId,
      profileName: profileName,
      dateCreated: date,
      content,
      dateModified: date
    });
    await reflection.save(); // Saves reflection to MongoDB
    return reflection;
  }

  /**
   * Find a reflection by reflectionId
   *
   * @param {string} reflectionId - The id of the reflection to find
   * @return {Promise<HydratedDocument<Reflection>> | Promise<null> } - The reflection with the given reflectionId, if any
   */
  static async findOne(reflectionId: Types.ObjectId | string): Promise<HydratedDocument<Reflection>> {
    return ReflectionModel.findOne({_id: reflectionId});
  }

  /**
   * Get all the Reflection in the database
   *
   * @return {Promise<HydratedDocument<Reflection>[]>} - An array of all of the reflections
   */
  static async findAll(): Promise<Array<HydratedDocument<Reflection>>> {
    // Retrieves reflections and sorts them from most to least recent
    return ReflectionModel.find({}).sort({dateModified: -1});
  }

  /**
   * Get all the reflections in by given user
   *
   * @param {string} username - The username of author of the reflections
   * @return {Promise<HydratedDocument<Reflection>[]>} - An array of all of the reflections
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Reflection>>> {
    const author = await UserCollection.findOneByUsername(username);
    return ReflectionModel.find({userId: author._id});
  }

  /**
   * Get all the reflections in by given profile
   *
   * @param {string} username - The username of author of the reflections
   * @param {string} profileName - The name of profile of the reflections
   * @return {Promise<HydratedDocument<Reflection>[]>} - An array of all of the reflections
   */
   static async findAllByProfileName(username: string, profileName: string): Promise<Array<HydratedDocument<Reflection>>> {
    const author = await UserCollection.findOneByUsername(username);
    return ReflectionModel.find({userId: author._id, profileName: profileName});
  }

  /**
   * Update a reflection with the new content
   *
   * @param {string} reflectionId - The id of the reflection to be updated
   * @param {string} content - The new content of the reflection
   * @return {Promise<HydratedDocument<Reflection>>} - The newly updated reflection
   */
  static async updateOne(reflectionId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Reflection>> {
    const reflection = await ReflectionModel.findOne({_id: reflectionId});
    reflection.content = content;
    reflection.dateModified = new Date();
    await reflection.save();
    return reflection;
  }

  /**
   * Delete a reflection with given reflectionId.
   *
   * @param {string} reflectionId - The reflectionId of reflection to delete
   * @return {Promise<Boolean>} - true if the reflection has been deleted, false otherwise
   */
  static async deleteOne(reflectionId: Types.ObjectId | string): Promise<boolean> {
    const reflection = await ReflectionModel.deleteOne({_id: reflectionId});
    return reflection !== null;
  }

  /**
   * Delete all the reflections by the given author
   *
   * @param {string} authorId - The id of author of reflections
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await ReflectionModel.deleteMany({userId});
  }

  /**
   * Delete all the reflections by the given profile
   *
   * @param {string} authorId - The id of author of reflections
   */
   static async deleteManyForProfile(userId: Types.ObjectId | string, profileName = "default"): Promise<void> {
    const user = await UserCollection.findOneByUserId(userId);
    await ReflectionModel.deleteMany({username: user.username, profileName: profileName});
  }
}

export default ReflectionCollection;
