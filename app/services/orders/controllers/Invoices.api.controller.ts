import { Injectable, Req } from "@vigilio/express-core";
import { Controller, Get, Params } from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { InvoicesApiService } from "../services/invoices.api.service";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/invoices")
export class InvoicesApiController {
	constructor(private readonly invoicesApiService: InvoicesApiService) {}

	@Pipe(objectAsync({ kind_invoice_code: string("Este campo es obligatorio") }))
	@Get("/latest_correlativo/:kind_invoice_code")
	async latestCorrelativo(
		@Req("empresa") empresa: Empresas,
		@Params("kind_invoice_code") kind_invoice_code: string,
	) {
		const result = await this.invoicesApiService.latestCorrelativo(
			empresa,
			kind_invoice_code,
		);
		return result;
	}

	@Pipe(
		objectAsync({
			serie_correlative: string("Este campo es obligatorio"),
		}),
	)
	@Get("/:serie_correlative")
	async show(
		@Req("empresa") empresa: Empresas,
		@Params("serie_correlative") serie_correlative: string,
	) {
		const result = await this.invoicesApiService.show(
			empresa,
			serie_correlative,
		);
		return result;
	}
}
