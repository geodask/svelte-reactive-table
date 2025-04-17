// Reexport your entry components here
type Column<T> = {
	accessor: keyof T;
	header: string;
};

export function reactiveTable<T>(data: T[], columnDefs: Column<T>[]) {
	let rawData = $state(data);
	let columns = $state(columnDefs);

	const items = $derived(rawData);
	const headers = $derived(columns.map((column) => column.header));
	const rows = $derived.by(() => {
		return items.map((item) => {
			return {
				cells: columns.map((column) => {
					return {
						key: column.accessor,
						value: item[column.accessor]
					};
				})
			};
		});
	});

	return {
		set source(value: T[]) {
			rawData = value;
		},
		get source() {
			return rawData;
		},
		set columns(value: Column<T>[]) {
			columns = value;
		},
		get columns() {
			return columns;
		},
		get headers() {
			return headers;
		},
		get rows() {
			return rows;
		}
	};
}
