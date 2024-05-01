<script lang='ts'>
    import { onMount } from "svelte";
    import { handleIFC } from "$lib/ifc/ifc-handler";
    import { ifcToExcel } from "$lib/ifc/create-excel";

    onMount(async () => {
        const response = await fetch('/test.ifc');
        const fileContent = await response.arrayBuffer();
        let rawData = new Uint8Array(fileContent);
        const elements = await handleIFC(rawData);
        // ifcToExcel(elements);
    });

</script>

<h1>Page</h1>