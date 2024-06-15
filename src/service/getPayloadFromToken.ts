import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import env from '@env';

interface JwtPayloadWithId extends JwtPayload {
  id: string;
}

const getPayloadFromToken = (req: Request) => {
  try {
    if (!req.headers.authorization?.startsWith('Bearer')) {
      return {
        id: null,
      };
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayloadWithId;
    return decoded;
  } catch (error) {
    return {
      id: null,
    };
  }
};

export default getPayloadFromToken;
