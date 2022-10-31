import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ControversyCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
// import * as util from './util';

const router = express.Router();

/**
 * Like a freet
 *
 * @name PUT /api/freets/like/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 */
 router.put(
    '/like/:freetId?',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? '';
      const freet = await ControversyCollection.likeOne(req.params.freetId, userId);
      res.status(200).json({
        message: 'Your freet was liked successfully.',
      });
    }
  );

/**
 * Dislike a freet
 *
 * @name PUT /api/freets/dislike/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 */
 router.put(
    '/dislike/:freetId?',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? '';
      const freet = await ControversyCollection.dislikeOne(req.params.freetId, userId);
      res.status(200).json({
        message: 'Your freet was disliked successfully.',
      });
    }
  );

export {router as controversyRouter};
