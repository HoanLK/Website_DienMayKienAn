import { BrandDeleteComponent } from "./brand-delete.component";

export const BrandDeleteModule = angular
  .module("brand.delete", [])
  .component("brandDelete", BrandDeleteComponent).name;
