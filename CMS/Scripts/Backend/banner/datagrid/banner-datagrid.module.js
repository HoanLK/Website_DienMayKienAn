import { BannerDatagridComponent } from "./banner-datagrid.component";

export const BannerDatagridModule = angular
  .module("banner.datagrid", [])
  .component("bannerDatagrid", BannerDatagridComponent).name;
