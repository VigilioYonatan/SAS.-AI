import { Injectable } from "@vigilio/express-core";
import type { File } from "formidable";
import {
	validateUpload,
	type ValidationProps,
} from "@vigilio/express-core/helpers";
import {
	BadRequestException,
	InternalServerErrorException,
	UnauthorizedException,
} from "@vigilio/express-core";
import {
	removeFile,
	uploadFiles,
	type UploadsEntities,
	type UploadsProperties,
} from "../libs/helpers";
import {
	brandsImageQualities,
	categoriesImageQualities,
	productsImagesQualities,
} from "@/products/libs";
import {
	backgroundQualities,
	informationLogoQualities,
} from "@/information/libs";
import type { Request } from "express";
import { UsersApiService } from "@/users/services/users.api.service";
import { ProductsApiService } from "@/products/services/products.api.service";
import { usersPhotoQualities } from "@/users/libs";
import { Users } from "@/users/entities/users.entity";
import { InformationEntity } from "@/information/entities/information.entity";
import { ordersTransferenciaImage } from "@/orders/libs";
import { InformationApiService } from "@/information/services/information.api.service";
import { postsImageQualities } from "@/posts/libs";
import { PostsApiService } from "@/posts/services/posts.api.service";
import { BackgroundApiService } from "@/information/services/background.api.service";
import { CategoriesApiService } from "@/products/services/categories.api.service";
import { BrandsApiService } from "@/products/services/brands.api.service";
import { SettingsApiService } from "@/information/services/settings.api.service";

@Injectable()
export class UploadsService {
	constructor(
		private readonly usersApiService: UsersApiService,
		private readonly productsApiService: ProductsApiService,
		private readonly informationApiService: InformationApiService,
		private readonly postsApiService: PostsApiService,
		private readonly backgroundApiService: BackgroundApiService,
		private readonly categoriesApiService: CategoriesApiService,
		private readonly brandsApiService: BrandsApiService,
		private readonly settingsApiService: SettingsApiService,
	) {}
	async store(props: {
		req: Request;

		entity: UploadsEntities;
		property: UploadsProperties;
	}) {
		const { entity, property } = props;
		const {
			files,
			filesName: name,
			information,
		} = props.req as Request & {
			files: File[];
			filesName: string;
			information: InformationEntity;
		};
		const userAuth = props.req.user as Users | null;

		let qualities = {} as { qualities: number[] | null; directory: string };

		switch (entity) {
			case "users":
				if (property === "photo") {
					qualities = await this.customUpload(
						files,
						{ maxFiles: 1, required: false },
						usersPhotoQualities,
					);
				}
				break;
			case "products":
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				if (property === "images") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 12,
							required: false,
						},
						productsImagesQualities,
					);
				}
				break;

			case "settings":
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);

				if (property === "icon") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						[100, 300],
					);
				}
				if (property === "photo") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						[800],
					);
				}

				break;
			case "categories":
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				if (property === "image") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						categoriesImageQualities,
					);
				}
				break;
			case "brands":
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				if (property === "image") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						brandsImageQualities,
					);
				}
				break;
			case "orders":
				if (property === "transferencia_image") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						ordersTransferenciaImage,
					);
				}
				break;
			case "posts":
				if (property === "image") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						postsImageQualities,
					);
				}
				break;
			case "metodos_pago":
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				if (property === "qrYape") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						[500],
					);
				}
				if (property === "qrPlin") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						[500],
					);
				}
				break;
			case "background":
				if (property === "image") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						backgroundQualities,
					);
				}
				break;
			case "information":
				if (property === "certificado") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
							typeFile: {
								value: [
									"application/x-pkcs12",
									"application/x-x509-ca-cert",
									"application/octet-stream",
								],
							},
						},
						null,
						"/files",
					);
				}
				if (property === "logo") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						informationLogoQualities,
					);
				}

				break;
			default:
				throw new InternalServerErrorException(
					"Error server, comunicarse con desarrollador",
				);
		}
		const responseFile = await uploadFiles({
			empresa: information.slug,
			files,
			entity,
			name,
			...qualities,
		});
		return {
			success: true,
			files: responseFile,
		};
	}
	async update(props: {
		req: Request;
		id: string;
		entity: UploadsEntities;
		property: UploadsProperties;
	}) {
		const { entity, property, id } = props;
		const {
			files,
			filesName: name,
			information,
		} = props.req as Request & {
			files: File[];
			filesName: string;
			information: InformationEntity;
		};
		const userAuth = props.req.user as Users | null;
		let entidad = null;
		switch (entity) {
			case "users": {
				if (!userAuth || !userAuth.enabled || userAuth.id !== Number(id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { user } = await this.usersApiService.show(information, id);
				entidad = user;
				if (user.photo) {
					removeFile(information.slug, user.photo);
				}
				break;
			}
			case "products": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);

				const { product } = await this.productsApiService.show(information, id);
				entidad = product;
				if (product.images) {
					removeFile(information.slug, product.images);
				}
				break;
			}

			case "settings": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { data } = await this.settingsApiService.index(information);
				entidad = data;

				if (property === "icon" && data.icon) {
					removeFile(information.slug, data.icon);
				}
				if (property === "photo" && data.photo) {
					removeFile(information.slug, data.photo);
				}

				break;
			}
			case "categories": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { category } = await this.categoriesApiService.show(
					information,
					id,
				);
				entidad = category;
				if (property === "image" && category.image) {
					removeFile(information.slug, category.image);
				}

				break;
			}
			case "brands": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { brand } = await this.brandsApiService.show(information, id);
				entidad = brand;
				if (property === "image" && brand.image) {
					removeFile(information.slug, brand.image);
				}
				break;
			}
			case "metodos_pago": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { metodo } =
					await this.informationApiService.metodos_pago(information);
				entidad = metodo;
				if (property === "qrPlin") {
					if (metodo.qrPlin) {
						removeFile(information.slug, metodo.qrPlin);
					}
				}
				if (property === "qrYape") {
					if (metodo.qrYape) {
						removeFile(information.slug, metodo.qrYape);
					}
				}

				break;
			}
			case "posts": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { post } = await this.postsApiService.show(information, id);
				entidad = post;
				if (property === "image") {
					removeFile(information.slug, post.image);
				}

				break;
			}
			case "background": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { background } = await this.backgroundApiService.show(
					information,
					id,
				);
				entidad = background;
				if (property === "image") {
					removeFile(information.slug, background.image);
				}
				break;
			}
			case "information": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				entidad = information;
				if (property === "logo" && information.logo) {
					removeFile(information.slug, information.logo);
				}
				break;
			}
			default:
				throw new BadRequestException(
					"Error server, comunicarse con desarrollador",
				);
		}
		let filesFoto = null;
		if (files) {
			const { files: responseFile } = await this.store({
				req: props.req,
				entity,
				property,
			});
			filesFoto = responseFile;
		}
		/*
        type here is so difficult but  i know that you understand me
        */

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(entidad as any)[property] = filesFoto;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		await (entidad as any).save();
		return {
			success: true,
			files: filesFoto,
		};
	}
	async customUpload(
		files: File[],
		validation: ValidationProps,
		qualities: number[] | null,
		directory = "/images",
	) {
		try {
			await validateUpload(files, validation);
			return { qualities, directory };
		} catch (error) {
			throw new BadRequestException(error as string);
		}
	}
}
