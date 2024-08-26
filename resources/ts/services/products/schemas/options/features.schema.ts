import {
    type Input,
    number,
    object,
    string,
    minLength,
    toTrimmed,
    maxLength,
} from "@vigilio/valibot";

export const featuresSchema = object({
    id: number(),
    value: string([toTrimmed(), minLength(1), maxLength(45)]),
    description: string([toTrimmed(), minLength(1), maxLength(45)]),
    option_id: number(),
});
export type FeaturesSchema = Input<typeof featuresSchema>;
