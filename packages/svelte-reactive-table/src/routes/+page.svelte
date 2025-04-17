<script lang="ts">
	import { reactiveTable } from '$lib/index.js';

	const table = reactiveTable(
		[
			{ name: 'John Doe', age: 30, city: 'New York' },
			{ name: 'Jane Smith', age: 25, city: 'Los Angeles' },
			{ name: 'Sam Brown', age: 35, city: 'Chicago' },
			{ name: 'Alice Johnson', age: 28, city: 'Houston' },
			{ name: 'Bob Lee', age: 40, city: 'Phoenix' }
		],
		[
			{ accessor: 'name', header: 'Name' },
			{ accessor: 'age', header: 'Age' },
			{ accessor: 'city', header: 'City' }
		]
	);
</script>

<table>
	<thead>
		<tr>
			{#each table.headers as header}
				<th>{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each table.rows as row}
			<tr>
				{#each row.cells as cell}
					<td>{cell.value}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
