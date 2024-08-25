import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import Cookies from 'cookies';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  // Validate user credentials (use your user validation logic)
  const user = { id: 1, email }; // Example user

  // Generate JWT token
  const token = jwt.sign(user, process.env.JWT_SECRET_KEY!, { expiresIn: '30d' });

  // Set HTTP-only cookie
  const cookies = new Cookies(req, res);
  cookies.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60,  // 30 days in seconds
  });

  res.status(200).json({ success: true });
}
