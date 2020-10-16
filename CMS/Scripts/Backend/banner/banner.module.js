import { BannerDatagridModule } from "./datagrid/banner-datagrid.module";
import { BannerCreateModule } from "./create/banner-create.module";
import { BannerEditModule } from "./edit/banner-edit.module";
import { BannerDeleteModule } from "./delete/banner-delete.module";

import { BannerComponent } from "./banner.component";

import BannerService from "./banner.service";

export const BannerModule = angular
    .module("banner", [
        BannerDatagridModule,
        BannerCreateModule,
        BannerEditModule,
        BannerDeleteModule,
    ])
    .component("banner", BannerComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        "ngInject";
        $stateProvider
            .state("banner", {
                url: "/banner",
                component: "banner",
            })
            .state("banner-create", {
                url: "/banner/create",
                component: "bannerCreate",
                module: BannerCreateModule,
            })
            .state("banner-edit", {
                url: "/banner/edit/:id",
                component: "bannerEdit",
                module: BannerEditModule,
            });
        $urlRouterProvider.otherwise("/");
    })
    .service("BannerService", BannerService).name;
