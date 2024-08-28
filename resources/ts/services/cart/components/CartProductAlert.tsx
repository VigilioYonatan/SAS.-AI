import enviroments from "~/config";
import { printImagesProduct } from "@/products/libs/helpers";
import type { CartProductSchema } from "../schemas";
import Hr from "@/web/components/Hr";
import { formatMoney } from "../libs/helpers";
interface CartProductAlertProps {
    product: CartProductSchema;
}
function CartProductAlert({ product }: CartProductAlertProps) {
    return (
        <div class="flex flex-col w-full gap-2 ">
            <span class="block text-center font-bold text-xl text-primary">
                Producto añadido <i class="fa-solid fa-cart-shopping" />
            </span>
            <Hr />
            <div class="flex gap-3 justify-between items-center w-full relative dark:text-white text-black">
                <div class="flex flex-col  text-start w-full">
                    <div class="flex flex-col">
                        <span class="text-sm">Producto: </span>
                        <b class="line-clamp-2 text-sm font-bold">
                            {product.name}
                        </b>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm">Precio: </span>
                        <b class="line-clamp-2 text-sm font-bold">
                            {formatMoney(product.subtotal)}
                        </b>
                    </div>
                </div>
                <div class="flex flex-col w-[200px] gap-2">
                    <img
                        class="w-full  object-cover h-[80px]"
                        width="80"
                        height="80"
                        src={printImagesProduct(product.images, 500)[0]}
                        alt={product.name}
                    />
                    <a
                        href={`${enviroments.VITE_URL}/cart`}
                        class="text-white font-bold bg-primary w-full  py-1 flex items-center justify-center gap-2"
                    >
                        <i class="fa-solid fa-cart-shopping" />
                        Ir a carrito
                    </a>
                </div>
            </div>
        </div>
    );
}

export default CartProductAlert;
