"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailsSendAllDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const emails_store_dto_1 = require("./emails.store.dto");
exports.emailsSendAllDto = (0, valibot_1.mergeAsync)([
    (0, valibot_1.omitAsync)(emails_store_dto_1.emailsStoreDto, ["name", "email"]),
    (0, valibot_1.object)({
        title: (0, valibot_1.string)([(0, valibot_1.minLength)(5)]),
        content: (0, valibot_1.string)([(0, valibot_1.minLength)(5)]),
    }),
]);
