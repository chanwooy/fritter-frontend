import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReflectionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as reflectionValidator from '../reflection/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the reflections
 *
 * @name GET /api/reflections
 *
 * @return {ReflectionResponse[]} - A list of all the reflections sorted in descending
 *                      order by date modified
 */
/**
 * Get reflection by author.
 *
 * @name GET /api/reflections?authorId=id
 *
 * @return {ReflectionResponse[]} - An array of reflections created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allReflections = await ReflectionCollection.findAll();
    const response = allReflections.map(util.constructReflectionResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorReflections = await ReflectionCollection.findAllByUsername(req.query.author as string);
    const response = authorReflections.map(util.constructReflectionResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new reflection.
 *
 * @name POST /api/reflections
 *
 * @param {string} content - The content of the reflection
 * @return {ReflectionResponse} - The created reflection
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the reflection content is empty or a stream of empty spaces
 * @throws {413} - If the reflection content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    reflectionValidator.isValidReflectionContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const profileName = req.body.profileName;
    const reflection = await ReflectionCollection.addOne(userId, profileName, req.body.content);

    res.status(201).json({
      message: 'Your reflection was created successfully.',
      reflection: util.constructReflectionResponse(reflection)
    });
  }
);

/**
 * Delete a reflection
 *
 * @name DELETE /api/reflections/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the reflection
 * @throws {404} - If the reflectionId is not valid
 */
router.delete(
  '/:reflectionId?',
  [
    userValidator.isUserLoggedIn,
    reflectionValidator.isReflectionExists,
    reflectionValidator.isValidReflectionModifier
  ],
  async (req: Request, res: Response) => {
    await ReflectionCollection.deleteOne(req.params.reflectionId);
    res.status(200).json({
      message: 'Your reflection was deleted successfully.'
    });
  }
);

/**
 * Modify a reflection
 *
 * @name PUT /api/reflections/:id
 *
 * @param {string} content - the new content for the reflection
 * @return {ReflectionResponse} - the updated reflection
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the reflection
 * @throws {404} - If the reflectionId is not valid
 * @throws {400} - If the reflection content is empty or a stream of empty spaces
 * @throws {413} - If the reflection content is more than 140 characters long
 */
router.put(
  '/:reflectionId?',
  [
    userValidator.isUserLoggedIn,
    reflectionValidator.isReflectionExists,
    reflectionValidator.isValidReflectionModifier,
    reflectionValidator.isValidReflectionContent
  ],
  async (req: Request, res: Response) => {
    const reflection = await ReflectionCollection.updateOne(req.params.reflectionId, req.body.content);
    res.status(200).json({
      message: 'Your reflection was updated successfully.',
      reflection: util.constructReflectionResponse(reflection)
    });
  }
);

export {router as reflectionRouter};