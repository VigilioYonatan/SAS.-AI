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
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import {
    arrayAsync,
    mergeAsync,
    object,
    objectAsync,
    omitAsync,
    pickAsync,
    string,
} from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import { VigilioServicesGuard } from "../guards/vigilioservices.guard";
import {
    metodosPagoUpdateDto,
    type MetodosPagoUpdateDto,
} from "../dtos/metodosPago.update.dto";
import { EmpresasApiService } from "../services/empresas.api.service";
import {
    contactsSchema,
    empresasSchema,
    groupWhatsapp,
    payments,
    scheduleSchema,
    whatsappconfig,
    type ContactsSchema,
    type EmpresasSchema,
    type GroupWhatsapp,
    type Payments,
    type ScheduleSchema,
    type Whatsappconfig,
} from "../schemas/empresas.schema";
import {
    empresasStoreDto,
    type EmpresasStoreDto,
} from "../dtos/empresas.store.dto";
import type { Empresas } from "../entities/empresas.entity";
import {
    empresasUpdateDto,
    type EmpresasUpdateDto,
} from "../dtos/empresas.update.dto";
import {
    empresasAddressUpdateDto,
    type EmpresasAddressUpdateDto,
} from "../dtos/empresas.address.update.dto";
import {
    empresasFacturacionUpdateDto,
    type EmpresasFacturacionUpdateDto,
} from "../dtos/empresas.facturacion.store.dto";
import {
    empresasIAUpdateDto,
    type EmpresasIAUpdateDto,
} from "../dtos/empresas.ia.update.dto";
import { hostSchema } from "../schemas/settings.schema";
import {
    settingsUpdateDto,
    type SettingsUpdateDto,
} from "../dtos/settings.update.dto";

@Injectable()
@Controller("/empresas")
export class EmpresasApiController {
    constructor(private readonly empresaApiService: EmpresasApiService) {}

    @VigilioServicesGuard()
    @Pipe(objectAsync({ slug: string() }))
    @Get("/:slug/payment")
    async payment(@Params("slug") slug: string) {
        const result = await this.empresaApiService.payment(slug);
        return result;
    }
    @VigilioServicesGuard()
    @Pipe(objectAsync({ slug: string() }))
    @Get("/:slug/settings")
    async settings(@Params("slug") slug: string) {
        const result = await this.empresaApiService.settings(slug);
        return result;
    }

    @Validator(settingsUpdateDto)
    @VigilioServicesGuard()
    @Pipe(objectAsync({ slug: string() }))
    @Status(201)
    @Put("/:slug/settings")
    async updateSettings(
        @Body() body: SettingsUpdateDto,
        @Params("slug") slug: string
    ) {
        const result = await this.empresaApiService.updateSettings(slug, body);
        return result;
    }

    @VigilioServicesGuard()
    @Validator(
        mergeAsync([payments, object({ token: string(), secure: string() })])
    )
    @Pipe(objectAsync({ slug: string() }))
    @Put("/:slug/payment")
    async paymentUpdate(
        @Params("slug") slug: string,
        @Body() paymentDto: Payments & { token: string; secure: string }
    ) {
        const result = await this.empresaApiService.paymentUpdate(
            slug,
            paymentDto
        );
        return result;
    }

    @VigilioServicesGuard()
    @Validator(empresasStoreDto)
    @Post("/")
    async store(@Body() body: EmpresasStoreDto) {
        const result = await this.empresaApiService.store(body);
        return result;
    }

    @Get("/whatsapp_mode")
    async whatsapp_mode_get(@Req("empresa") empresa: Empresas) {
        return {
            success: true,
            whatsapp_mode: empresa.whatsapp_mode,
        };
    }
    @Validator(pickAsync(empresasSchema, ["whatsapp_mode"]))
    @Post("/whatsapp_mode")
    async whatsapp_mode(
        @Req("empresa") empresa: Empresas,
        @Body() body: Pick<EmpresasSchema, "whatsapp_mode">
    ) {
        const result = await this.empresaApiService.whatsapp_mode(
            empresa,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Get("/private")
    async private(@Req("empresa") empresa: Empresas) {
        const result = await this.empresaApiService.private(empresa.slug);
        return result;
    }

    @VigilioServicesGuard()
    @Pipe(objectAsync({ slug: string() }))
    @Get("/:slug/metodos_pago")
    async metodos_pago(@Params("slug") slug: string) {
        const result = await this.empresaApiService.metodos_pago(slug);
        return result;
    }
    @Validator(metodosPagoUpdateDto)
    @Pipe(objectAsync({ slug: string() }))
    @Put("/:slug/metodos_pago")
    async metodospago(
        @Params("slug") slug: string,
        @Body() body: MetodosPagoUpdateDto
    ) {
        const result = await this.empresaApiService.metodospago(slug, body);
        return result;
    }
    @PermissionAdmin()
    @Get("/group-whatsapp")
    async whatsappGroupIndex(@Req("empresa") empresa: Empresas) {
        const result = await this.empresaApiService.whatsappGroupIndex(
            empresa.slug
        );
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            name: string(),
        })
    )
    @Get("/group-whatsapp/:name")
    async whatsappGroupShow(
        @Params("name") name: string,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.empresaApiService.whatsappGroupShow(
            empresa.slug,
            name
        );
        return result;
    }

    @PermissionAdmin()
    @Validator(groupWhatsapp)
    @Status(201)
    @Post("/group-whatsapp")
    async whatsappGroupStore(
        @Body() body: GroupWhatsapp,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.empresaApiService.whatsappGroupStore(
            empresa.slug,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Validator(whatsappconfig)
    @Status(201)
    @Put("/whatsapp-config")
    async whatsappConfigUpdate(
        @Body() body: Whatsappconfig,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.empresaApiService.whatsappConfigUpdate(
            empresa.slug,
            body
        );
        return result;
    }
    @VigilioServicesGuard()
    @Pipe(objectAsync({ slug: string() }))
    @Validator(pickAsync(hostSchema, ["host"]))
    @Status(201)
    @Put("/:slug/dominio")
    async dominio(
        @Body() body: { host: string | null },
        @Params("slug") slug: string
    ) {
        const result = await this.empresaApiService.dominio(slug, body);
        return result;
    }
    @VigilioServicesGuard()
    @Pipe(objectAsync({ slug: string() }))
    @Status(201)
    @Put("/:slug/name_servers")
    async name_servers(@Params("slug") slug: string) {
        const result = await this.empresaApiService.name_servers(slug);
        return result;
    }
    @VigilioServicesGuard()
    @Pipe(objectAsync({ slug: string() }))
    @Status(201)
    @Delete("/:slug/dominio")
    async deleteDominio(@Params("slug") slug: string) {
        const result = await this.empresaApiService.deleteDominio(slug);
        return result;
    }
    @PermissionAdmin()
    @Validator(groupWhatsapp)
    @Status(201)
    @Put("/group-whatsapp")
    async whatsappGroupUpdate(
        @Body() body: GroupWhatsapp,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.empresaApiService.whatsappGroupUpdate(
            empresa.slug,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            group: string(),
        })
    )
    @Status(201)
    @Delete("/group-whatsapp/:group")
    async whatsappGroupDestroy(
        @Params("group") group: string,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.empresaApiService.whatsappGroupDestroy(
            empresa.slug,
            group
        );
        return result;
    }
    @PermissionAdmin()
    @Pipe(
        objectAsync({
            telephone: string(),
            group: string(),
        })
    )
    @Status(201)
    @Delete("/group-whatsapp/:group/telephone/:telephone")
    async whatsappGroupTelephoneDestroy(
        @Params("group") group: string,
        @Req("empresa") empresa: Empresas,
        @Params("telephone") telephone: string
    ) {
        const result =
            await this.empresaApiService.whatsappGroupTelephoneDestroy(
                empresa.slug,
                group,
                telephone
            );
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug")
    async show(@Params("slug") slug: string) {
        const result = await this.empresaApiService.show(slug);
        return result;
    }

    @PermissionAdmin()
    @Validator(empresasUpdateDto)
    @Status(201)
    @Put("/")
    async update(
        @Body() body: EmpresasUpdateDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.empresaApiService.update(empresa, body);
        return result;
    }

    @PermissionAdmin()
    @Validator(empresasAddressUpdateDto)
    @Status(201)
    @Put("/address")
    async address(
        @Body() body: EmpresasAddressUpdateDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.empresaApiService.address(empresa, body);
        return result;
    }

    @PermissionAdmin()
    @Validator(empresasFacturacionUpdateDto)
    @Status(201)
    @Put("/company")
    async company(
        @Body() body: EmpresasFacturacionUpdateDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.empresaApiService.company(empresa, body);
        return result;
    }

    @PermissionAdmin()
    @Validator(empresasIAUpdateDto)
    @Status(201)
    @Put("/ia")
    async inteligenceArtificial(
        @Body() body: EmpresasIAUpdateDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.empresaApiService.inteligenceArtificial(
            empresa.slug,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Status(200)
    @Get("/contacts")
    async all(@Req("empresa") empresa: Empresas) {
        const result = await this.empresaApiService.all(empresa.slug);
        return result;
    }

    @PermissionAdmin()
    @Validator(contactsSchema)
    @Status(201)
    @Post("/contacts")
    async contactstore(
        @Req("empresa") empresa: Empresas,
        @Body() body: ContactsSchema
    ) {
        const result = await this.empresaApiService.contactStore(
            empresa.slug,
            body
        );
        return result;
    }

    @Status(200)
    @Get("/contacts/favorites")
    async favorites(@Req("empresa") empresa: Empresas) {
        const result = await this.empresaApiService.favorites(empresa.slug);
        return result;
    }

    @Validator(omitAsync(contactsSchema, ["telephone", "name"]))
    @Pipe(
        objectAsync({
            telephone: string(),
        })
    )
    @Status(201)
    @Put("/contacts/:telephone")
    async contacts(
        @Req("empresa") empresa: Empresas,
        @Params("telephone") telephone: string,
        @Body() body: { ia: boolean; isFavorite: boolean }
    ) {
        const result = await this.empresaApiService.contacts(
            empresa.slug,
            telephone,
            body
        );
        return result;
    }

    @Pipe(
        objectAsync({
            name: string(),
        })
    )
    @Get("/contacts/:name")
    async searchContact(
        @Req("empresa") empresa: Empresas,
        @Params("name") name: string
    ) {
        const result = await this.empresaApiService.searchContact(
            empresa.slug,
            name
        );
        return result;
    }

    @PermissionAdmin()
    @Delete("/contacts")
    async deleteContact(@Req("empresa") empresa: Empresas) {
        const result = await this.empresaApiService.deleteContact(empresa);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            telephone: string(),
        })
    )
    @Status(201)
    @Delete("/contacts/:telephone")
    async destroyContact(
        @Req("empresa") empresa: Empresas,
        @Params("telephone") telephone: string
    ) {
        const result = await this.empresaApiService.contactDestroy(
            empresa.slug,
            telephone
        );
        return result;
    }

    @PermissionAdmin()
    @Status(201)
    @Validator(objectAsync({ schedule: arrayAsync(scheduleSchema) }))
    @Put("/schedule")
    async scheduleUpdate(
        @Body() body: { schedule: ScheduleSchema[] },
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.empresaApiService.scheduleUpdate(
            empresa,
            body
        );
        return result;
    }

    @Status(201)
    @VigilioServicesGuard()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Delete("/:id")
    async destroy(@Params("id") id: string) {
        const result = await this.empresaApiService.destroy(id);
        return result;
    }
}
