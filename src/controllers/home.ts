import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import { Task, TaskStatus } from '@prisma/client';

import prisma from '../prisma';

export const getHomeInfo = async (req: Request, res: Response, next: NextFunction) => {
  const queryParamsSitters = {};
  const queryParamsReviews = {};
  const queryParamsUsers = {};
  const queryParamsTasks = {
    where: {
      status: {
        in: ['COMPLETED'] as TaskStatus[],
      },
    },
  };

  try {
    // total users
    const total_users = await prisma.user.count({ ...queryParamsUsers });
    console.log('total_users:>> ', total_users);

    // total sitters-suggestion list
    const [sitters, total_sitters] = await prisma.$transaction([
      prisma.sitter.findMany({
        ...queryParamsSitters,
        take: 4,
        // skip: (page - 1) * limit + offset,
        orderBy: {
          average_rating: 'desc',
        },
        select: {
          id: true,
          average_rating: true,
          service_description: true,
          has_certificate: true,
          has_police_check: true,
          total_reviews: true,
          image_list: true,
          user: {
            select: {
              real_name: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.sitter.count({ ...queryParamsSitters }),
    ]);

    const formattedSitters = sitters.map((sitter) => ({
      id: sitter.id,
      average_rating: sitter.average_rating,
      service_description: sitter.service_description,
      has_certificate: sitter.has_certificate,
      has_police_check: sitter.has_police_check,
      total_reviews: sitter.total_reviews,
      image_list: sitter.image_list,
      real_name: sitter.user.real_name,
      avatar: sitter.user.avatar,
    }));
    console.log('sitters :>> ', sitters);
    console.log('formattedSitters :>> ', formattedSitters);
    console.log('total_sitters :>> ', total_sitters);

    //sitter_reviews_list
    const [reviews, total_reviews] = await prisma.$transaction([
      prisma.review.findMany({
        ...queryParamsReviews,
        take: 4,
        // skip: (page - 1) * limit + offset,
        orderBy: {
          pet_owner_created_at: 'desc',
        },
        select: {
          id: true,
          pet_owner_content: true,
          task: {
            select: {
              user: {
                select: {
                  real_name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      }),
      prisma.review.count({ ...queryParamsReviews }),
    ]);

    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      pet_owner_content: review.pet_owner_content,
      pet_owner_name: review.task.user.real_name,
      pet_owner_avatar: review.task.user.avatar,
    }));

    console.log('reviews :>> ', reviews);
    console.log('formattedReviews :>> ', formattedReviews);
    console.log('total_reviews :>> ', total_reviews);

    //complete_task_hours
    const [tasks, total_tasks] = await prisma.$transaction([
      prisma.task.findMany({
        ...queryParamsTasks,
        // take: limit,
        // skip: (page - 1) * limit + offset,
        // orderBy: {
        //   created_at: 'desc',
        // },
      }),
      prisma.task.count({ ...queryParamsTasks }),
    ]);

    const complete_task_hours_list = tasks.map((task: Task): number => {
      return (task.end_at.getTime() - task.start_at.getTime()) / (1000 * 60 * 60);
    });

    const complete_task_hours: number = complete_task_hours_list.reduce((sum, hours) => {
      return sum + hours;
    }, 0);

    console.log('tasks :>> ', tasks);
    console.log('total_tasks :>> ', total_tasks);
    console.log('complete_task_hours :>> ', complete_task_hours);

    //easily_and_quickly_match
    const easily_and_quickly_match = {
      total_sitters,
      total_users,
      complete_task_hours,
    };

    res.status(200).json({
      message: 'The homepage data get successfully!',
      status: true,
      data: {
        suggestion_sitter_list: formattedSitters,
        sitter_reviews_list: formattedReviews,
        easily_and_quickly_match,
      },
    });
  } catch (error) {
    next(error);
  }
};
