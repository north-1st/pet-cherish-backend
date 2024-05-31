import { NextFunction, Response } from 'express';

import { UploadImageRequest } from '@schema/upload';

export const uploadImage = async (_req: UploadImageRequest, _res: Response, next: NextFunction) => {
  /*
    #swagger.tags = ['Uploads']
    #swagger.summary = '上傳圖片'
  */

  /* 
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/components/schemas/{換成對應的名字}'
      }
    }
  */
  next();
};
