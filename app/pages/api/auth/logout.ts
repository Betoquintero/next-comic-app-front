import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  cookies.set('authToken');  // Clears the token cookie

  res.status(200).json({ success: true });
}
