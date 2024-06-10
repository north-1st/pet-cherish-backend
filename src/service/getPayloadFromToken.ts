import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import env from '@env';

interface JwtPayloadWithId extends JwtPayload {
  id: string;
}

const getPayloadFromToken = (req: Request) => {
  if (!req.headers.authorization) {
    return {
      id: null,
    };
  }

  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return {
      id: null,
    };
  }

  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayloadWithId;
  return decoded;
};

export default getPayloadFromToken;
