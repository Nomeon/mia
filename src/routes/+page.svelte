<script lang='ts'>
    import { onMount } from "svelte";
    import { handleIFC } from "$lib/ifc/ifc-handler";
    import { createLVL } from "$lib/lvl/createLVL";
    import { createBP } from "$lib/bp/createBP";
    import * as Excel from 'exceljs';
	import type { IfcElement } from "$lib/ifc/ifc-types";

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
        const sheetISO = workbook.addWorksheet('3. Isolatie');
        const sheetFOL = workbook.addWorksheet('4. Folie');
        const sheetOLI = workbook.addWorksheet('5. Olivijn');
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