import { BrandEditComponent } from "./brand-edit.component";

export const BrandEditModule = angular
  .module("brand.edit", [])
  .component("brandEdit", BrandEditComponent).name;
