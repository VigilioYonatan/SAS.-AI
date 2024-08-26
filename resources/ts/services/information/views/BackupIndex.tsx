import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { showTime } from "~/libs/helpers";
import enviroments from "~/config";
import { backupIndexApi } from "../apis/backup/backup.index.api";
import { backupStoreApi } from "../apis/backup/backup.store.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import LoaderSubmit from "~/components/LoaderSubmit";
import AlertInfo from "~/components/Alerts/AlertInfo";

function BackupIndex() {
	const backupIndexQuery = backupIndexApi();
	let component = null;
	if (backupIndexQuery.isLoading) {
		component = <Loading className="h-[300px]" />;
	}
	if (backupIndexQuery.isError) {
		component = <View404 message="error al backup" />;
	}
	if (backupIndexQuery.isSuccess) {
		const backupStoreQuery = backupStoreApi();
		component = (
			<div class=" dark:text-white">
				<div class="w-full flex justify-between items-center mb-4">
					<button
						disabled={backupStoreQuery.isLoading || false}
						aria-label="create respaldo"
						type="button"
						class="bg-primary px-4 py-2 text-xs  text-white rounded-md"
						onClick={() => {
							sweetModal({
								title: "Estas seguro de crear un respaldo?",
								showCancelButton: true,
								showCloseButton: true,
							}).then(({ isConfirmed }) => {
								if (isConfirmed) {
									backupStoreQuery.mutate(null, {
										onSuccess(data) {
											backupIndexQuery.refetch();
											sweetAlert({
												icon: "success",
												title: data.message,
											});
										},
										onError(data) {
											sweetAlert({
												icon: "danger",
												title: data.message,
												height: 100,
											});
										},
									});
								}
							});
						}}
					>
						{backupStoreQuery.isLoading ? (
							<LoaderSubmit />
						) : (
							<>
								<i class="fas fa-database" /> Crear respaldo
							</>
						)}
					</button>
					<a
						href={`${enviroments.VITE_URL}/api/backup/files`}
						class="bg-yellow-600 self-end py-2  px-4 rounded-md  text-xs  font-bold text-white flex justify-center items-center gap-2"
					>
						<i class="fas fa-download" /> Descargar tus archivos
					</a>
				</div>

				<table class="w-full ">
					<thead class=" bg-primary">
						<tr class="text-white ">
							<th>ID</th>
							<th>fecha</th>
							<th>acciones</th>
						</tr>
					</thead>{" "}
					<tbody>
						{backupIndexQuery.data?.data.length ? (
							<>
								{backupIndexQuery.data?.data!.map((backup) => (
									<tr key={backup.id}>
										<td>
											<div class="flex justify-center items-center text-xs text-black dark:white">
												{backup.id}
											</div>
										</td>
										<td>
											<div class=" flex justify-center items-center text-xs text-black dark:white">
												{showTime(backup.createdAt)}
											</div>
										</td>
										<td>
											<div class=" flex justify-center items-center text-xs">
												<a
													class="bg-blue-500 px-2 text-white py-2 rounded-md text-xs mx-auto"
													href={`${enviroments.VITE_URL}/${backup.file}`}
													download={backup.file}
												>
													<i class="fas fa-download" /> Descargar
												</a>
											</div>
										</td>
									</tr>
								))}
							</>
						) : (
							<tr>
								<td />
								<td class="text-center mx-auto">No hay respaldos</td>
								<td />
							</tr>
						)}
					</tbody>
				</table>
			</div>
		);
	}
	return (
		<div>
			<h1 class="text-primary dark:text-white font-bold tracking-wider mb-6 text-center">
				Respaldos
			</h1>
			<AlertInfo>Por seguridad, No compartir tus archivos</AlertInfo>
			{component}
		</div>
	);
}

export default BackupIndex;
