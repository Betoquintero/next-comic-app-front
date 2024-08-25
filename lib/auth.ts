import jwt from 'jsonwebtoken';
import Cookies from 'cookies';
import { GetServerSidePropsContext } from 'next';

export function withAuth(handler: any) {
  return async (context: GetServerSidePropsContext) => {
    const cookies = new Cookies(context.req, context.res);
    const token = cookies.get('authToken');

    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY!);
      return await handler(context);
    } catch (error) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  };
}
