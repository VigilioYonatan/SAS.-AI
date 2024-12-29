"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const ratings_entity_1 = require("@/polymorphism/entities/ratings.entity");
let RatingsApiService = class RatingsApiService {
    index(empresa, ratingsable_type, ratingsable_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ratings = yield ratings_entity_1.Ratings.findAll({
                where: {
                    empresa_id: empresa.id,
                    ratingsable_type,
                    ratingsable_id,
                },
            });
            return {
                success: true,
                data: ratings,
            };
        });
    }
    show(empresa, ratingsable_type, ratingsable_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rating = yield ratings_entity_1.Ratings.findOne({
                where: {
                    ratingsable_type,
                    ratingsable_id,
                    user_id,
                    empresa_id: empresa.id,
                },
            });
            if (!rating)
                throw new express_core_2.NotFoundException(`No se encontró un rating - ${ratingsable_type} con el id ${ratingsable_id}`);
            return {
                success: true,
                rating,
            };
        });
    }
    store(empresa, ratingsable_type, ratingsable_id, ratingsStoreDto, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rating = new ratings_entity_1.Ratings({
                ratingsable_type,
                ratingsable_id: Number(ratingsable_id),
                rating: ratingsStoreDto.rating,
                user_id,
                empresa_id: empresa.id,
            });
            yield rating.save();
            return {
                success: true,
                rating,
            };
        });
    }
    update(empresa, ratingsable_type, ratingsable_id, ratingsUpdateDto, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rating } = yield this.show(empresa, ratingsable_type, ratingsable_id, user_id);
            yield rating.update(ratingsUpdateDto);
            return {
                success: true,
                rating,
            };
        });
    }
    destroy(empresa, ratingsable_type, ratingsable_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rating } = yield this.show(empresa, ratingsable_type, ratingsable_id, user_id);
            yield rating.destroy();
            return {
                success: true,
                message: `El rating de usuario id: ${user_id}  del ${ratingsable_type} con el id ${ratingsable_id} fue eliminado`,
            };
        });
    }
};
exports.RatingsApiService = RatingsApiService;
exports.RatingsApiService = RatingsApiService = __decorate([
    (0, express_core_1.Injectable)()
], RatingsApiService);
