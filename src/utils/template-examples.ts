import { type Template } from "~/components/template";

const template1: Template = {
  id: "template-1",
  elements: [
    { type: "text", text: "Nazev template" },
    {
      type: "text",
      text: "tohle je nejakej description text",
    },
    {
      type: "layout-2-cols",
      childrenElements: [
        {
          type: "image",
          src: "https://raw.githubusercontent.com/rjsf-team/react-jsonschema-form/59a8206e148474bea854bbb004f624143fbcbac8/packages/core/logo.png",
        },
        {
          type: "image",
          src: "https://raw.githubusercontent.com/rjsf-team/react-jsonschema-form/59a8206e148474bea854bbb004f624143fbcbac8/packages/core/logo.png",
        },
      ],
    },
    {
      type: "layout-2-cols",
      childrenElements: [
        {
          type: "dynamic",
          id: "address-1",
          entity: "project",
          entityOption: "billing-address",
          component: "address",
        },
        {
          type: "dynamic",
          id: "user-1",
          entity: "project",
          entityOption: "consultant",
          component: "user",
        },
      ],
    },
    {
      type: "input",
      name: "name",
      label: "Name",
    },
    {
      type: "input",
      name: "surname",
      label: "Surname",
    },
    {
      type: "signature",
    },
  ],
};

const offerTemplate1: Template = {
  id: "offer-1",
  elements: [
    { type: "text", text: "Nabidka produktu" },
    {
      type: "dynamic",
      id: "billing-address-1",
      entity: "project",
      entityOption: "billing-address",
      component: "address",
    },
    {
      type: "dynamic",
      id: "onsite-address-1",
      entity: "project",
      entityOption: "onsite-address",
      component: "address",
    },
    {
      type: "signature",
    },
  ],
};

const offerTemplate2: Template = {
  id: "offer-2",
  elements: [
    { type: "text", text: "Nabidka produktu" },
    {
      type: "dynamic",
      id: "consultant-1",
      entity: "project",
      entityOption: "consultant",
      component: "user",
    },
    {
      type: "dynamic",
      id: "billing-address-1",
      entity: "project",
      entityOption: "billing-address",
      component: "address",
    },
    {
      type: "dynamic",
      id: "onsite-address-1",
      entity: "project",
      entityOption: "onsite-address",
      component: "address",
    },
    {
      type: "signature",
    },
  ],
};

export const templateExamples = [template1, offerTemplate1, offerTemplate2];
