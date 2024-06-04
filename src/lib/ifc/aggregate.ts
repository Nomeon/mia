import { type IfcElement } from './ifc-types';

export function aggregate(elements: IfcElement[]) {
  const aggregatedElements = elements.reduce((acc, element) => {
    const key = `${element.materiaal}-${element.dikte}-${element.bnr}-${element.bouwdeel}`;
    if (!acc.has(key)) {
      acc.set(key, { ...element, volume: element.volume, gewicht: element.gewicht });
    } else {
      acc.get(key).volume += element.volume;
      acc.get(key).gewicht += element.gewicht;
      acc.get(key).aantal += element.aantal;
    }
    return acc;
  }, new Map());
  return Array.from(aggregatedElements.values());
}
