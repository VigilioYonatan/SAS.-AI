import { Injectable } from "@vigilio/express-core";
import { Options } from "@/products/entities/options/options.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { Features } from "@/products/entities/options/features.entity";

@Injectable()
export class OptionsApiService {
	async index() {
		const data = await Options.findAll({});
		return {
			success: true,
			data,
		};
	}

	async features(empresa: Empresas) {
		const { data } = await this.index();
		const features = await Promise.all(
			data.map(async (option) => {
				let features = (await option.$get("features")) as Features[];
				if (option.name === "Calzado") {
					if (empresa.dial_code === "52") {
						features = features.filter((f) => f.description.endsWith("MX"));
					}

					if (empresa.dial_code === "55")
						features = features.filter((f) => f.description.endsWith("BR"));
					if (!["52", "55"].includes(empresa.dial_code)) {
						features = features.filter(
							(f) =>
								!f.description.endsWith("BR") && !f.description.endsWith("MX"),
						);
					}
				}

				return {
					...option.toJSON(),
					features,
				};
			}),
		);
		return {
			success: true,
			data: features,
		};
	}
}
