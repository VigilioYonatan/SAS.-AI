"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suppliersSeeder = void 0;
const helpers_1 = require("@vigilio/express-core/helpers");
const faker_1 = require("@faker-js/faker");
exports.suppliersSeeder = (0, helpers_1.customArray)(30).map((_, i) => {
    return {
        supplier_code: `PROV-${i + 1}`,
        ruc: `2030303030${i + 1}`,
        razon_social: `Computers Integration ${i + 1} S.A`,
        activity: "Venta de vegetales",
        address: faker_1.faker.location.streetAddress(),
        contact: "(01) 223-232-493",
        phone_one: `93434334${i}`,
        phone_two: null,
        email: faker_1.faker.internet.email(),
        email2: null,
        web: faker_1.faker.internet.url(),
        logo: [
            {
                file: faker_1.faker.image.urlLoremFlickr({ category: "brand" }),
                dimension: 100,
            },
        ],
        empresa_id: 1,
    };
});
