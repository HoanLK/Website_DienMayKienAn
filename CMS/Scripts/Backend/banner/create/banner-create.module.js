import { BannerCreateComponent } from "./banner-create.component";

export const BannerCreateModule = angular
  .module("banner.create", [])
  .component("bannerCreate", BannerCreateComponent).name;
