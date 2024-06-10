import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { PetSize, SitterStatus } from '@prisma/client';
import { objectIdSchema } from '@schema/objectId';
import { reviewResponseDataSchema } from '@schema/review';
import { sitterResponseSchema } from '@schema/sitter';

extendZodWithOpenApi(z);

export const homeResponseSchema = z
  .object({
    suggestion_sitter_list: z.array(sitterResponseSchema).optional(),
    sitter_reviews_list: z.array(reviewResponseDataSchema).optional(),
    easily_and_quickly_match: z
      .object({
        total_sitters: z.number(),
        total_users: z.number(),
        complete_task_hours: z.number(),
      })
      .optional(),
  })
  .openapi({
    example: {
      suggestion_sitter_list: [
        {
          user_id: '54489faba8bcd77a22dedue8',
          has_certificate: true,
          has_police_check: true,
          photography_price: 100,
          health_care_price: 200,
          bath_price: 300,
          walking_price: 400,
          service_size_list: [PetSize.S, PetSize.M],
          is_door_to_door: true,
          image_list: ['https://picsum.photos/200', 'https://picsum.photos/200'],
          service_description: '服務說明',
          average_rating: 4.5,
          total_reviews: 10,
          certificate_number: '12345678',
          certificate_image: 'https://picsum.photos/200',
          police_check_image: 'https://picsum.photos/200',
          status: SitterStatus.APPROVING,
        },
      ],
      sitter_reviews_list: [
        {
          id: '6658a67f6676e47b02f23e8b',
          pet_owner_rating: 3,
          pet_owner_content: '改改飼主評價內容',
          pet_owner_updated_at: '2024-06-09T09:17:37.813Z',
          sitter_rating: 3,
          sitter_content: '改改保姆評價內容，推！',
          sitter_user_updated_at: '2024-06-09T09:17:37.811Z',
          pet_owner: {
            id: '6658a67f6676e47b02f23e8b',
            email: '103@mail.com',
            real_name: '103',
            nickname: null,
            avatar: null,
          },
          sitter: {
            id: '6659fb917bce00ca07bcdd14',
            email: '102@mail.com',
            real_name: '102',
            nickname: null,
            avatar: null,
          },
          task: {
            id: '6658a7d754390e6a3ed4370d',
            title: '任務標題103',
            service_type: 'BATH',
          },
        },
      ],
      easily_and_quickly_match: {
        total_sitters: 1789,
        total_users: 9789,
        complete_task_hours: 19789,
      },
    },
  });

export type HomeResponse = z.infer<typeof homeResponseSchema>;
