import { BadRequestException, Injectable } from "@vigilio/express-core";
import { Posts } from "../entities/posts.entity";
import { NotFoundException } from "@vigilio/express-core";
import type { PostsStoreDto } from "../dtos/posts.store.dto";
import type { PostsUpdateDto } from "../dtos/posts.update.dto";
import { removeFile } from "@/uploads/libs/helpers";
import type { Users } from "@/users/entities/users.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { slug } from "@vigilio/express-core/helpers";
import { Op } from "sequelize";

@Injectable()
export class PostsApiService {
    async index(empresa: Empresas) {
        const data = await Posts.findAll({
            where: { empresa_id: empresa.id },
        });
        return {
            success: true,
            data,
        };
    }
    async show(empresa: Empresas, id: string) {
        const post = await Posts.findOne({
            where: {
                id,
                empresa_id: empresa.id,
            },
        });

        if (!post) {
            throw new NotFoundException(`No se encontró un post con ${id}`);
        }
        return {
            success: true,
            post,
        };
    }

    async store(empresa: Empresas, postsStoreDto: PostsStoreDto, user: Users) {
        const [byName] = await Promise.all([
            Posts.findOne({
                where: { title: postsStoreDto.title, empresa_id: empresa.id },
            }),
        ]);
        if (byName)
            throw new BadRequestException(
                `Ya existe un post con el title ${postsStoreDto.title}`
            );
        const post = new Posts({
            ...postsStoreDto,
            user_id: user.id,
            empresa_id: empresa.id,
            likes: [],
        });
        if (!postsStoreDto.slug) {
            post.slug = slug(post.title);
        } else {
            const [bySlug] = await Promise.all([
                Posts.findOne({
                    where: {
                        slug: postsStoreDto.slug,
                        empresa_id: empresa.id,
                    },
                }),
            ]);
            if (bySlug)
                throw new BadRequestException(
                    `Ya existe un post con el slug ${postsStoreDto.title}`
                );
        }
        await post.save();
        return {
            success: true,
            post,
        };
    }
    async update(
        empresa: Empresas,
        id: string,
        postsUpdateDto: PostsUpdateDto,
        user: Users
    ) {
        const { post } = await this.show(empresa, id);
        const [byTitle] = await Promise.all([
            Posts.findOne({
                where: {
                    title: postsUpdateDto.title,
                    [Op.not]: {
                        id: post.id,
                    },
                },
            }),
        ]);
        if (byTitle)
            throw new BadRequestException(
                `Ya existe un blog con el titulo ${post.title}`
            );
        if (!postsUpdateDto.slug) {
            post.slug = slug(post.title);
        } else {
            const [bySlug] = await Promise.all([
                Posts.findOne({
                    where: {
                        title: postsUpdateDto.slug,
                        [Op.not]: {
                            id: post.id,
                        },
                    },
                }),
            ]);
            if (bySlug)
                throw new BadRequestException(
                    `Ya existe un blog con el slug ${post.title}`
                );
        }
        if (user) {
            await post.update({
                ...postsUpdateDto,
                user_id: user.id,
                empresa_id: empresa.id,
            });
        } else {
            await post.update({
                likes: postsUpdateDto.likes,
            });
        }

        return {
            success: true,
            post,
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { post } = await this.show(empresa, id);
        if (post.image) {
            await removeFile(empresa.slug, post.image);
        }
        await post.destroy();
        return {
            success: true,
            message: `Se eliminó correctamente el proveedor ${id}`,
        };
    }
}
