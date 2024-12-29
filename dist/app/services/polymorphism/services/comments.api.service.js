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
exports.CommentsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const comments_entity_1 = require("@/polymorphism/entities/comments.entity");
const subcomments_entity_1 = require("../entities/subcomments.entity");
let CommentsApiService = class CommentsApiService {
    index(empresa, commentsable_type, commentsable_id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 20, offset = 0 } = query || { limit: 20, offset: 0 };
            const offsetConverted = Number(offset);
            const limitConverted = Number(limit);
            const result = yield Promise.all([
                comments_entity_1.Comments.findAll({
                    offset: offsetConverted,
                    limit: limitConverted,
                    where: {
                        commentsable_type,
                        empresa_id: empresa.id,
                        commentsable_id,
                    },
                    order: [["createdAt", "DESC"]],
                }),
                comments_entity_1.Comments.count({
                    where: {
                        commentsable_type,
                        commentsable_id,
                        empresa_id: empresa.id,
                    },
                }),
            ]);
            const results = yield Promise.all(result[0].map((comment) => __awaiter(this, void 0, void 0, function* () {
                const [count, reactions] = yield Promise.all([
                    subcomments_entity_1.Subcomments.count({
                        where: { comment_id: comment.id },
                    }),
                    comment.$get("reactions", {
                        attributes: ["id", "user_id", "isLike"],
                    }),
                ]);
                return Object.assign(Object.assign({}, comment.toJSON()), { count,
                    reactions });
            })));
            return {
                success: true,
                count: result[1],
                results,
            };
        });
    }
    show(empresa, commentsable_type, commentsable_id, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comments_entity_1.Comments.findOne({
                where: {
                    commentsable_type,
                    commentsable_id,
                    empresa_id: empresa.id,
                    id,
                },
            });
            if (!comment)
                throw new express_core_2.NotFoundException(`No se encontró comentario con el id ${id} del ${commentsable_type} con el id ${commentsable_id}`);
            const count = yield subcomments_entity_1.Subcomments.count({
                where: { comment_id: comment.id },
            });
            return {
                success: true,
                comment,
                count,
            };
        });
    }
    store(empresa, commentsable_type, commentsable_id, commentsStoreDto, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = new comments_entity_1.Comments({
                commentsable_type,
                commentsable_id: Number(commentsable_id),
                content: commentsStoreDto.content,
                user_id,
                empresa_id: empresa.id,
            });
            yield comment.save();
            return {
                success: true,
                comment,
            };
        });
    }
    update(empresa, commentsable_type, commentsable_id, id, commentsUpdateDto, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comment } = yield this.show(empresa, commentsable_type, commentsable_id, id);
            if (user_id !== comment.user_id)
                throw new express_core_2.BadRequestException("No está permitido a relizar esta acción");
            yield comment.update(commentsUpdateDto);
            return {
                success: true,
                comment,
            };
        });
    }
    destroy(empresa, commentsable_type, commentsable_id, id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comment } = yield this.show(empresa, commentsable_type, commentsable_id, id);
            if (user_id !== comment.user_id)
                throw new express_core_2.BadRequestException("No está permitido a relizar esta acción");
            yield comment.destroy();
            return {
                success: true,
                message: `El comentario con el id: ${id}  del ${commentsable_type} con el id ${commentsable_id} fue eliminado`,
            };
        });
    }
};
exports.CommentsApiService = CommentsApiService;
exports.CommentsApiService = CommentsApiService = __decorate([
    (0, express_core_1.Injectable)()
], CommentsApiService);
