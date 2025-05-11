import type { JSX } from "preact/jsx-runtime";

interface ContainerBoxProps {
    children: JSX.Element | JSX.Element[];
}
function ContainerBox({ children }: ContainerBoxProps) {
    return (
        <div class=" rounded-md shadow w-full  bg-background-light dark:bg-admin-paper-dark p-4 relative  dark:border border-gray-700">
            {children}
        </div>
    );
}

export default ContainerBox;
