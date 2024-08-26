import type { JSX } from "preact/jsx-runtime";
import useDropdown, { type UseDropdown } from "~/hooks/useDropdown";

interface AdminDropdownProps {
	children:
		| ((props: UseDropdown) => JSX.Element | JSX.Element[])
		| JSX.Element
		| JSX.Element[];
	triggerChildren: (props: UseDropdown) => JSX.Element | JSX.Element[];
	className?: string;
	minWidth?: number;
}
function AdminDropdown({
	triggerChildren,
	children,
	minWidth = 250,
	className = "top-0 absolute rounded-md shadow-md bg-background-light dark:bg-admin-paper-dark right-0 z-[19]",
}: AdminDropdownProps) {
	const dropdown = useDropdown();
	return (
		<>
			<div
				class="relative "
				onMouseEnter={dropdown.onOpen}
				onMouseLeave={() => dropdown.onClose()}
			>
				<div>{triggerChildren(dropdown)}</div>
				<div
					class={`${className} ${
						dropdown.dropdownOpen ? "block" : "hidden"
					} border border-gray-200 dark:border-gray-700`}
					ref={dropdown.dropdown}
					style={{ minWidth }}
				>
					{children instanceof Function ? children(dropdown) : children}
				</div>
			</div>
		</>
	);
}

export default AdminDropdown;
