import type { UsePaginator } from "@vigilio/preact-paginator";

interface WebPaginationFooterProps {
	paginator: UsePaginator;
}
function WebPaginationFooter({ paginator }: WebPaginationFooterProps) {
	return (
		<ul class="flex items-center w-full -space-x-px h-8 lg:h-10 text-base justify-center">
			<li>
				<button
					onClick={() => paginator.pagination.onBackPage()}
					type="button"
					class="flex items-center justify-center px-2 h-8 leading-tight primary  border border-gray-400  rounded-s-lg      bg-primary text-white"
					aria-label="button previous table"
				>
					<i class="fa-solid fa-circle-chevron-left" />
				</button>
			</li>
			{paginator.pagination.paginator.pages.map((page) => (
				<li key={page}>
					{paginator.pagination.paginator.currentPage === page ? (
						<span class="z-10 flex items-center justify-center px-2 h-8 leading-tight  border       border-gray-400 dark:text-white">
							{page}
						</span>
					) : (
						<button
							v-else
							type="button"
							class="flex items-center justify-center px-2 h-8 leading-tight primary  border     dark:text-white"
							aria-label="button change page table"
							onClick={() => paginator.pagination.onChangePage(page)}
						>
							{page}
						</button>
					)}
				</li>
			))}
			<li>
				<button
					onClick={() => paginator.pagination.onNextPage()}
					type="button"
					aria-label="button next page table"
					class="flex items-center justify-center px-2 h-8 leading-tight primary  border border-gray-400  rounded-e-lg      bg-primary text-white"
				>
					<i className="fa-solid fa-circle-chevron-right" />
				</button>
			</li>
		</ul>
	);
}

export default WebPaginationFooter;
