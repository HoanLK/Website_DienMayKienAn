import { ProductGroupDatagridModule } from "./datagrid/product-group-datagrid.module";
import { ProductGroupCreateModule } from "./create/product-group-create.module";
import { ProductGroupEditModule } from "./edit/product-group-edit.module";
import { ProductGroupDeleteModule } from "./delete/product-group-delete.module";

import { ProductGroupComponent } from "./product-group.component";

import ProductGroupService from "./product-group.service";

export const ProductGroupModule = angular
  .module("product-group", [
    ProductGroupDatagridModule,
    ProductGroupCreateModule,
    ProductGroupEditModule,
    ProductGroupDeleteModule,
  ])
  .component("productGroup", ProductGroupComponent)
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";
    $stateProvider.state("product-group", {
      url: "/product-group",
      component: "productGroup",
    });
    $urlRouterProvider.otherwise("/");
  })
  .service("ProductGroupService", ProductGroupService).name;
