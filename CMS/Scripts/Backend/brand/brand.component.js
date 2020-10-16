import templateUrl from "./brand.component.html";

export default class BrandController {
  constructor($rootScope) {
    // SET TITLE
    $rootScope.title = "Nhãn hiệu";
  }
}

BrandController.$inject = ["$rootScope"];

export const BrandComponent = {
  template: templateUrl,
  controller: BrandController,
};
