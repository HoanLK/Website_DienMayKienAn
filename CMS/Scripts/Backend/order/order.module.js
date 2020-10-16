import { OrderDatagridModule } from "./datagrid/order-datagrid.module";
import { OrderDeleteModule } from "./delete/order-delete.module";

import { OrderComponent } from "./order.component";

import OrderService from "./order.service";

export const OrderModule = angular
    .module("order", [
        OrderDatagridModule,
        OrderDeleteModule,
    ])
    .component("order", OrderComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        "ngInject";
        $stateProvider
            .state("order", {
                url: "/order",
                component: "order",
            });
        $urlRouterProvider.otherwise("/");
    })
    .service("OrderService", OrderService).name;
