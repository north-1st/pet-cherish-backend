import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import { SitterStatus } from '@prisma/client';
import {
  SitterRequest,
  applySitterRequestSchema,
  sitterRequestQuerySchema,
  updateSitterServiceRequestSchema,
} from '@schema/sitter';

export const applySitter = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const req = applySitterRequestSchema.parse(_req);

    await prisma.sitter.create({
      data: {
        user_id: _req.user!.id,
        ...req.body,
        status: SitterStatus.APPROVING,
      },
    });
    res.status(201).json({
      status: true,
      message: 'Apply sitter successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateSitterService = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const req = updateSitterServiceRequestSchema.parse(_req);
    const userId = _req.user!.id;

    const sitter = await prisma.sitter.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        user: true,
      },
    });

    if (!sitter) {
      throw createHttpError(404, 'You are not a sitter');
    }

    if (!sitter.user.is_sitter) {
      throw createHttpError(400, 'Sitter is not approved');
    }

    const { photography_price, health_care_price, bath_price, walking_price } = req.body;

    if (!photography_price && !health_care_price && !bath_price && !walking_price) {
      throw createHttpError(400, 'Please provide at least one service');
    }

    await prisma.sitter.update({
      where: {
        user_id: userId,
      },
      data: {
        ...req.body,
        status: SitterStatus.ON_BOARD,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Update sitter service successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const sitterApprove = async (req: SitterRequest, res: Response, next: NextFunction) => {
  try {
    const sitter = await prisma.sitter.findUnique({
      where: {
        user_id: req.params.user_id,
      },
      include: {
        user: true,
      },
    });

    if (!sitter?.user) {
      throw createHttpError(404, 'User not found');
    }

    await prisma.sitter.update({
      where: {
        user_id: req.params.user_id,
      },
      include: {
        user: true,
      },
      data: {
        status: SitterStatus.PASS,
        has_certificate: true,
        has_police_check: sitter.police_check_image != null,
        user: {
          update: {
            is_sitter: true,
          },
        },
      },
    });
    res.status(200).json({
      status: true,
      message: 'Sitter has been approved',
    });
  } catch (error) {
    next(error);
  }
};

export const sitterReject = async (req: SitterRequest, res: Response, next: NextFunction) => {
  try {
    const sitter = await prisma.sitter.findUnique({
      where: {
        user_id: req.params.user_id,
      },
    });

    if (!sitter) {
      throw createHttpError(404, 'Sitter not found');
    }

    await prisma.sitter.update({
      where: {
        user_id: req.params.user_id,
      },
      include: {
        user: true,
      },
      data: {
        status: SitterStatus.REJECTED,
        has_certificate: false,
        has_police_check: false,
        user: {
          update: {
            is_sitter: false,
          },
        },
      },
    });
    res.status(200).json({ status: true, message: 'Sitter has been rejected' });
  } catch (error) {
    next(error);
  }
};

export const getSitterService = async (req: SitterRequest, res: Response, next: NextFunction) => {
  try {
    const sitter = await prisma.sitter.findUnique({
      where: {
        user_id: req.params.user_id,
      },
    });

    if (!sitter) {
      throw createHttpError(404, 'Sitter not found');
    }

    if (sitter.status != SitterStatus.PASS && sitter.status != SitterStatus.ON_BOARD) {
      throw createHttpError(400, 'Sitter is not approved');
    }

    const sitterService = await prisma.sitter.findUnique({
      where: {
        user_id: req.params.user_id,
      },
      omit: {
        certificate_number: true,
        certificate_image: true,
        police_check_image: true,
      },
    });

    res.status(200).json({
      status: true,
      data: sitterService,
      message: 'Get sitter service successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getSitterServiceList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 将查询参数转换为正确的格式，并处理数组参数
    const service_district_list = req.query.service_district_list
      ? Array.isArray(req.query.service_district_list)
        ? (req.query.service_district_list as string[])[0].split(',')
        : [req.query.service_district_list]
      : [];
    const service_type_list = req.query.service_type_list
      ? Array.isArray(req.query.service_type_list)
        ? req.query.service_type_list
        : [req.query.service_type_list]
      : [];
    const certificate_list = req.query.certificate_list
      ? Array.isArray(req.query.certificate_list)
        ? req.query.certificate_list
        : [req.query.certificate_list]
      : [];

    // 检查 service_district_list 和 service_type_list 是否为空数组
    if (service_district_list.length === 0 || service_type_list.length === 0) {
      res.status(400).json({
        status: false,
        message: 'service_district_list and service_type_list must contain at least one element',
      });
      return;
    }

    const parsedQuery = sitterRequestQuerySchema.parse({
      query: {
        service_city: req.query.service_city,
        service_district_list,
        service_type_list,
        certificate_list,
        page: req.query.page,
        limit: req.query.limit,
      },
    }).query;

    const {
      service_city,
      // service_district_list: districts,
      // service_type_list: types,
      // certificate_list: certificates,
      page,
      limit,
    } = parsedQuery;
    console.log('Parsed Query:', parsedQuery);

    const query = {
      service_city,
      // service_district_list: { hasSome: districts },
      // service_size_list: { hasSome: types },
    };

    // // if (certificates && certificates.length > 0) {
    // //   query.certificate_list = { hasSome: certificates };
    // // }

    console.log('Prisma Query:', query);

    const sitters = await prisma.sitter.findMany({
      // where: query,
      where: {
        service_city: service_city,
      },
      // skip: (page - 1) * limit,
      // take: limit,
    });

    const total = await prisma.sitter.count({ where: query });

    res.status(200).json({
      status: true,
      data: {
        sitter_list: sitters,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          has_next_page: page < Math.ceil(total / limit),
          has_prev_page: page > 1,
        },
      },
      message: 'Get sitter service list successfully',
    });
  } catch (error) {
    console.error('Error in getSitterServiceList:', error);
    next(error);
  }
};
