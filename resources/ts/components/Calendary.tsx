import { useState } from "react";

interface CalendarProps {
	changeMonth?: boolean;
	showTitle?: boolean;
	language?: "es" | "en";
	onPickDate?: (day: string | number, month: number, year: number) => void;
	initialDate?: Date;
	custom?: (
		day: string | number,
		month: number,
		year: number,
	) => JSX.Element | JSX.Element[];
	onNextMonth?: (year: number, month: number) => void;
	onPreviousMonth?: (year: number, month: number) => void;
}

function Calendar({
	changeMonth = true,
	showTitle = true,
	language = "es",
	onPickDate,
	initialDate = new Date(),
	custom,
	onNextMonth,
	onPreviousMonth,
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

	function previousMonth(): void {
		setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
		if (onPreviousMonth) {
			onPreviousMonth(date.getFullYear(), date.getMonth() - 1);
		}
	}

	function nextMonth(): void {
		setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
		if (onNextMonth) {
			onNextMonth(date.getFullYear(), date.getMonth() + 1);
		}
	}
	function chooseDay(day: number) {
		setDate(new Date(date.getFullYear(), date.getMonth(), day));
	}

	function renderDays(): (number | string)[] {
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
	}

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
						className=" text-white text-xs border border-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-primary"
						onClick={previousMonth}
					>
						<i class="fa-solid fa-caret-left " /> {
							months[date.getMonth() - 1]
						}{" "}
					</button>
				) : null}
				{showTitle ? (
					<span className="text-lg font-bold dark:text-white   text-center">
						{months[date.getMonth()]} {date.getFullYear()}
					</span>
				) : null}
				{changeMonth ? (
					<button
						type="button"
						aria-label="change month"
						className=" text-white text-xs border border-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline  bg-primary"
						onClick={nextMonth}
					>
						{months[date.getMonth() + 1]} <i class="fa-solid fa-caret-right " />
					</button>
				) : null}
			</div>
			<table className="w-full">
				<thead>
					<tr className="bg-primary text-white">
						{daysOfWeek.map((day) => (
							<th key={day} className="px-4 py-2 text-center relative">
								{day}{" "}
							</th>
						))}
					</tr>
				</thead>
				<tbody class="dark:bg-admin-terciary bg-white dark:text-white">
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
											className={`border font-semibold px-4 relative py-2 text-center hover:bg-primary hover:text-white ${
												day === new Date().getDate() || date.getDate() === day
													? "bg-primary text-white"
													: ""
											}`}
											onClick={() => {
												if (onPickDate) {
													chooseDay(day as number);
													onPickDate(day, date.getMonth(), date.getFullYear());
												}
											}}
										>
											{day !== "" && day}{" "}
											{custom
												? custom(day, date.getMonth(), date.getFullYear())
												: null}
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
