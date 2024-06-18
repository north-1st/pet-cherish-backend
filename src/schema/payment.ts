import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const productSchema = z
  .object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })
  .openapi({
    example: {
      name: '陪伴散步',
      price: 100,
      quantity: 2,
    },
  });

export const checkoutRequestSchema = z
  .object({
    body: z.object({
      products: z.array(productSchema),
    }),
  })
  .openapi({
    example: {
      body: {
        products: [
          { name: '陪伴散步', price: 100, quantity: 2 },
          { name: '到府洗澡', price: 150, quantity: 4 },
        ],
      },
    },
  });

export const completeRequestSchema = z
  .object({
    query: z.object({
      session_id: z.string(),
    }),
  })
  .openapi({
    example: {
      query: {
        session_id: 'cs_test_a1b2c3d4e5f6g7h8i9j0k',
      },
    },
  });

export const checkoutResponseSchema = z
  .object({
    status: z.boolean(),
    message: z.string(),
    data: z.object({
      id: z.string(),
      url: z.string().url(),
    }),
  })
  .openapi({
    example: {
      status: true,
      message: 'checkout successful',
      data: {
        id: 'cs_test_a1b2c3d4e5f6g7h8i9j0k',
        url: 'https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0k',
      },
    },
  });

export const completeResponseSchema = z
  .object({
    status: z.boolean(),
    message: z.string(),
    data: z.array(
      z.object({
        id: z.string(),
        object: z.string(),
        amount_subtotal: z.number(),
        amount_total: z.number(),
        currency: z.string(),
        description: z.string(),
        quantity: z.number(),
      })
    ),
  })
  .openapi({
    example: {
      status: true,
      message: 'Your payment was successful',
      data: [
        {
          id: 'li_1JXbYZ2eZvKYlo2C8b5KfC5e',
          object: 'item',
          amount_subtotal: 10000,
          amount_total: 10000,
          currency: 'twd',
          description: '陪伴散步',
          quantity: 2,
        },
      ],
    },
  });

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type CompleteRequest = z.infer<typeof completeRequestSchema>;
