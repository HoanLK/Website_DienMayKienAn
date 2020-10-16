import templateUrl from "./order.component.html";

export default class OrderController {
  constructor($rootScope) {
    // SET TITLE
    $rootScope.title = "Đơn đặt hàng";
  }
}

OrderController.$inject = ["$rootScope"];

export const OrderComponent = {
  template: templateUrl,
  controller: OrderController,
};
