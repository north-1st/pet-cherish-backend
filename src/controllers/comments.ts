import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import { paginationSchema } from '@schema/pagination';

// import {
//   CreateTaskBody,
//   GetTasksByUserRequest,
//   UpdateTaskBody,
//   createTaskRequestSchema,
//   deleteTaskRequestSchema,
//   updateTaskRequestSchema,
// } from '@schema/task';

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { task_id } = req.params;
    const { text, parent_comment_id } = req.body;
    const user = req.user;

    if (!task_id) {
      return next(createHttpError(400, 'task_id is required'));
    }

    if (!text) {
      return next(createHttpError(400, 'text is required'));
    }

    if (!user || !user.id) {
      return next(createHttpError(401, 'User not authenticated'));
    }

    const newComment = await prisma.comment.create({
      data: {
        parent_comment_id: parent_comment_id || null,
        author_id: user.id,
        text,
        task_id: task_id,
      },
    });

    res.status(201).json({
      status: true,
      message: 'create comment successfully',
      data: newComment,
    });
  } catch (error) {
    next(createHttpError(500, 'Create comment failed'));
  }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  const { comment_id } = req.params;
  const { text } = req.body;
  const user = req.user;

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: comment_id,
      },
    });

    if (!comment) {
      return next(createHttpError(400, 'comment not found'));
    }

    // if (comment.author_id !== user!.id) {
    //   return next(createHttpError(401, 'Not authorized to update this comment'));
    // }

    const updatedComment = await prisma.comment.update({
      where: {
        id: comment_id,
      },
      data: {
        text: text,
      },
    });

    res.status(201).json({
      status: true,
      message: 'update comment successfully',
      data: updatedComment,
    });
  } catch (error) {
    next(createHttpError(401, 'update comment failed'));
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const { comment_id } = req.params;
  const user = req.user;

  try {
    const commentToDelete = await prisma.comment.findUnique({
      where: {
        id: comment_id,
      },
    });

    if (!commentToDelete) {
      return next(createHttpError(404, 'Comment not found'));
    }

    if (commentToDelete.author_id !== user!.id) {
      return next(createHttpError(401, 'Not authorized to delete this comment'));
    }

    // 刪除主評論
    await prisma.comment.delete({
      where: {
        id: comment_id,
      },
    });

    // 刪除所有子評論
    await prisma.comment.deleteMany({
      where: {
        parent_comment_id: comment_id,
      },
    });

    res.status(200).json({
      status: true,
      message: 'delete comment successfully',
    });
  } catch (error) {
    next(createHttpError(401, 'delete comment failed'));
  }
};

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  const { task_id } = req.params;
  const { continueAfterId, pageSize = '3' } = req.query;

  const pageSizeInt = parseInt(pageSize as string, 10);

  try {
    const commentsQuery = prisma.comment.findMany({
      where: {
        task_id: task_id,
        parent_comment_id: null,
        ...(continueAfterId && {
          id: {
            lt: continueAfterId as string,
          },
        }),
      },
      orderBy: {
        id: 'desc',
      },
      take: pageSizeInt + 1,
      select: {
        id: true,
        parent_comment_id: true,
        text: true,
        author_id: true,
        task_id: true,
        created_at: true,
        author: {
          select: {
            id: true,
            real_name: true,
            avatar: true,
            nickname: true,
          },
        },
      },
    });

    const result = await commentsQuery;

    const comments = result.slice(0, pageSizeInt);
    const endOfPaginationReached = result.length <= pageSizeInt;

    const commentsWithRepliesCounts = await Promise.all(
      comments.map(async (comment) => {
        const repliesCount = await prisma.comment.count({
          where: { parent_comment_id: comment.id },
        });
        return { ...comment, repliesCount };
      })
    );

    res.status(200).json({
      status: true,
      message: 'get comment successfully',
      data: {
        comments: commentsWithRepliesCounts,
        endOfPaginationReached,
      },
    });
  } catch (error) {
    next(createHttpError(401, 'get comment failed'));
  }
};

export const getCommentReplies = async (req: Request, res: Response, next: NextFunction) => {
  const { comment_id: parent_comment_id } = req.params;
  const { continueAfterId, pageSize = '3' } = req.query;

  const pageSizeInt = parseInt(pageSize as string, 10);

  try {
    const commentsQuery = prisma.comment.findMany({
      where: {
        parent_comment_id: parent_comment_id,
        ...(continueAfterId && {
          id: {
            gt: continueAfterId as string,
          },
        }),
      },
      orderBy: {
        id: 'asc',
      },
      take: pageSizeInt + 1,
      select: {
        id: true,
        parent_comment_id: true,
        text: true,
        author_id: true,
        task_id: true,
        created_at: true,
        author: {
          select: {
            id: true,
            real_name: true,
            avatar: true,
            nickname: true,
          },
        },
      },
    });

    const result = await commentsQuery;

    const comments = result.slice(0, pageSizeInt);
    const endOfPaginationReached = result.length <= pageSizeInt;

    res.status(200).json({
      status: true,
      message: 'get comment replies successfully',
      data: {
        comments,
        endOfPaginationReached,
      },
    });
  } catch (error) {
    next(createHttpError(401, 'get comment replies failed'));
  }
};
