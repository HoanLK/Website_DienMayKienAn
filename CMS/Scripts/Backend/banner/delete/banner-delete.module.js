import { BannerDeleteComponent } from "./banner-delete.component";

export const BannerDeleteModule = angular
  .module("banner.delete", [])
  .component("bannerDelete", BannerDeleteComponent).name;
