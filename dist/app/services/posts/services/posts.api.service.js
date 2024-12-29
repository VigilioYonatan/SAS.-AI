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
exports.PostsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const posts_entity_1 = require("../entities/posts.entity");
const express_core_2 = require("@vigilio/express-core");
const helpers_1 = require("@/uploads/libs/helpers");
let PostsApiService = class PostsApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield posts_entity_1.Posts.findAll({
                where: { empresa_id: empresa.id },
            });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_entity_1.Posts.findOne({
                where: {
                    id,
                    empresa_id: empresa.id,
                },
            });
            if (!post) {
                throw new express_core_2.NotFoundException(`No se encontró un post con ${id}`);
            }
            return {
                success: true,
                post,
            };
        });
    }
    store(empresa, postsStoreDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = new posts_entity_1.Posts(Object.assign(Object.assign({}, postsStoreDto), { user_id: user.id, empresa_id: empresa.id, likes: [] }));
            yield post.save();
            return {
                success: true,
                post,
            };
        });
    }
    update(empresa, id, postsUpdateDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { post } = yield this.show(empresa, id);
            if (user) {
                yield post.update(Object.assign(Object.assign({}, postsUpdateDto), { user_id: user.id, empresa_id: empresa.id }));
            }
            else {
                yield post.update({
                    likes: postsUpdateDto.likes,
                });
            }
            return {
                success: true,
                post,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { post } = yield this.show(empresa, id);
            if (post.image) {
                (0, helpers_1.removeFile)(empresa.slug, post.image);
            }
            yield post.destroy();
            return {
                success: true,
                message: `Se eliminó correctamente el proveedor ${id}`,
            };
        });
    }
};
exports.PostsApiService = PostsApiService;
exports.PostsApiService = PostsApiService = __decorate([
    (0, express_core_1.Injectable)()
], PostsApiService);
