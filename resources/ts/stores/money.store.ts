import { signal } from "@preact/signals";

export type Money = "DOLARES" | "LOCAL";
type MoneyState = {
	money: Money;
	moneyValue: Record<Money, number>;
};
function getMoneyStorage() {
	let themeMode: MoneyState = {
		money: "LOCAL",
		moneyValue: { DOLARES: 1, LOCAL: 1 },
	};
	if (localStorage.getItem("money")) {
		themeMode = JSON.parse(localStorage.getItem("money")!) as MoneyState;
	}

	return themeMode;
}
const state = signal<MoneyState>(getMoneyStorage());

function useMoneyStore() {
	return {
		state: state.value,
	};
}
export default useMoneyStore;
