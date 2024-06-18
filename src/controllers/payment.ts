import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import Stripe from 'stripe';

import env from '../env';

const stripe = new Stripe(env.STRIPE_SECRET);

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  const { products } = req.body;

  try {
    const line_items = products.map((product: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'twd',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100, // 轉換貨幣單位
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `${env.FRONT_END_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.FRONT_END_URL}/cancel`,
    });

    res.status(201).json({
      status: true,
      message: 'checkout successful',
      data: {
        id: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    next(createHttpError(500, 'checkout failed'));
  }
};

export const complete = async (req: Request, res: Response, next: NextFunction) => {
  const { session_id } = req.query;
  try {
    const result = await stripe.checkout.sessions.listLineItems(session_id as string);

    res.status(201).json({
      status: true,
      message: 'Your payment was successful',
      data: result.data,
    });
  } catch (error) {
    next(createHttpError(401, 'payment failed'));
  }
};
