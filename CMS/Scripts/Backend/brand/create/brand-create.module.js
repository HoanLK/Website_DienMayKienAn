import { BrandCreateComponent } from "./brand-create.component";

export const BrandCreateModule = angular
  .module("brand.create", [])
  .component("brandCreate", BrandCreateComponent).name;
