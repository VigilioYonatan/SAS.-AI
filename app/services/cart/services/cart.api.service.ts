import {
	BadRequestException,
	NotFoundException,
	Injectable,
} from "@vigilio/express-core";
import type { CartStoreDto } from "../dtos/cart.store.dto";
import type { CartUpdateDto } from "../dtos/cart.update.dto";
import { Cart } from "../entites/cart.entity";
import type { CartSchemaFromServer } from "../schemas/cart.schema";
import type { InformationEntity } from "@/information/entities/information.entity";
import { Variants } from "@/products/entities/options/variants.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { productEntityId } from "@/products/libs";
import type { Users } from "@/users/entities/users.entity";

@Injectable()
export class CartApiService {
	async index(information: InformationEntity, user: Users) {
		const data = await Cart.findAll({
			where: { user_id: user.id, information_id: information.id },
			order: [["createdAt", "ASC"]], // show cart user for order created asc.
		});
		return {
			success: true,
			data,
		};
	}

	async show(
		information: InformationEntity,
		user_id: number,
		product_id: string,
		variant_id: string,
	) {
		const product = productEntityId(information);
		const cart = (await Cart.findOne({
			where: {
				user_id,
				[product]: product_id,
				information_id: information.id,
				variant_id: variant_id ? variant_id : null,
			},
			include: [ProductsNormal, ProductsServicio, ProductsRestaurant, Variants],
		})) as CartSchemaFromServer;

		if (!cart) {
			throw new NotFoundException(`No se encontró un cart con ${product_id}`);
		}
		return {
			success: true,
			cart,
		};
	}

	async store(
		information: InformationEntity,
		user_id: number,
		cartStoreDto: CartStoreDto,
	) {
		const productId = productEntityId(information);
		const existProductInCart = await Cart.findOne({
			where: {
				user_id,
				information_id: information.id,
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				[productId]: (cartStoreDto as any)[productId],
				variant_id: cartStoreDto.variant_id ? cartStoreDto.variant_id : null,
			},
		});
		if (existProductInCart)
			throw new BadRequestException("Ya existe este producto en el carrito");
		const cart = new Cart({
			...cartStoreDto,
			information_id: information.id,
		});
		cart.user_id = user_id;
		await cart.save();
		return {
			success: true,
			cart,
		};
	}

	async update(
		information: InformationEntity,
		userId: number,
		cartUpdateDto: CartUpdateDto,
		product_id: string,
		variant_id: string,
	) {
		const { cart } = await this.show(
			information,
			userId,
			product_id,
			variant_id,
		);
		if (cart.variant) {
			if (
				cart.variant.stock && // if product is stock
				cart.variant.stock > cartUpdateDto.quantity && // quantity should dont be  more than stock
				cartUpdateDto.quantity < 1 // quantity should dont be less than 1
			)
				throw new BadRequestException(
					"Hubo un error al modificar este comentario",
				);
		} else {
			const productId = productEntityId(information);
			if (
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(cart as any)[productId].stock && // if product is stock
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(cart as any)[productId].stock > cartUpdateDto.quantity && // quantity should dont be  more than stock
				cartUpdateDto.quantity < 1 // quantity should dont be less than 1
			)
				throw new BadRequestException(
					"Hubo un error al modificar este comentario",
				);
		}

		await (cart as Cart).update(cartUpdateDto);
		return {
			success: true,
			cart,
		};
	}

	async destroy(
		information: InformationEntity,
		userId: number,
		product_id: string,
		variant_id: string,
	) {
		const { cart } = await this.show(
			information,
			userId,
			product_id,
			variant_id,
		);
		await (cart as Cart).destroy();
		return {
			success: true,
			message: `La cart con el product_id: ${product_id} fue eliminado`,
		};
	}
}
