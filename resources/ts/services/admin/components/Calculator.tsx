import { Calculator } from "react-advanced-calculator";
import "react-advanced-calculator/dist/styles/calculator.css";

function CalculatorVigilio() {
	return (
		<div class=" [&>div]:w-full   overflow-auto mt-3">
			<h1 class="text-primary text-xl font-bold mb-2 text-center">
				Calculadora
			</h1>
			<Calculator />
		</div>
	);
}

export default CalculatorVigilio;
