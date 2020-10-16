import templateUrl from "./banner.component.html";

export default class BannerController {
  constructor($rootScope) {
    // SET TITLE
    $rootScope.title = "Banner";
  }
}

BannerController.$inject = ["$rootScope"];

export const BannerComponent = {
  template: templateUrl,
  controller: BannerController,
};
