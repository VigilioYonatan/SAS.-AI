import { useState } from "react";

interface CalendarProps {
	changeMonth?: boolean;
	showTitle?: boolean;
	language?: "es" | "en";
	onPickDate?: (day: string | number) => void;
	initialDate?: Date;
}

function Calendar({
	changeMonth = true,
	showTitle = true,
	language = "es",
	onPickDate,
	initialDate = new Date(),
}: CalendarProps) {
	const [date, setDate] = useState<Date>(initialDate);

	const daysOfWeek: string[] =
		language === "es"
			? ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
			: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const months: string[] =
		language === "es"
			? [
					"Enero",
					"Febrero",
					"Marzo",
					"Abril",
					"Mayo",
					"Junio",
					"Julio",
					"Agosto",
					"Setiembre",
					"Octubre",
					"Noviembre",
					"Diciembre",
				]
			: [
					"January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
					"August",
					"September",
					"October",
					"November",
					"December",
				];

	const previousMonth = (): void => {
		setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
	};

	const nextMonth = (): void => {
		setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
	};

	const renderDays = (): (number | string)[] => {
		const firstDayOfMonth: number = new Date(
			date.getFullYear(),
			date.getMonth(),
			1,
		).getDay();
		const daysInMonth: number = new Date(
			date.getFullYear(),
			date.getMonth() + 1,
			0,
		).getDate();
		const days: (number | string)[] = [];

		// Fill days before the current month
		for (let i = firstDayOfMonth; i > 0; i--) {
			days.push("");
		}

		// Fill days of the current month
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(i);
		}

		return days;
	};

	return (
		<div className="mx-auto w-full">
			<div
				className={`flex ${
					changeMonth ? "justify-between" : "justify-center"
				} items-center mb-4`}
			>
				{changeMonth ? (
					<button
						type="button"
						aria-label="change month"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						onClick={previousMonth}
					>
						Previous
					</button>
				) : null}
				{showTitle ? (
					<span className="text-xl">
						{months[date.getMonth()]} {date.getFullYear()}
					</span>
				) : null}
				{changeMonth ? (
					<button
						type="button"
						aria-label="change month"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						onClick={nextMonth}
					>
						Next
					</button>
				) : null}
			</div>
			<table className="w-full">
				<thead>
					<tr className="bg-gray-200">
						{daysOfWeek.map((day) => (
							<th key={day} className="px-4 py-2 text-center">
								{day}
							</th>
						))}
					</tr>
				</thead>
				<tbody class="dark:bg-admin-background-dark bg-white dark:text-white">
					{[...Array(Math.ceil(renderDays().length / 7))].map(
						(_, weekIndex) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<tr key={weekIndex}>
								{daysOfWeek.map((_, dayIndex) => {
									const day = renderDays()[weekIndex * 7 + dayIndex];

									return (
										<td
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={dayIndex}
											className="border px-4 py-2 text-center hover:bg-primary"
											onClick={() => {
												if (onPickDate && day) {
													onPickDate(day);
												}
											}}
										>
											{day !== "" && day}
										</td>
									);
								})}
							</tr>
						),
					)}
				</tbody>
			</table>
		</div>
	);
}

export default Calendar;
