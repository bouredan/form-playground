import { type TemplateElement, type Template, type DynamicDataElement } from "~/components/template";

/**
 * Careful that this strips off layout elements.
 * 
 * @param template 
 * @returns 
 */
export function getFlatTemplateElements(template: Template) {
  return template.elements.reduce<TemplateElement[]>((acc, element) => {
    if (element.type === "layout-2-cols") {
      return acc.concat(element.childrenElements);
    } else {
      acc.push(element);
    }
    return acc;
  }, []);
}

export function getDynamicDataElementsFromTemplate(template: Template) {
  const templateElements = getFlatTemplateElements(template);
  return templateElements.reduce<DynamicDataElement[]>((acc, element) => {
    if (element.type === "dynamic") {
      acc.push(element);
    }
    return acc;
  }, []);
}