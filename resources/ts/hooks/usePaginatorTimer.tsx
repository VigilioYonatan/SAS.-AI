import { useSignal } from "@preact/signals";

//  HOOK Para selecionar por año,mes, VALIDO PARA TABLAS PAGINACIONES
export type TimeTable =
	| "all"
	| "year"
	| "month"
	| "week"
	| "today"
	| "yesterday";
function usePaginatorTimer() {
	const time = useSignal<TimeTable>("all");

	const timeArray: { id: TimeTable; value: string }[] = [
		{ id: "all", value: "Todos" },
		{ id: "today", value: "Hoy" },
		{ id: "yesterday", value: "Ayer" },
		{ id: "week", value: "Semanal" },
		{ id: "month", value: "Mensual" },
		{ id: "year", value: "Anual" },
	];
	function onChangeTime(e: Event) {
		const date = (e.target as HTMLSelectElement).value as TimeTable;
		time.value = date;
	}

	function SelectTimer() {
		return (
			<select
				name="time"
				onChange={onChangeTime}
				class="px-4 py-2 rounded-md font-semibold bg-paper-light dark:bg-admin-terciary  dark:text-white shadow"
			>
				{timeArray.map((timer) => (
					<option
						key={timer.id}
						selected={timer.id === time.value}
						value={timer.id}
					>
						{timer.value}
					</option>
				))}
			</select>
		);
	}
	return {
		time: time.value,
		SelectTimer,
	};
}

export default usePaginatorTimer;
