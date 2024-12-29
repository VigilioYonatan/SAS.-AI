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
exports.ReactionsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const reactions_entity_1 = require("@/polymorphism/entities/reactions.entity");
let ReactionsApiService = class ReactionsApiService {
    index(empresa, reactionsable_type, reactionsable_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reactions = yield reactions_entity_1.Reactions.findAll({
                where: {
                    reactionsable_type,
                    reactionsable_id,
                    empresa_id: empresa.id,
                },
            });
            return {
                success: true,
                data: reactions,
            };
        });
    }
    show(empresa, reactionsable_type, reactionsable_id, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reaction = yield reactions_entity_1.Reactions.findOne({
                where: {
                    reactionsable_type,
                    reactionsable_id,
                    id,
                    empresa_id: empresa.id,
                },
            });
            if (!reaction)
                throw new express_core_2.NotFoundException(`No se encontró un comentario con el id ${id} del ${reactionsable_type} con el id ${reactionsable_id}`);
            return {
                success: true,
                reaction,
            };
        });
    }
    store(empresa, reactionsable_type, reactionsable_id, reactionsStoreDto, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reaction = new reactions_entity_1.Reactions({
                reactionsable_type,
                reactionsable_id: Number(reactionsable_id),
                isLike: reactionsStoreDto.isLike,
                user_id,
                empresa_id: empresa.id,
            });
            yield reaction.save();
            return {
                success: true,
                reaction,
            };
        });
    }
    update(empresa, reactionsable_type, reactionsable_id, id, reactionsUpdateDto, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reaction } = yield this.show(empresa, reactionsable_type, reactionsable_id, id);
            if (user_id !== reaction.user_id)
                throw new express_core_2.BadRequestException("No está permitido a relizar esta acción");
            yield reaction.update(reactionsUpdateDto);
            return {
                success: true,
                reaction,
            };
        });
    }
    destroy(empresa, reactionsable_type, reactionsable_id, id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reaction } = yield this.show(empresa, reactionsable_type, reactionsable_id, id);
            if (user_id !== reaction.user_id)
                throw new express_core_2.BadRequestException("No está permitido a relizar esta acción");
            yield reaction.destroy();
            return {
                success: true,
                message: `La reacción con el id: ${id}  del ${reactionsable_type} con el id ${reactionsable_id} fue eliminado`,
            };
        });
    }
};
exports.ReactionsApiService = ReactionsApiService;
exports.ReactionsApiService = ReactionsApiService = __decorate([
    (0, express_core_1.Injectable)()
], ReactionsApiService);
