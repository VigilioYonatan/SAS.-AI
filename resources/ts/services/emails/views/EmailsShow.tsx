import { formatDate } from "@vigilio/express-core/helpers";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { emailsShowApi } from "../apis/emails.show.api";
interface EmailsShowProps {
	id: number;
}
function EmailsShow({ id }: EmailsShowProps) {
	const emailshowIndex = emailsShowApi(id);

	let component = null;
	if (emailshowIndex.isLoading) {
		component = <Loading className="h-auto" />;
	}

	if (emailshowIndex.isError) {
		component = <View404 message={`No se encontró un email con el id ${id}`} />;
	}
	if (emailshowIndex.isSuccess) {
		const email = emailshowIndex.data!.email;
		component = (
			<div class="flex gap-4 flex-wrap justify-center  font-semibold">
				<h3 class="text-primary text-2xl font-bold">
					Enviado por <b>{email.name}</b>
				</h3>
				<div class="flex-1 min-w-[250px]  ">
					<div class="flex gap-1 flex-col mb-3  p-2 rounded-md odd:bg-paper-light odd:dark:bg-admin-terciary">
						<span class="text-primary dark:text-terciary font-bold">ID:</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
							{email.id}
						</span>
					</div>
					<div class="flex gap-1 flex-col mb-3  p-2 rounded-md odd:bg-paper-light odd:dark:bg-admin-terciary">
						<span class="text-primary dark:text-terciary font-bold">
							Nombre:
						</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
							{email.name}
						</span>
					</div>
					<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary p-2 rounded-md">
						<span class="text-primary dark:text-terciary font-bold">
							Asunto:
						</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
							{email.subject}
						</span>
					</div>
				</div>
				<div class="flex-1 min-w-[250px]">
					<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary p-2 rounded-md">
						<span class="text-primary dark:text-terciary font-bold">
							Contenido:
						</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
							{email.content}
						</span>
					</div>
					<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary p-2 rounded-md">
						<span class="text-primary dark:text-terciary font-bold">
							Correo electrónico:
						</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
							{email.email}
						</span>
					</div>
					<div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
						<span class="text-primary dark:text-terciary font-bold">
							Fecha:
						</span>
						<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
							{formatDate(email.createdAt!)}
						</span>
					</div>
				</div>
			</div>
		);
	}
	return component;
}

export default EmailsShow;
