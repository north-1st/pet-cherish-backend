import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const productSchema = z
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

export const checkoutBodyRequestSchema = z.object({
  products: z.array(productSchema).openapi({
    example: [
      { name: '陪伴散步', price: 100, quantity: 2 },
      { name: '到府洗澡', price: 150, quantity: 4 },
    ],
  }),
  metadata: z
    .record(z.string())
    .optional()
    .openapi({
      example: {
        order_id: '123456',
      },
    }),
});

export const checkoutRequestSchema = z
  .object({
    body: checkoutBodyRequestSchema,
  })
  .openapi({
    example: {
      body: {
        products: [
          { name: '陪伴散步', price: 100, quantity: 2 },
          { name: '到府洗澡', price: 150, quantity: 4 },
        ],
        metadata: {
          order_id: '123456',
        },
      },
    },
  });

export const completeRequestSchema = z
  .object({
    query: z.object({
      session_id: z.string().openapi({
        example: 'cs_test_b1ZmurAFYdbEabofvi11fQrcrT5pwKrPNG04PBxL7YelDvX6byGdNajsOm',
      }),
    }),
  })
  .openapi({
    example: {
      query: {
        session_id: 'cs_test_b1ZmurAFYdbEabofvi11fQrcrT5pwKrPNG04PBxL7YelDvX6byGdNajsOm',
      },
    },
  });

export const checkoutResponseSchema = z
  .object({
    status: z.boolean(),
    message: z.string(),
    data: z.object({
      id: z.string(),
      url: z.string(),
      metadata: z.record(z.string()).nullable(),
    }),
  })
  .openapi({
    example: {
      status: true,
      message: 'checkout successful',
      data: {
        id: 'cs_test_b1ZmurAFYdbEabofvi11fQrcrT5pwKrPNG04PBxL7YelDvX6byGdNajsOm',
        url: 'https://checkout.stripe.com/pay/cs_test_b1ZmurAFYdbEabofvi11fQrcrT5pwKrPNG04PBxL7YelDvX6byGdNajsOm',
        metadata: {
          order_id: '123456',
        },
      },
    },
  });

export const completeResponseSchema = z
  .object({
    status: z.boolean(),
    message: z.string(),
    data: z.object({
      retrieve: z.object({
        id: z.string(),
        amount_total: z.number(),
        metadata: z.object({
          order_id: z.string(),
          task_id: z.string(),
        }),
        payment_status: z.enum(['paid', 'unpaid', 'no_payment_required']),
        payment_intent: z.object({
          amount: z.number(),
          amount_received: z.number(),
          created: z.number(), // 付款时间
          payment_method: z.object({
            type: z.string(),
            card: z
              .object({
                brand: z.string(),
                last4: z.string(),
              })
              .optional(),
          }),
        }),
      }),
      list_items: z.array(
        z.object({
          id: z.string(),
          amount_total: z.number(),
          currency: z.string(),
          description: z.string(),
          price: z.object({
            unit_amount: z.number(),
          }),
          quantity: z.number(),
        })
      ),
    }),
  })
  .openapi({
    example: {
      status: true,
      message: 'Your payment was successful',
      data: {
        retrieve: {
          id: 'cs_test_b1cr522PQ4qwypfN24f5UzrAbnuLUgAq7fXBB8bklCTrWu2wfgUmlQt2QQ',
          amount_total: 305000,
          metadata: {
            order_id: '6677c51e52789c9282cb5504',
            task_id: '6658a7d754390e6a3ed4370d',
          },
          payment_status: 'paid',
          payment_intent: {
            amount: 305000,
            amount_received: 305000,
            created: 1719125342, // 付款时间: Unix 时间
            payment_method: {
              type: 'card',
              card: {
                brand: 'visa',
                last4: '4242',
              },
            },
          },
        },
        list_items: [
          {
            id: 'item_1F7GHh2eZvKYlo2Cj2aO74E7',
            amount_total: 20000,
            currency: 'twd',
            description: '陪伴散步',
            price: {
              unit_amount: 10000,
            },
            quantity: 2,
          },
        ],
      },
    },
  });

export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>;
