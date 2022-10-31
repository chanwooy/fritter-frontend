// no utilities at the moment
import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Profile} from './model';

// Update this if you add a property to the User type!
type ProfileResponse = {
  username: string;
  profileName: string;
  following: String[];
  followers: String[];
};

/**
 * Transform a raw Profile object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} profile - A profile object
 * @returns {ProfileResponse} - The profile object
 */
const constructProfileResponse = (profile: HydratedDocument<Profile>): ProfileResponse => {
  return {
    username: profile.username,
    profileName: profile.profileName,
    following: profile.following,
    followers: profile.followers
  };
};

export {
  constructProfileResponse
};
