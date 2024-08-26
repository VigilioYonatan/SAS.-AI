import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import Form from "~/components/form";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { NOW } from "~/libs/helpers";
import { useForm } from "react-hook-form";
import type { ScheduleSchema } from "../schemas/information.schema";
import { informationScheduleUpdateApi } from "../apis/information.schedule.update.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import useInformationstore from "../stores/information.store";

function InformationSchedule() {
	const useInformation = useInformationstore();

	return (
		<Container className="p-2 min-h-screen">
			<div className="flex flex-col gap-4 mx-1 ">
				<AdminBreadCrumb current="Horario de Atención" />
			</div>
			<span class="font-semibold dark:text-secondary-light">
				Horario de Atención
			</span>
			<AlertInfo>
				<span class="text-center flex flex-col items-center w-full justify-center">
					Si vas a atender las 24 horas <b>12:00 am - 11:59 pm</b>
				</span>
			</AlertInfo>
			<table class="w-full">
				<thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary dark:text-secondary-light dark:text-terciary-dark uppercase  shadow-sm  border-b dark:border-admin-terciary">
					<tr>
						<th class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
							Día
						</th>
						<th class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
							Abrir
						</th>
						<th class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
							Cerrar
						</th>
						<th class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
							Editar
						</th>
					</tr>
				</thead>
				<tbody>
					{useInformation.state?.schedule.map((schedule) => (
						<tr
							class={`border-b  dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light ${
								NOW().day() === schedule.id ? "bg-primary  font-bold" : ""
							}`}
							key={schedule.id}
						>
							<td class=" whitespace-nowrap text-center  text-xs lg:text-sm">
								{schedule.day}
							</td>
							<td class=" whitespace-nowrap text-center  text-xs lg:text-sm">
								<i class="fal fa-stopwatch text-xs mr-1" /> {schedule.openTime}
							</td>
							<td class=" whitespace-nowrap text-center  text-xs lg:text-sm">
								<i class="fal fa-stopwatch text-xs mr-1" />
								{schedule.closeTime}
							</td>
							<td class="">
								<button
									type="button"
									aria-label="to edit"
									onClick={() => {
										sweetModal({
											html: reactComponent(
												<ScheduleEdit
													schedule={schedule}
													schedules={useInformation.state?.schedule!}
												/>,
											),
											showCloseButton: true,
											isCloseInBackground: false,
										});
									}}
									class="bg-orange-600 px-2 py-2 rounded-md text-white flex justify-center items-center mx-auto"
								>
									<i class="fas fa-pen" />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Container>
	);
}
function ScheduleEdit({
	schedule,
	schedules,
}: {
	schedule: ScheduleSchema;
	schedules: ScheduleSchema[];
}) {
	const formDate = useForm<Pick<ScheduleSchema, "openTime" | "closeTime">>({
		defaultValues: {
			closeTime: schedule.closeTime,
			openTime: schedule.openTime,
		},
	});
	const informationScheduleUpdateMutation = informationScheduleUpdateApi();
	function updateDate(body: Pick<ScheduleSchema, "openTime" | "closeTime">) {
		const mapped = schedules.map((sch) =>
			sch.id === schedule.id
				? { ...sch, openTime: body.openTime, closeTime: body.closeTime }
				: sch,
		);

		informationScheduleUpdateMutation.mutate(
			{ schedule: mapped },
			{
				onSuccess(data) {
					sweetAlert({
						icon: "success",
						title: data.message,
						showCloseButton: true,
					}).then(() => {
						window.location.reload();
					});
				},
				onError(error) {
					sweetAlert({ icon: "success", title: error.message });
				},
			},
		);
	}

	return (
		<div>
			<h3 class="mb-2 text-primary">{schedule.day}</h3>
			<Form {...formDate} onSubmit={updateDate}>
				<Form.control
					placeholder="Hora para abrir"
					title="Hora Abrir"
					name="openTime"
					type="time"
				/>
				<Form.control
					placeholder="Hora para cerrar"
					title="Hora Cerrar"
					name="closeTime"
					type="time"
				/>
				<Form.button.submit
					title="Actualizar"
					ico={null}
					disabled={informationScheduleUpdateMutation.isLoading || false}
					isLoading={informationScheduleUpdateMutation.isLoading || false}
				/>
			</Form>
		</div>
	);
}
export default InformationSchedule;
