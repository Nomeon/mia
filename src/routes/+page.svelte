<script lang='ts'>
    import { onMount } from "svelte";
    import { handleIFC } from "$lib/ifc/ifc-handler";
    import { createLVL } from "$lib/lvl/createLVL";
    import { createBP } from "$lib/bp/createBP";
    import { createISO } from "$lib/iso/createISO";
    import { createFOL } from "$lib/fol/createFOL";
    import { createOLI } from "$lib/oli/createOLI";
    import * as Excel from 'exceljs';
	import type { IfcElement } from "$lib/ifc/ifc-types";

    // TODO: Olivijn kg + m2, Check isolatie, check volume ipv inhoud, aggregatie 

    onMount(async () => {
        const response = await fetch('/test.ifc');
        const fileContent = await response.arrayBuffer();
        let rawData = new Uint8Array(fileContent);
        const elements = await handleIFC(rawData);
        createExcel(elements);
    });

    function createExcel(elements: IfcElement[]) {
        const workbook = new Excel.Workbook();
        createLVL(workbook, elements);
        createBP(workbook, elements);
        createISO(workbook, elements);
        createFOL(workbook, elements);
        createOLI(workbook, elements);
        createDownload(workbook);
    }

    function createDownload(wb: Excel.Workbook) {
        wb.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'test.xlsx';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
</script>