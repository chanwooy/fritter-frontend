import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import ProfileCollection from './collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as profileValidator from './middleware';
import * as util from './util';

const router = express.Router();

router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if authorId query parameter was supplied
      if (req.query.user !== undefined) {
        next();
        return;
      }
  
      const allProfiles = await ProfileCollection.findAll();
      const response = allProfiles.map(util.constructProfileResponse);
      res.status(200).json(response);
    },
    [
      userValidator.isUserLoggedIn,
      userValidator.isCurrentSessionUserExists
    ],
    async (req: Request, res: Response) => {
      const userProfiles = await ProfileCollection.findManyByUsername(req.query.user as string);
      const response = userProfiles.map(util.constructProfileResponse);
      res.status(200).json(response);
    }
  );


/**
 * Create a user profile.
 *
 * @name POST /api/profiles
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        userValidator.isCurrentSessionUserExists
    ],
    async (req: Request, res: Response) => {
        const profile = await ProfileCollection.addOne(req.body.username, req.body.profileName);
        res.status(201).json({
            message: `Your profile was created successfully.`,
            profile: util.constructProfileResponse(profile)
        });
    }
);

/**
 * Update a user's profile so that they follow another profile.
 *
 * @name PUT /api/profiles/follow
 *
 * @param {string} username - The name of the user
 * @param {string} profileName - The name of the user's profile
 * @param {string} otherUsername - The name of the other user
 * @param {string} otherProfileName - The other user's profile name
 * @return {ProfileResponse} - The updated profile
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
    '/follow',
    [
        userValidator.isUserLoggedIn,
        profileValidator.isAlreadyFollowing,
    ],
    async (req: Request, res: Response) => {
        const username = req.body.username;
        const profileName = req.body.profileName;
        const otherUsername = req.body.otherUsername;
        const otherProfileName = req.body.otherProfileName;
        const profile = await ProfileCollection.followOne(username, profileName, otherUsername, otherProfileName);
        res.status(201).json({
            message: `The other profile was followed successfully.`,
            profile: util.constructProfileResponse(profile)
        });
    }
);

/**
 * Update a user's profile so that they unfollow another profile.
 *
 * @name PUT /api/profiles/follow
 *
 * @param {string} username - The name of the user
 * @param {string} profileName - The name of the user's profile
 * @param {string} otherUsername - The name of the other user
 * @param {string} otherProfileName - The other user's profile name
 * @return {ProfileResponse} - The updated profile
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
    '/unfollow',
    [
        userValidator.isUserLoggedIn,
        profileValidator.isAlreadyUnfollowing
    ],
    async (req: Request, res: Response) => {
        const username = req.body.username;
        const profileName = req.body.profileName;
        const otherUsername = req.body.otherUsername;
        const otherProfileName = req.body.otherProfileName;
        const profile = await ProfileCollection.unfollowOne(username, profileName, otherUsername, otherProfileName);
        res.status(201).json({
            message: `The other profile was unfollowed successfully.`,
            profile: util.constructProfileResponse(profile)
        });
    }
);

/**
 * Delete a profile.
 *
 * @name DELETE /api/profiles
 * 
 * @param {string} username - The name of the user
 * @param {string} profileName - The name of the user's profile
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
    '/',
    [
        userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
        const username = req.body.username;
        const profileName = req.body.profileName;
        const user = await UserCollection.findOneByUsername(username);
        const userId = user._id;
        await FreetCollection.deleteManyForProfile(userId, profileName)
        await ProfileCollection.deleteOne(username, profileName);
        res.status(200).json({
            message: 'Your profile has been deleted successfully.'
        });
    }
);

export {router as profileRouter};
