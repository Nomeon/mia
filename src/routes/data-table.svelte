<script lang="ts">
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { addPagination } from 'svelte-headless-table/plugins';
	import type { IfcElement } from '$lib/ifc/ifc-types';

	export let data: IfcElement[] = [];

	const table = createTable(readable(data), {
		page: addPagination({
			initialPageSize: 10
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'name',
			header: 'Name',
		}),
		table.column({
			accessor: 'modulenaam',
			header: 'Module'
		}),
		table.column({
			accessor: 'productcode',
			header: 'Productcode'
		}),
		table.column({
			accessor: 'station',
			header: 'WS'
		}),
		table.column({
			accessor: 'materiaal',
			header: 'Materiaal'
		}),
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>

<div class='w-full'>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
                    {#if cell.id === 'name'}
                      <div class='truncate-fixed font-medium'>
                        <Render of={cell.render()} />
                      </div>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-4 py-4">
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div>
</div>

<style lang='postcss'>
  .truncate-fixed {
    width: 50ch;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>