import { objectAsync, string } from "@vigilio/valibot";

export const uploadsStorePipe = objectAsync({
    entity: string("Este campo es obligatorio"),
    property: string("Este campo es obligatorio"),
});
