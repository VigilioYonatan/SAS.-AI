import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";

function Instagram() {
	return (
		<Container className="p-2">
			<div className=" flex flex-col gap-4">
				<AdminBreadCrumb current="Instagram" />
			</div>
			<div class="min-h-[600px] w-[500px] flex items-center flex-col">
				<h3 class="text-primary font-bold text-xl text-center">Muy Pronto</h3>
				<p class="text-sm dark:text-white font-semibold  text-center">
					Siguenos en nuestras redes sociales para ver nuevas novedades <br />
					<a
						href="https://www.vigilio-services.com"
						target="_blank"
						rel="noreferrer"
						class="text-primary hover:underline"
					>
						Más información
					</a>
				</p>
				<img
					class="object-contain"
					width={300}
					height={300}
					src="/images/settings/others/astronaut.png"
					alt=""
				/>
			</div>
		</Container>
	);
}

export default Instagram;
