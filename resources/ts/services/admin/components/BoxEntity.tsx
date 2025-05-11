import type { JSX } from "preact/jsx-runtime";
import AdminHr from "~/components/AdminHr";

interface BoxEntityProps {
    title: string;
    quantity: string;
    color?: string;
    ico: JSX.Element;
    onClick?: () => void;
    custom?: JSX.Element | JSX.Element[];
}
function BoxEntity({
    title,
    quantity,
    color = "bg-danger",
    ico,
    onClick,
    custom,
}: BoxEntityProps) {
    return (
        <button
            aria-label={`open to ${title}`}
            onClick={onClick}
            className=" rounded-md shadow w-full  bg-background-light dark:bg-admin-paper-dark dark:border border-gray-600 p-4 relative "
            type="button"
        >
            <div
                class={`${color}  w-[50px] h-[50px] rounded-md flex justify-center items-center shadow absolute left-4 -top-2 text-white text-xl`}
            >
                {ico}
            </div>
            <div class="">
                <div class="flex justify-end">
                    <div className="flex flex-col justify-center items-center">
                        <span class="text-terciary text-sm">{title}</span>
                        <span class="dark:text-secondary-light text-2xl font-bold text-secondary-dark">
                            {quantity}
                        </span>
                    </div>
                </div>
                <AdminHr />
                {custom ? custom : null}
            </div>
        </button>
    );
}

export default BoxEntity;
