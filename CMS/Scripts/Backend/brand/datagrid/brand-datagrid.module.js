import { BrandDatagridComponent } from "./brand-datagrid.component";

export const BrandDatagridModule = angular
  .module("brand.datagrid", [])
  .component("brandDatagrid", BrandDatagridComponent).name;
