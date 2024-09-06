import { customArray } from "@vigilio/express-core/helpers";
import type { SuppliersSchema } from "../schemas/suppliers.schema";
import { faker } from "@faker-js/faker";

export const suppliersSeeder: Omit<SuppliersSchema, "id">[] = customArray(
    30
).map((_, i) => {
    return {
        supplier_code: `PROV-${i + 1}`,
        ruc: `2030303030${i + 1}`,
        razon_social: `Computers Integration ${i + 1} S.A`,
        activity: "Venta de vegetales",
        address: faker.location.streetAddress(),
        contact: "(01) 223-232-493",
        phone_one: `93434334${i}`,
        phone_two: null,
        email: faker.internet.email(),
        email2: null,
        web: faker.internet.url(),
        logo: [
            {
                file: faker.image.urlLoremFlickr({ category: "brand" }),
                dimension: 100,
            },
        ],
        empresa_id: 1,
    };
});
