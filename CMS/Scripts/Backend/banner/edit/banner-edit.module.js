import { BannerEditComponent } from "./banner-edit.component";

export const BannerEditModule = angular
  .module("banner.edit", [])
  .component("bannerEdit", BannerEditComponent).name;
