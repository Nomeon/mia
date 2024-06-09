import * as WebIFC from 'web-ifc';
import { type IfcElement, type IfcType, type PropertyMappings } from './ifc-types';

const propertyMappings: { [key: string]: keyof IfcElement } = {
	Productcode: 'productcode',
	Modulenaam: 'modulenaam',
	Station: 'station',
	Aantal: 'aantal',
	Materiaal: 'materiaal',
  Lengte: 'lengte',
  Breedte: 'breedte',
	Dikte: 'dikte',
	Gewicht: 'gewicht',
	Volume: 'volume',
	'Naa.K.T': 'code'
};

export async function handleIFC(ifcAPI: WebIFC.IfcAPI, content: Uint8Array) {
	const modelID = ifcAPI.OpenModel(content);
	return await getElements(ifcAPI, modelID);
}

export async function getElements(ifcAPI: WebIFC.IfcAPI, model: number) {
	const elements: IfcElement[] = [];
	const allModelTypes: IfcType[] = ifcAPI.GetAllTypesOfModel(model);

  // Get bouwdeel and bnr
  const buildingInfoLines = ifcAPI.GetLineIDsWithType(model, WebIFC.IFCBUILDING)
  const buildingInfo = ifcAPI.GetLine(model, buildingInfoLines.get(0)).Name.value
  const bouwdeel = buildingInfo.split('-')[0]
  const bnr = parseInt(buildingInfo.split('-')[1])

	for (const type of allModelTypes) {
		//! Check if MechanicalFastener is required
		if (ifcAPI.IsIfcElement(type.typeID) && type.typeName !== 'IfcMechanicalFastener') {
			const elementIDs = ifcAPI.GetLineIDsWithType(model, type.typeID);
			for (let i = 0; i < elementIDs.size(); i++) {
				const elementID = ifcAPI.GetLine(model, elementIDs.get(i));
				const element: Partial<IfcElement> = { name: elementID.Name.value, bouwdeel, bnr};
				const propSet = await ifcAPI.properties.getPropertySets(model, elementID.expressID, true);
				propSet.forEach((property) => {
					property.HasProperties.forEach((prop: { Name: { value: string; }; NominalValue: { value: undefined; }; }) => {
						const key = prop.Name.value as keyof PropertyMappings;
						if (propertyMappings[key]) {
							element[propertyMappings[key] as keyof IfcElement] = prop.NominalValue.value;
						}
					});
				});
				elements.push(element as IfcElement);
			}
		}
	}

	ifcAPI.CloseModel(model);

  // Create oppervlakte from lengte and breedte, divide by 1000000 to convert to m2
  elements.forEach((element) => {
    element.oppervlakte = ((element.lengte / 1000) * (element.breedte / 1000)) // Lengte and breedte are in mm
  })

	const combinedElements: IfcElement[] = Object.values(
		elements.reduce(
			(acc, element) => {
				const key = `${element.productcode}-${element.modulenaam}-${element.station}`;
				if (!acc[key]) {
					acc[key] = { ...element };
				} else {
					acc[key].aantal += element.aantal;
          acc[key].oppervlakte += element.oppervlakte;
					acc[key].volume += element.volume;
					acc[key].gewicht += element.gewicht;
				}
				return acc;
			},
			{} as { [key: string]: IfcElement }
		)
	);

	return combinedElements;
}
