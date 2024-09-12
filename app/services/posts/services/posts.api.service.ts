import { Injectable } from "@vigilio/express-core";
import { Posts } from "../entities/posts.entity";
import { NotFoundException } from "@vigilio/express-core";
import type { PostsStoreDto } from "../dtos/posts.store.dto";
import type { PostsUpdateDto } from "../dtos/posts.update.dto";
import { removeFile } from "@/uploads/libs/helpers";
import type { Users } from "@/users/entities/users.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";

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
		const post = new Posts({
			...postsStoreDto,
			user_id: user.id,
			empresa_id: empresa.id,
		});
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
		user: Users,
	) {
		const { post } = await this.show(empresa, id);
		await post.update({
			...postsUpdateDto,
			user_id: user.id,
			empresa_id: empresa.id,
		});
		return {
			success: true,
			post,
		};
	}

	async destroy(empresa: Empresas, id: string) {
		const { post } = await this.show(empresa, id);
		if (post.image) {
			removeFile(empresa.slug, post.image);
		}
		await post.destroy();
		return {
			success: true,
			message: `Se eliminó correctamente el proveedor ${id}`,
		};
	}
}
