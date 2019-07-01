// import React from "react";
// import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
// import { Pivot, PivotHandledProps, PivotProps, pivotSchema } from "./index";
// import Documentation from "./.tmp/documentation";
// import { TabsItem } from "@microsoft/fast-components-react-base";
// import { uniqueId } from "lodash-es";
// import pivotItemContentSchema from "../../app/components/pivot-item-content.schema";
// import pivotItemTabSchema from "../../app/components/pivot-item-tab.schema";

// const pivotItem1: TabsItem = {
//     tab: {
//         id: pivotItemTabSchema.id,
//         props: {
//             children: "pivot one",
//         },
//     } as any,
//     content: {
//         id: pivotItemContentSchema.id,
//         props: {
//             children: "pivot one content",
//         },
//     } as any,
//     id: uniqueId(),
// };

// const pivotItem2: TabsItem = {
//     tab: {
//         id: pivotItemTabSchema.id,
//         props: {
//             children: "pivot two",
//         },
//     } as any,
//     content: {
//         id: pivotItemContentSchema.id,
//         props: {
//             children: "pivot two content",
//         },
//     } as any,
//     id: uniqueId(),
// };

// const pivotItem3: TabsItem = {
//     tab: {
//         id: pivotItemTabSchema.id,
//         props: {
//             children: "pivot three",
//         },
//     } as any,
//     content: {
//         id: pivotItemContentSchema.id,
//         props: {
//             children: "pivot three content",
//         },
//     } as any,
//     id: uniqueId(),
// };

// const pivotItem4: TabsItem = {
//     tab: {
//         id: pivotItemTabSchema.id,
//         props: {
//             children: "pivot four",
//         },
//     } as any,
//     content: {
//         id: pivotItemContentSchema.id,
//         props: {
//             children: "pivot four content",
//         },
//     } as any,
//     id: uniqueId(),
// };

// const detailPivotItem: TabsItem[] = [pivotItem1, pivotItem2, pivotItem3, pivotItem4];

// const examples: ComponentFactoryExample<PivotProps> = {
//     name: "Pivot",
//     component: Pivot,
//     schema: pivotSchema as any,
//     documentation: <Documentation />,
//     detailData: {
//         label: "A set of example text content",
//         items: detailPivotItem,
//     },
//     data: [
//         {
//             label: "A set of example text content",
//             items: detailPivotItem,
//         },
//     ],
// };

// export default examples;
