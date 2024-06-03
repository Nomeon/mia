<script lang="ts">
	import * as WebIFC from 'web-ifc';
	import { handleIFC } from '$lib/ifc/ifc-handler';
	import type { IfcElement } from '$lib/ifc/ifc-types';
	import { createLVL, createBP, createISO, createFOL, createOLI } from '$lib/createSheets';
	import { Button } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';
	import * as Excel from 'exceljs';
	import DataTable from './data-table.svelte';
	import { dialog, fs } from '@tauri-apps/api';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	export let IFCcount = writable(0);
	let IFCamount: number;
	let flattenedElements: IfcElement[] = [];
	let wb: Excel.Workbook;
	let ifcAPI: WebIFC.IfcAPI;

	onMount(async () => {
		ifcAPI = new WebIFC.IfcAPI();
		await ifcAPI.Init();
    console.log('IFC API initialized');
	});

	function createExcel(elements: IfcElement[]) {
		const workbook = new Excel.Workbook();
		createLVL(workbook, elements);
		createBP(workbook, elements);
		createISO(workbook, elements);
		createFOL(workbook, elements);
		createOLI(workbook, elements);
		return workbook;
	}

	async function selectIFCs() {
		const result = (await dialog.open({
			multiple: true,
			filters: [{ name: 'IFC', extensions: ['ifc'] }]
		})) as string[];
		if (result) {
			const allElements: IfcElement[] = [];
			IFCamount = result.length;
			$IFCcount = 0;

			for (const file of result) {
        console.log('Reading file')
				let fileContent = await fs.readBinaryFile(file);
        console.log('meep')
        const elements = await handleIFC(ifcAPI, fileContent);
				console.log('done')
        allElements.push(...elements);
				$IFCcount++;
			}

			flattenedElements = allElements.flat();
			wb = createExcel(flattenedElements);
		}
	}

	function createDownload(wb: Excel.Workbook) {
		wb.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'MIAtoolOutput.xlsx';
			a.click();
			URL.revokeObjectURL(url);
		});
	}
</script>

<div class="container flex flex-row items-center gap-8 py-10">
	<Button on:click={selectIFCs}>Laad IFCs</Button>
	{#if IFCamount > 0}
		<div class="flex w-full flex-row items-center gap-4">
			<p class="whitespace-nowrap">IFC's geladen: {$IFCcount}/{IFCamount}</p>
			<Progress value={($IFCcount / IFCamount) * 100} />
			<Button disabled={!wb} on:click={() => createDownload(wb)}>Download Excel</Button>
		</div>
	{/if}
</div>

<div class="container flex w-full items-center">
	{#if flattenedElements.length > 0}
		<DataTable data={flattenedElements} />
	{:else}
		<div class="flex min-h-96 w-full flex-col items-center justify-center">
			<p class="text-lg font-medium">Selecteer IFCs om ze in te laden.</p>
			<p class="">Hierna wordt automatisch het Excel-bestand voor de MIA berekening gegenereerd.</p>
		</div>
	{/if}
</div>
