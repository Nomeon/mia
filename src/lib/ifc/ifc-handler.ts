import * as WebIFC from 'web-ifc';
import { type IfcElement, type IfcPropertySingleValue } from './ifc-types';

export async function handleIFC(content: Uint8Array) {
    const ifcAPI = new WebIFC.IfcAPI();
    await ifcAPI.Init();
    const modelID = ifcAPI.OpenModel(content);
    return await getElements(ifcAPI, modelID);
}

export async function getElements(ifcAPI: WebIFC.IfcAPI, model: number){
    const elementIDs = ifcAPI.GetLineIDsWithType(model, WebIFC.IFCMEMBER);
    const elements: IfcElement[] = [];

    const propertyMappings: { [key: string]: keyof IfcElement } = {
        "Productcode": "productcode",
        "Station": "station",
        "Aantal": "aantal",
        "Categorie": "categorie",
        "Eenheid": "eenheid",
        "Breedte": "breedte",
        "Lengte": "lengte",
        "Dikte": "dikte",
        "Gewicht": "gewicht",
        "Volume": "volume"
    };

    for (let i = 0; i < elementIDs.size(); i++) {
        const elementID = ifcAPI.GetLine(model, elementIDs.get(i));
        const element = {name: elementID.Name.value} as IfcElement;

        const propSet = await ifcAPI.properties.getPropertySets(model, elementID.expressID, true);
        propSet.forEach((property) => {
            property.HasProperties.forEach((prop: IfcPropertySingleValue) => {
                const key = prop.Name.value;
                if (propertyMappings[key]) {
                    element[propertyMappings[key]] = prop.NominalValue.value;
                }
            })
        })
        elements.push(element);
    }
    return elements;
}