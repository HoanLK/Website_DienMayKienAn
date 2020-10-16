import { ProductGroupEditComponent } from "./product-group-edit.component";

export const ProductGroupEditModule = angular
  .module("product-group.edit", [])
  .component("productGroupEdit", ProductGroupEditComponent).name;
