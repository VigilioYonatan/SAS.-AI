import { Injectable, Req } from "@vigilio/express-core";
import { Controller, Get } from "@vigilio/express-core";
import { AdminApiService } from "../services/admin.api.service";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";

@Injectable()
@Controller("/admin")
export class AdminApiController {
    constructor(private readonly adminApiService: AdminApiService) {}

    // dashboard
    @PermissionAuth()
    @Get("/dashboard")
    async dashboard(@Req("empresa") empresa: Empresas) {
        const result = await this.adminApiService.dashboard(empresa);
        return result;
    }

    @PermissionAdmin()
    @Get("/earning")
    async earning(@Req("empresa") empresa: Empresas) {
        const result = await this.adminApiService.earning(empresa);
        return result;
    }
    @PermissionAuth()
    @Get("/orders")
    async orders(@Req("empresa") empresa: Empresas) {
        const result = await this.adminApiService.orders(empresa);
        return result;
    }
    @PermissionAuth()
    @Get("/deliverys")
    async deliverys(@Req("empresa") empresa: Empresas) {
        const result = await this.adminApiService.deliverys(empresa);
        return result;
    }

    //sistema de  facturacion
    @PermissionAdmin()
    @Get("/facturation_system")
    async facturationSystem(@Req("empresa") empresa: Empresas) {
        const result = await this.adminApiService.facturationSystem(empresa);
        return result;
    }
}
