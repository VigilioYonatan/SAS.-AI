export async function vigilioServicesempresa() {
	const vigilio = await fetch(
		`${process.env.VITE_VIGILIO_WEB}/api/webs/${process.env.VITE_VIGILIO_TOKEN}`,
	);
	const responseV = await vigilio.json();
	if (!vigilio.ok)
		throw new Error(
			"Error al encontrar informacion de la web.Error en la web de vigilio services-",
		);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const clean = responseV.web.technologies.map((tech: any) => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const { technology, ...rest } = tech as any;
		return {
			...rest,
		};
	});
	return { success: true, result: { ...responseV.web, technologies: clean } };
}
