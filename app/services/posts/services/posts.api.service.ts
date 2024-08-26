import { Injectable } from "@vigilio/express-core";
import { Posts } from "../entities/posts.entity";
import { NotFoundException } from "@vigilio/express-core";
import type { PostsStoreDto } from "../dtos/posts.store.dto";
import type { PostsUpdateDto } from "../dtos/posts.update.dto";
import { removeFile } from "@/uploads/libs/helpers";
import type { Users } from "@/users/entities/users.entity";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class PostsApiService {
    async index(information: InformationEntity) {
        const data = await Posts.findAll({
            where: { information_id: information.id },
        });
        return {
            success: true,
            data,
        };
    }
    async show(information: InformationEntity, id: string) {
        const post = await Posts.findOne({
            where: {
                id,
                information_id: information.id,
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

    async store(
        information: InformationEntity,
        postsStoreDto: PostsStoreDto,
        user: Users
    ) {
        const post = new Posts({
            ...postsStoreDto,
            user_id: user.id,
            information_id: information.id,
        });
        await post.save();
        return {
            success: true,
            post,
        };
    }
    async update(
        information: InformationEntity,
        id: string,
        postsUpdateDto: PostsUpdateDto,
        user: Users
    ) {
        const { post } = await this.show(information, id);
        await post.update({
            ...postsUpdateDto,
            user_id: user.id,
            information_id: information.id,
        });
        return {
            success: true,
            post,
        };
    }

    async destroy(information: InformationEntity, id: string) {
        const { post } = await this.show(information, id);
        if (post.image) {
            removeFile(information.slug, post.image);
        }
        await post.destroy();
        return {
            success: true,
            message: `Se eliminó correctamente el proveedor ${id}`,
        };
    }
}
