import { ProductsApiService } from "../services/products.api.service";
import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
    Put,
    Status,
    Injectable,
    Req,
    Query,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import {
    productsNormalStoreDto,
    productsNormalUpdateDto,
    type ProductsNormalStoreDto,
    type ProductsNormalUpdateDto,
} from "../dtos/products_normal.dto";
import {
    productsRestaurantStoreDto,
    productsRestaurantUpdateDto,
    type ProductsRestaurantStoreDto,
    type ProductsRestaurantUpdateDto,
} from "../dtos/products_restaurant.dto";
import {
    productsServicioStoreDto,
    productsServicioUpdateDto,
    type ProductsServicioStoreDto,
    type ProductsServicioUpdateDto,
} from "../dtos/products_servicio.dto";
import {
    variantsUpdateDto,
    type VariantsUpdateDto,
} from "../dtos/options/variants.update.dto";
@Injectable()
@Controller("/products")
export class ProductsApiController {
    constructor(private readonly productsApiService: ProductsApiService) {}

    @Get("/")
    async index(
        @Req("empresa") empresa: Empresas,
        @Query("token") token: string
    ) {
        const result = await this.productsApiService.index(empresa, token);
        return result;
    }

    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug")
    async show(
        @Params("slug") slug: string,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.productsApiService.show(empresa, slug, true);
        return result;
    }
    @Pipe(
        objectAsync({
            slug: string(),
            variant_id: string(),
        })
    )
    @Get("/:slug/variants/:variant_id")
    async variant(
        @Req("empresa") empresa: Empresas,
        @Params("slug") slug: string,
        @Params("variant_id") variant_id: string
    ) {
        const result = await this.productsApiService.variant(
            empresa,
            slug,
            variant_id
        );
        return result;
    }

    @PermissionAdmin()
    @Validator(variantsUpdateDto)
    @Pipe(
        objectAsync({
            slug: string(),
            variant_id: string(),
        })
    )
    @Put("/:slug/variants/:variant_id")
    async variantUpdate(
        @Req("empresa") empresa: Empresas,
        @Params("slug") slug: string,
        @Params("variant_id") variant_id: string,
        @Body() body: VariantsUpdateDto
    ) {
        const result = await this.productsApiService.variantUpdate(
            empresa,
            slug,
            variant_id,
            body
        );
        return result;
    }
    @PermissionAdmin()
    @Pipe(
        objectAsync({
            slug: string(),
            variant_id: string(),
        })
    )
    @Delete("/:slug/variants/:variant_id")
    async varianDelete(
        @Req("empresa") empresa: Empresas,
        @Params("slug") slug: string,
        @Params("variant_id") variant_id: string
    ) {
        const result = await this.productsApiService.varianDelete(
            empresa,
            slug,
            variant_id
        );
        return result;
    }
    @Pipe(
        objectAsync({
            slug: string(),
            coupon: string(),
        })
    )
    @Get("/:slug/coupon/:coupon")
    async coupon(
        @Params("slug") slug: string,
        @Params("coupon") coupon: string,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.productsApiService.coupon(
            slug,
            coupon,
            empresa
        );
        return result;
    }

    @PermissionAdmin()
    @Validator(productsNormalStoreDto)
    @Status(201)
    @Post("/normal")
    async storeNormal(
        @Body() body: ProductsNormalStoreDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.productsApiService.store(empresa, body);
        return result;
    }
    @PermissionAdmin()
    @Validator(productsRestaurantStoreDto)
    @Status(201)
    @Post("/restaurant")
    async storeRestaurant(
        @Body() body: ProductsRestaurantStoreDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.productsApiService.store(empresa, body);
        return result;
    }

    @PermissionAdmin()
    @Validator(productsServicioStoreDto)
    @Status(201)
    @Post("/servicio")
    async storeServicio(
        @Body() body: ProductsServicioStoreDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.productsApiService.store(empresa, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Validator(productsNormalUpdateDto)
    @Status(201)
    @Put("/:id/normal")
    async updateNormal(
        @Params("id") id: string,
        @Body() body: ProductsNormalUpdateDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.productsApiService.update(empresa, id, body);
        return result;
    }
    @Validator(productsRestaurantUpdateDto)
    @Status(201)
    @Put("/:id/restaurant")
    async updateRestaurant(
        @Params("id") id: string,
        @Body() body: ProductsRestaurantUpdateDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.productsApiService.update(empresa, id, body);
        return result;
    }
    @Validator(productsServicioUpdateDto)
    @Status(201)
    @Put("/:id/servicio")
    async updateServicio(
        @Params("id") id: string,
        @Body() body: ProductsServicioUpdateDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.productsApiService.update(empresa, id, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Status(201)
    @Delete("/:id")
    async destroy(@Params("id") id: string, @Req("empresa") empresa: Empresas) {
        const result = await this.productsApiService.destroy(empresa, id);
        return result;
    }
}
