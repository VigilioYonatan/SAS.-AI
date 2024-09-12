import {
	BadRequestException,
	NotFoundException,
	Injectable,
} from "@vigilio/express-core";
import type { CartStoreDto } from "../dtos/cart.store.dto";
import type { CartUpdateDto } from "../dtos/cart.update.dto";
import { Cart } from "../entites/cart.entity";
import type { CartSchemaFromServer } from "../schemas/cart.schema";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { Variants } from "@/products/entities/options/variants.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { productEntityId } from "@/products/libs";
import type { Users } from "@/users/entities/users.entity";

@Injectable()
export class CartApiService {
	async index(empresa: Empresas, user: Users) {
		const data = await Cart.findAll({
			where: { user_id: user.id, empresa_id: empresa.id },
			order: [["createdAt", "ASC"]], // show cart user for order created asc.
		});
		return {
			success: true,
			data,
		};
	}

	async show(
		empresa: Empresas,
		user_id: number,
		product_id: string,
		variant_id: string,
	) {
		const product = productEntityId(empresa);
		const cart = (await Cart.findOne({
			where: {
				user_id,
				[product]: product_id,
				empresa_id: empresa.id,
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

	async store(empresa: Empresas, user_id: number, cartStoreDto: CartStoreDto) {
		const productId = productEntityId(empresa);
		const existProductInCart = await Cart.findOne({
			where: {
				user_id,
				empresa_id: empresa.id,
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				[productId]: (cartStoreDto as any)[productId],
				variant_id: cartStoreDto.variant_id ? cartStoreDto.variant_id : null,
			},
		});
		if (existProductInCart)
			throw new BadRequestException("Ya existe este producto en el carrito");
		const cart = new Cart({
			...cartStoreDto,
			empresa_id: empresa.id,
		});
		cart.user_id = user_id;
		await cart.save();
		return {
			success: true,
			cart,
		};
	}

	async update(
		empresa: Empresas,
		userId: number,
		cartUpdateDto: CartUpdateDto,
		product_id: string,
		variant_id: string,
	) {
		const { cart } = await this.show(empresa, userId, product_id, variant_id);
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
			const productId = productEntityId(empresa);
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
		empresa: Empresas,
		userId: number,
		product_id: string,
		variant_id: string,
	) {
		const { cart } = await this.show(empresa, userId, product_id, variant_id);
		await (cart as Cart).destroy();
		return {
			success: true,
			message: `La cart con el product_id: ${product_id} fue eliminado`,
		};
	}
}
