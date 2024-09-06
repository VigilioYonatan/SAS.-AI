import { Injectable, Req } from "@vigilio/express-core";
import { Controller, Get } from "@vigilio/express-core";
import { AdminApiService } from "../services/admin.api.service";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import { InformationEntity } from "@/information/entities/information.entity";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";

@Injectable()
@Controller("/admin")
export class AdminApiController {
	constructor(private readonly adminApiService: AdminApiService) {}

	// dashboard
	@PermissionAuth()
	@Get("/dashboard")
	async dashboard(@Req("information") information: InformationEntity) {
		const result = await this.adminApiService.dashboard(information);
		return result;
	}

	@PermissionAdmin()
	@Get("/earning")
	async earning(@Req("information") information: InformationEntity) {
		const result = await this.adminApiService.earning(information);
		return result;
	}
	@PermissionAuth()
	@Get("/orders")
	async orders(@Req("information") information: InformationEntity) {
		const result = await this.adminApiService.orders(information);
		return result;
	}
	@PermissionAuth()
	@Get("/deliverys")
	async deliverys(@Req("information") information: InformationEntity) {
		const result = await this.adminApiService.deliverys(information);
		return result;
	}

	//sistema de  facturacion
	@PermissionAdmin()
	@Get("/facturation_system")
	async facturationSystem(@Req("information") information: InformationEntity) {
		const result = await this.adminApiService.facturationSystem(information);
		return result;
	}
}
