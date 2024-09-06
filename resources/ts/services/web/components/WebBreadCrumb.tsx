interface AdminBreadCrumbProps {
	uris?: { uri: string; title: string }[];
	current: string;
}
function WebBreadCrumb({ uris, current }: AdminBreadCrumbProps) {
	return (
		<nav
			class="flex text-sm md:ms-2 py-2 font-semibold capitalize text-nowrap  dark:text-white overflow-auto"
			aria-label="Breadcrumb"
		>
			<ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
				<li class="flex gap-2 items-center">
					<i class="fa-regular fa-house self-start" />
					<a href={"/"} class="inline-flex ">
						Inicio
					</a>
				</li>
				{uris?.map(({ title, uri }) => (
					<li key={uri}>
						<div class="flex items-center ">
							<i class="fas fa-chevron-right me-2.5 text-[0.6rem] " />
							<a href={`${uri}`} class="ms-1 text-center">
								{title}
							</a>
						</div>
					</li>
				))}
				<li>
					<div class="flex items-center font-bold">
						<i class="fas fa-chevron-right me-2.5 text-xs" />
						<span class="ms-1 capitalize text-primary ">{current}</span>
					</div>
				</li>
			</ol>
		</nav>
	);
}

export default WebBreadCrumb;
