"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.SubcommentsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const subcomments_entity_1 = require("../entities/subcomments.entity");
const comments_api_service_1 = require("@/polymorphism/services/comments.api.service");
let SubcommentsApiService = class SubcommentsApiService {
    constructor(commentsApiService) {
        this.commentsApiService = commentsApiService;
    }
    index(empresa, commentsable_type, commentsable_id, subcommentables_id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 20, offset = 0 } = query || {
                limit: 20,
                offset: 0,
            };
            const offsetConverted = Number(offset);
            const limitConverted = Number(limit);
            const { comment } = yield this.commentsApiService.show(empresa, commentsable_type, commentsable_id, subcommentables_id);
            const [results, count] = yield Promise.all([
                comment.$get("subcomments", {
                    offset: offsetConverted,
                    limit: limitConverted,
                    order: [["createdAt", "DESC"]],
                }),
                subcomments_entity_1.Subcomments.count({
                    where: { comment_id: comment.id, empresa_id: empresa.id },
                }),
            ]);
            const mappedSubcomments = yield Promise.all(results.map((sub) => __awaiter(this, void 0, void 0, function* () {
                const reactions = yield sub.$get("reactions", {
                    attributes: ["id", "user_id", "isLike"],
                });
                return Object.assign(Object.assign({}, sub.toJSON()), { reactions });
            })));
            return {
                success: true,
                count,
                results: mappedSubcomments,
            };
        });
    }
    show(empresa, commentsable_type, commentsable_id, subcommentables_id, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comment } = yield this.commentsApiService.show(empresa, commentsable_type, commentsable_id, subcommentables_id);
            const subcommentary = (yield comment.$get("subcomments", {
                where: { id },
            }));
            if (!subcommentary[0])
                throw new express_core_2.NotFoundException(`No se encontró subcomentario con el id ${id} del ${commentsable_type} con el id ${commentsable_id}`);
            return {
                success: true,
                subcomment: subcommentary[0],
            };
        });
    }
    store(empresa, commentsable_type, commentsable_id, subcommentables_id, subcommentsStoreDto, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comment } = yield this.commentsApiService.show(empresa, commentsable_type, commentsable_id, subcommentables_id);
            const subcomment = yield comment.$create("subcomment", Object.assign(Object.assign({}, subcommentsStoreDto), { subcommentsable_id: commentsable_id, subcommentsable_type: commentsable_type, user_id, empresa_id: empresa.id }));
            return {
                success: true,
                subcomment,
            };
        });
    }
    update(empresa, commentsable_type, commentsable_id, subcommentables_id, id, subcommentsUpdateDto, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subcomment } = yield this.show(empresa, commentsable_type, commentsable_id, subcommentables_id, id);
            if (user_id !== subcomment.user_id)
                throw new express_core_2.BadRequestException("No está permitido a relizar esta acción");
            yield subcomment.update(subcommentsUpdateDto);
            return {
                success: true,
                subcomment,
            };
        });
    }
    destroy(empresa, commentsable_type, commentsable_id, subcommentables_id, id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subcomment } = yield this.show(empresa, commentsable_type, commentsable_id, subcommentables_id, id);
            if (user_id !== subcomment.user_id)
                throw new express_core_2.BadRequestException("No está permitido a relizar esta acción");
            yield subcomment.destroy();
            return {
                success: true,
                message: `El subcomentario con el id: ${id}  del ${commentsable_type} con el id ${commentsable_id} fue eliminado`,
            };
        });
    }
};
exports.SubcommentsApiService = SubcommentsApiService;
exports.SubcommentsApiService = SubcommentsApiService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [comments_api_service_1.CommentsApiService])
], SubcommentsApiService);
