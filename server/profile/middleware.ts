import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ProfileCollection from './collection';

/**
 * Checks if the profile is already following the other profile
 */
const isAlreadyFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const profile = await ProfileCollection.findOneByProfileName(req.body.username, req.body.profileName);
  if (profile && profile.following.includes(JSON.stringify([req.body.otherUsername, req.body.otherProfileName]))) {
    res.status(400).json({
      error: {
        alreadyFollowing: `You are already following this profile.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the profile has already unfollowed/not following the other profile
 */
const isAlreadyUnfollowing = async (req: Request, res: Response, next: NextFunction) => {
    const profile = await ProfileCollection.findOneByProfileName(req.body.username, req.body.profileName);
    if (profile && !profile.following.includes(JSON.stringify([req.body.otherUsername, req.body.otherProfileName]))) {
      res.status(400).json({
        error: {
          alreadyNotFollowing: `You are not following this profile.`
        }
      });
      return;
    }
  
    next();
  };

export {
    isAlreadyFollowing,
    isAlreadyUnfollowing
};