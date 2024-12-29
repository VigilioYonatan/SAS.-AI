"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsSeeder = void 0;
const helpers_1 = require("@vigilio/express-core/helpers");
const faker_1 = require("@faker-js/faker");
exports.postsSeeder = (0, helpers_1.customArray)(30).map(() => {
    return {
        content: faker_1.faker.lorem.sentence(15),
        image: [
            {
                file: "https://cdn.www.gob.pe/uploads/document/file/229199/standard_conferencia_de_prensa.jpg",
                dimension: 100,
            },
        ],
        title: faker_1.faker.lorem.sentence(8),
        user_id: 1,
        empresa_id: 1,
        likes: [],
    };
});
