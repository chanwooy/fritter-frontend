import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReflectionCollection from '../reflection/collection';

/**
 * Checks if a reflection with reflectionId is req.params exists
 */
const isReflectionExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.reflectionId);
  const reflection = validFormat ? await ReflectionCollection.findOne(req.params.reflectionId) : '';
  if (!reflection) {
    res.status(404).json({
      error: {
        ReflectionNotFound: `Reflection with Reflection ID ${req.params.reflectionId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the reflection in req.body is valid, i.e not a stream of empty
 * spaces
 */
const isValidReflectionContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Reflection content must be at least one character long.'
    });
    return;
  }
  next();
};

/**
 * Checks if the current user is the author of the reflection whose reflectionId is in req.params
 */
const isValidReflectionModifier = async (req: Request, res: Response, next: NextFunction) => {
  const reflection = await ReflectionCollection.findOne(req.params.reflectionId);
  const userId = reflection.userId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' reflections.'
    });
    return;
  }

  next();
};

export {
  isValidReflectionContent,
  isReflectionExists,
  isValidReflectionModifier
};
