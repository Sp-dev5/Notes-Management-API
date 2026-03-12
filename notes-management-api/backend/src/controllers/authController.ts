import { Response } from 'express';
import { registerSchema, loginSchema } from '../utils/validation.js';
import * as authService from '../services/authService.js';
import { AuthRequest } from '../middleware/auth.js';
import { successResponse } from '../utils/errors.js';

export async function register(req: AuthRequest, res: Response) {
  const input = registerSchema.parse(req.body);
  const result = await authService.register(input);

  res.status(201).json(
    successResponse(result, 'User registered successfully')
  );
}

export async function login(req: AuthRequest, res: Response) {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);

  res.status(200).json(
    successResponse(result, 'Login successful')
  );
}

export async function getProfile(req: AuthRequest, res: Response) {
  const user = await authService.getUserById(req.userId!);

  res.status(200).json(
    successResponse(user, 'Profile retrieved successfully')
  );
}
