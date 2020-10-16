import { OrderDatagridComponent } from "./order-datagrid.component";

export const OrderDatagridModule = angular
  .module("order.datagrid", [])
  .component("orderDatagrid", OrderDatagridComponent).name;
