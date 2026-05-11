import { Schema, model, Document } from 'mongoose';

export interface ILightPollution extends Document {
    year: number;
    Country: string;
    LimitingMag: number;
}

const lightPollutionSchema = new Schema<ILightPollution>(
    {
        year: { type: Number },
        Country: { type: String },
        LimitingMag: { type: Number },
    },
    { strict: false },
);

export const LightPollutionModel = model<ILightPollution>('LightPollution', lightPollutionSchema);
