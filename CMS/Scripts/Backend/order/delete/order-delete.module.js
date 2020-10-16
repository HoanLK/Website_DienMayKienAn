import { OrderDeleteComponent } from "./order-delete.component";

export const OrderDeleteModule = angular
  .module("order.delete", [])
  .component("orderDelete", OrderDeleteComponent).name;
