import { computed, useSignal } from "@preact/signals";
interface usePaginationNoApiProps<T extends object> {
	array: T[];
	pageSize: number;
	page?: number;
}
// you can paginate without api.only array
function usePaginationNoApi<T extends object>({
	array,
	pageSize,
	page = 1,
}: usePaginationNoApiProps<T>) {
	const currentPage = useSignal(page);

	function paginate(pageNumber: number) {
		const pageNumberIncrease = pageNumber - 1;
		return array.slice(
			pageNumberIncrease * pageSize,
			pageNumberIncrease * pageSize + pageSize,
		);
	}

	function handlePageChange(newPage: number) {
		currentPage.value = newPage;
	}
	function onNextPage() {
		if (isPageFinal.value) return;
		handlePageChange(currentPage.value + 1);
	}
	function onPreviousPage() {
		if (isPageInitial.value) return;
		handlePageChange(currentPage.value - 1);
	}
	function onInitialPage() {
		handlePageChange(1);
	}
	const data = paginate(currentPage.value);
	const isPageInitial = computed(() => currentPage.value === 1);
	const isPageFinal = computed(
		() => currentPage.value === Math.ceil(array.length / pageSize),
	);
	return {
		data,
		methods: {
			handlePageChange,
			onNextPage,
			onPreviousPage,
			onInitialPage,
		},
		computeds: {
			isPageInitial: isPageInitial.value,
			isPageFinal: isPageFinal.value,
		},
	};
}

export default usePaginationNoApi;
