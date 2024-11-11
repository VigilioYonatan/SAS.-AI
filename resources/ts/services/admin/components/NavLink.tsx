import { type JSX } from "preact/jsx-runtime";
import {
	Link,
	useRoute,
	type LinkProps,
	type BaseLocationHook,
} from "wouter-preact";
import useDropdown from "~/hooks/useDropdown";

const NavLink = <H extends BaseLocationHook>(
	props: LinkProps<H> & {
		title: string;
		Icon: JSX.Element;
		uris?: { title: JSX.Element | JSX.Element[]; to: string }[];
	},
) => {
	const { title, Icon, ...rest } = props;
	const [isActive] = useRoute(props.to as string);
	const { dropdownOpen, onOpenClose, dropdown, onClose } = useDropdown();
	return (
		<div
			ref={dropdown}
			id={title.split(" ").join("")}
			class={`${
				isActive || dropdownOpen
					? "dark:bg-admin-terciary bg-paper-light [>&svg]:text-terciary "
					: "text-terciary dark:hover:bg-admin-terciary hover:bg-paper-light"
			} px-2 py-1 w-full rounded-md text-sm lg:text-base relative`}
		>
			<div class="flex justify-between items-center w-full py-1 ">
				{props.uris ? (
					<button
						type="button"
						class="flex gap-2 items-center w-full dark:hover:text-white dark:text-terciary text-secondary-dark"
						onClick={onOpenClose}
					>
						{Icon}
						<span class="font-semibold hidden md:block ">{title}</span>
					</button>
				) : (
					<Link {...rest}>
						<button
							type="button"
							class="flex gap-2 items-center w-full dark:hover:text-white dark:text-terciary text-secondary-dark"
						>
							{Icon}
							<span class="font-semibold hidden md:block ">{title}</span>
						</button>
					</Link>
				)}

				{props.uris ? (
					<button type="button" onClick={onOpenClose}>
						<i class="fas fa-caret-down" />
					</button>
				) : null}
			</div>
			{props.uris ? (
				<div
					class={`absolute rounded-md dark:bg-admin-terciary min-w-[200px]  -top-10 left-10   shadow-md bg-white z-[9999]  md:static flex flex-col  items-start delay-custom-1 overflow-hidden ${
						dropdownOpen ? "max-h-[600px] p-2 " : "max-h-0"
					}`}
				>
					{props.uris.map((link) => (
						<NavLinkChild onClose={onClose} link={link} key={link.to} />
					))}
				</div>
			) : null}
		</div>
	);
};
export interface NavLinkChildProps {
	link: { to: string; title: JSX.Element | JSX.Element[] };
	onClose: () => void;
}
function NavLinkChild({ link, onClose }: NavLinkChildProps) {
	const [isActive] = useRoute(link.to as string);

	return (
		<Link class="w-full" onClick={() => onClose()} key={link.to} to={link.to}>
			<button
				type="button"
				class={`${
					isActive ? "" : ""
				} font-semibold sm:pl-2 w-full p-1.5 dark:hover:text-white dark:text-terciary text-secondary-dark text-start `}
			>
				{link.title}
			</button>
		</Link>
	);
}

export default NavLink;
