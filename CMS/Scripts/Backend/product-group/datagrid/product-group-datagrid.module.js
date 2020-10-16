import { ProductGroupDatagridComponent } from "./product-group-datagrid.component";

export const ProductGroupDatagridModule = angular
  .module("product-group.datagrid", [])
  .component("productGroupDatagrid", ProductGroupDatagridComponent).name;
