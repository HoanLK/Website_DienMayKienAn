import { ProductGroupDeleteComponent } from "./product-group-delete.component";

export const ProductGroupDeleteModule = angular
  .module("product-group.delete", [])
  .component("productGroupDelete", ProductGroupDeleteComponent).name;
