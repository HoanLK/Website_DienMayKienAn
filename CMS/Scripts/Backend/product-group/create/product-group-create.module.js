import { ProductGroupCreateComponent } from "./product-group-create.component";

export const ProductGroupCreateModule = angular
    .module('product-group.create', [])
    .component('productGroupCreate', ProductGroupCreateComponent)
    .name;