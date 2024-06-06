import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import { SitterStatus } from '@prisma/client';
import { paginationSchema } from '@schema/pagination';
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

    const { photography_price, health_care_price, bath_price, walking_price } = req.body;

    if (!photography_price && !health_care_price && !bath_price && !walking_price) {
      throw createHttpError(400, 'Please provide at least one service');
    }

    await prisma.sitter.update({
      where: {
        user_id: _req.user!.id,
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
        has_police_check: sitter!.police_check_image != null,
        user: {
          update: {
            is_sitter: true,
          },
        },
      },
    });
    res.status(200).json({
      status: true,
      message: 'Approve sitter successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const sitterReject = async (req: SitterRequest, res: Response, next: NextFunction) => {
  try {
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
    res.status(200).json({ status: true, message: 'Reject sitter successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSitterService = async (req: SitterRequest, res: Response, next: NextFunction) => {
  try {
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
    const service_district_list = req.query.service_district_list
      ? Array.isArray(req.query.service_district_list)
        ? (req.query.service_district_list as string[])[0].split(',')
        : [req.query.service_district_list]
      : [];
    const service_type_list = req.query.service_type_list
      ? Array.isArray(req.query.service_type_list)
        ? (req.query.service_type_list as string[])[0].split(',').map((type) => type.toLowerCase())
        : [req.query.service_type_list]
      : [];
    const certificate_list = req.query.certificate_list
      ? Array.isArray(req.query.certificate_list)
        ? (req.query.certificate_list as string[])[0].split(',').map((cert) => cert.toLowerCase())
        : [req.query.certificate_list]
      : [];

    const notNullConditions = service_type_list.map((type) => ({ [`${type}_price`]: { not: null } }));
    const notNullCertificates = certificate_list.map((type) => ({ [`${type}`]: { not: false } }));
    const { page, limit, offset } = paginationSchema.parse(req.query);

    const parsedQuery = sitterRequestQuerySchema.parse({
      query: {
        service_city: req.query.service_city,
        service_district_list,
      },
    }).query;

    console.log('Parsed Query:', parsedQuery);
    console.log('service_type_list notNullConditions:', notNullConditions);
    console.log('certificate_list notNullCertificates:', notNullCertificates);

    const queryParams = {
      where: {
        service_city: parsedQuery.service_city,
        service_district_list: {
          hasSome: parsedQuery.service_district_list,
        },
        AND: [...notNullConditions, ...notNullCertificates],
      },
    };

    console.log('Prisma Query:', queryParams);
    const [sitters, total] = await prisma.$transaction([
      prisma.sitter.findMany({
        ...queryParams,
        take: limit,
        skip: (page - 1) * limit + offset,
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.sitter.count({ ...queryParams }),
    ]);

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
        total: total,
        message: 'Get sitter service list successfully',
      },
    });
  } catch (error) {
    console.error('Error in getSitterServiceList:', error);
    next(error);
  }
};
