interface HelperProps {
    children: JSX.Element | JSX.Element[];
    top: number;
}
function Helper({ children, top }: HelperProps) {
    return (
        <button
            type="button"
            aria-label="?"
            class="absolute bg-black w-[20px] h-[20px] -right-2 -top-2 rounded-full text-white group"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            ?
            <div
                class="absolute  dark:bg-admin-background-dark bg-white p-2 rounded-sm hidden group-hover:block dark:text-white w-[300px]"
                style={{ top }}
            >
                {children}
            </div>
        </button>
    );
}

export default Helper;
