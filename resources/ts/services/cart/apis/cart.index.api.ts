import type { CartSchema } from "../schemas";

export async function cartIndexApi(): Promise<CartIndexAPI> {
    const response = await fetch("/api/cart");
    const result: CartIndexAPI = await response.json();
    if (!result.success) throw result;
    return result;
}

export interface CartIndexAPI {
    success: boolean;
    data: CartSchema[];
}
