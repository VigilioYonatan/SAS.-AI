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
	empresasLogoPWAQualities,
	empresasLogoQualities,
} from "@/empresas/libs";
import type { Request } from "express";
import { UsersApiService } from "@/users/services/users.api.service";
import { ProductsApiService } from "@/products/services/products.api.service";
import { usersPhotoQualities } from "@/users/libs";
import { Users } from "@/users/entities/users.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { ordersTransferenciaImage } from "@/orders/libs";
import { EmpresasApiService } from "@/empresas/services/empresas.api.service";
import { postsImageQualities } from "@/posts/libs";
import { PostsApiService } from "@/posts/services/posts.api.service";
import { BackgroundApiService } from "@/empresas/services/background.api.service";
import { CategoriesApiService } from "@/products/services/categories.api.service";
import { BrandsApiService } from "@/products/services/brands.api.service";
import { SettingsApiService } from "@/empresas/services/settings.api.service";
import { suppliersLogoQualities } from "@/suppliers/libs";
import { SuppliersApiService } from "@/suppliers/services/suppliers.api.service";

@Injectable()
export class UploadsService {
	constructor(
		private readonly usersApiService: UsersApiService,
		private readonly productsApiService: ProductsApiService,
		private readonly empresasApiService: EmpresasApiService,
		private readonly postsApiService: PostsApiService,
		private readonly backgroundApiService: BackgroundApiService,
		private readonly categoriesApiService: CategoriesApiService,
		private readonly brandsApiService: BrandsApiService,
		private readonly settingsApiService: SettingsApiService,
		private readonly suppliersApiService: SuppliersApiService,
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
			empresa,
		} = props.req as Request & {
			files: File[];
			filesName: string;
			empresa: Empresas;
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
			case "suppliers":
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				if (property === "logo") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						suppliersLogoQualities,
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
			case "empresas":
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
						empresasLogoQualities,
					);
				}
				if (property === "logo_pwa") {
					qualities = await this.customUpload(
						files,
						{
							minFiles: 1,
							maxFiles: 1,
							required: true,
						},
						empresasLogoPWAQualities,
						undefined,
						true,
					);
				}

				break;
			default:
				throw new InternalServerErrorException(
					"Error server, comunicarse con desarrollador",
				);
		}
		const responseFile = await uploadFiles({
			empresa,
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
			empresa,
		} = props.req as Request & {
			files: File[];
			filesName: string;
			empresa: Empresas;
		};
		const userAuth = props.req.user as Users | null;
		let entidad = null;
		switch (entity) {
			case "users": {
				if (!userAuth || !userAuth.enabled || userAuth.id !== Number(id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { user } = await this.usersApiService.show(empresa, id);
				entidad = user;
				if (user.photo) {
					removeFile(empresa.slug, user.photo);
				}
				break;
			}
			case "products": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);

				const { product } = await this.productsApiService.show(empresa, id);
				entidad = product;
				if (product.images) {
					removeFile(empresa.slug, product.images);
				}
				break;
			}

			case "settings": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { data } = await this.settingsApiService.index(empresa);
				entidad = data;

				if (property === "icon" && data.icon) {
					removeFile(empresa.slug, data.icon);
				}
				if (property === "photo" && data.photo) {
					removeFile(empresa.slug, data.photo);
				}

				break;
			}
			case "categories": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { category } = await this.categoriesApiService.show(empresa, id);
				entidad = category;
				if (property === "image" && category.image) {
					removeFile(empresa.slug, category.image);
				}

				break;
			}
			case "brands": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { brand } = await this.brandsApiService.show(empresa, id);
				entidad = brand;
				if (property === "image" && brand.image) {
					removeFile(empresa.slug, brand.image);
				}
				break;
			}
			case "metodos_pago": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { metodo } = await this.empresasApiService.metodos_pago(
					empresa.slug,
				);
				entidad = metodo;
				if (property === "qrPlin") {
					if (metodo.qrPlin) {
						removeFile(empresa.slug, metodo.qrPlin);
					}
				}
				if (property === "qrYape") {
					if (metodo.qrYape) {
						removeFile(empresa.slug, metodo.qrYape);
					}
				}

				break;
			}
			case "posts": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { post } = await this.postsApiService.show(empresa, id);
				entidad = post;
				if (property === "image") {
					removeFile(empresa.slug, post.image);
				}

				break;
			}
			case "background": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { background } = await this.backgroundApiService.show(
					empresa,
					id,
				);
				entidad = background;
				if (property === "image") {
					removeFile(empresa.slug, background.image);
				}
				break;
			}
			case "suppliers": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				const { supplier } = await this.suppliersApiService.show(empresa, id);
				entidad = supplier;
				if (property === "logo") {
					if (supplier.logo) {
						removeFile(empresa.slug, supplier.logo);
					}
				}
				break;
			}
			case "empresas": {
				if (!userAuth || !userAuth.enabled || ![1].includes(userAuth.role_id))
					throw new UnauthorizedException(
						"No tiene permiso para realizar esta acción",
					);
				entidad = empresa;
				if (property === "logo" && empresa.logo) {
					removeFile(empresa.slug, empresa.logo);
				}
				if (property === "logo_pwa" && empresa.logo_pwa) {
					removeFile(empresa.slug, empresa.logo_pwa);
				}
				if (property === "certificado" && empresa.certificado) {
					removeFile(empresa.slug, empresa.certificado);
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
		isPwa?: boolean,
	) {
		try {
			await validateUpload(files, validation);
			return { qualities, directory, isPwa };
		} catch (error) {
			throw new BadRequestException(error as string);
		}
	}
}
