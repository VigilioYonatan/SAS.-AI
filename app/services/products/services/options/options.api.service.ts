import { Injectable } from "@vigilio/express-core";
import { Options } from "@/products/entities/options/options.entity";

@Injectable()
export class OptionsApiService {
	async index() {
		const data = await Options.findAll({});
		return {
			success: true,
			data,
		};
	}

	async features() {
		const { data } = await this.index();
		const features = await Promise.all(
			data.map(async (option) => {
				const features = await option.$get("features");
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
