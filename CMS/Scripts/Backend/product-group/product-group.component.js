import templateUrl from "./product-group.component.html";

export default class ProductGroupController {
  constructor($rootScope) {
    // SET TITLE
    $rootScope.title = "Nhóm sản phẩm";
  }
}

ProductGroupController.$inject = ["$rootScope"];

export const ProductGroupComponent = {
  template: templateUrl,
  controller: ProductGroupController,
};
