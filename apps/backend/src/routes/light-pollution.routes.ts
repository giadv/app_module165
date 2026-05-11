import { Router, Request, Response } from 'express';
import { LightPollutionModel } from '../models/light-pollution.model';

export const lightPollutionRouter = Router();

// GET /api/light-pollution — retourne la moyenne de LimitingMag par année et par pays
lightPollutionRouter.get('/', async (_req: Request, res: Response) => {
    const result = await LightPollutionModel.aggregate([
        {
            $match: {
                year: { $ne: null },
                Country: { $nin: [null, 'None'] },
                LimitingMag: { $gt: 0 },
            },
        },
        {
            $group: {
                _id: { year: '$year', country: '$Country' },
                value: { $avg: '$LimitingMag' },
            },
        },
        {
            $project: {
                _id: 0,
                year: '$_id.year',
                country: '$_id.country',
                value: { $round: ['$value', 2] },
            },
        },
        { $sort: { year: 1, country: 1 } },
    ]);

    res.json(result);
});
