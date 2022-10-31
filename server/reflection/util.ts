import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Reflection} from './model';

// Update this if you add a property to the Reflection type!
type ReflectionResponse = {
  _id: string;
  userId: string;
  profile: string;
  dateCreated: string;
  content: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Reflection object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reflection>} reflection - A reflection
 * @returns {ReflectionResponse} - The reflection object formatted for the frontend
 */
const constructReflectionResponse = (reflection: HydratedDocument<Reflection>): ReflectionResponse => {
  return {
    _id: reflection._id.toString(),
    userId: reflection.userId.toString(),
    profile: reflection.profileName,
    dateCreated: formatDate(reflection.dateCreated),
    content: reflection.content,
    dateModified: formatDate(reflection.dateModified)
  };
};

export {
  constructReflectionResponse
};
