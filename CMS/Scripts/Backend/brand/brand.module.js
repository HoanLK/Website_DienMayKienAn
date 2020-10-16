import { BrandDatagridModule } from "./datagrid/brand-datagrid.module";
import { BrandCreateModule } from "./create/brand-create.module";
import { BrandEditModule } from "./edit/brand-edit.module";
import { BrandDeleteModule } from "./delete/brand-delete.module";

import { BrandComponent } from "./brand.component";

import BrandService from "./brand.service";

export const BrandModule = angular
    .module("brand", [
        BrandDatagridModule,
        BrandCreateModule,
        BrandEditModule,
        BrandDeleteModule,
    ])
    .component("brand", BrandComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        "ngInject";
        $stateProvider
            .state("brand", {
                url: "/brand",
                component: "brand",
            })
            .state("brand-create", {
                url: "/brand/create",
                component: "brandCreate",
                module: BrandCreateModule,
            })
            .state("brand-edit", {
                url: "/brand/edit/:id",
                component: "brandEdit",
                module: BrandEditModule,
            });
        $urlRouterProvider.otherwise("/");
    })
    .service("BrandService", BrandService).name;
