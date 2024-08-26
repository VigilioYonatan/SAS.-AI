import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import dayjs, { NOW } from "~/libs/helpers";

function useCountDown(date: string | Date | number) {
	function calculateTimeLeft() {
		const now = NOW();
		const endDate = dayjs(date);
		const duration = dayjs.duration(endDate.diff(now));

		return {
			days: duration.days(),
			hours: duration.hours(),
			minutes: duration.minutes(),
			seconds: duration.seconds(),
		};
	}

	const timeLeft = useSignal(calculateTimeLeft());

	useEffect(() => {
		const timer = setInterval(() => {
			timeLeft.value = calculateTimeLeft();
		}, 1000);

		return () => clearInterval(timer);
	}, [date]);

	return {
		days: timeLeft.value.days,
		hours: timeLeft.value.hours,
		minutes: timeLeft.value.minutes,
		seconds: timeLeft.value.seconds,
	};
}

export default useCountDown;
