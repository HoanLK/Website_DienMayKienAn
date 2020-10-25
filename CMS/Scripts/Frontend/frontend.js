angular
  .module("frontendApp", [])
  .controller("MainController", function ($timeout, $http, $window) {
    var self = this;

    self.ProductName = "";
    self.ProductImage = "";
    self.Order = {
      ProductId: null,
      Price: 0,
      Quantity: 1,
      Amount: 0,
      Gender: "true",
      Name: null,
      PhoneNumber: null,
      Email: null,
      Address: null,
      Note: null,
    };

    self.searching = false;
    self.search = "";

    self.suggestProducts = [];

    //#region [ SEARCH ]
    self.checkSearching = (input) => {
      if (input) {
        self.searching = true;
        $(".search-box-ul").css("display", "block");
      } else {
        $timeout(() => {
          self.searching = false;
        }, 500);
      }
    };
    self.onSuggest = () => {
      $http.get("/products/search/true/" + self.search).then(
        (res) => {
          self.suggestProducts = res.data;
        },
        (res) => {
          self.suggestProducts = [];
        }
      );
    };
    self.onSearch = () => {
      $window.location.href = "/search/product/" + self.search;
    };
    //#endregion

    //#region [ ORDER ]
    // Calculate Amount
    self.calculateAmount = () => {
      if (_isNullOrEmpty(self.Order.Quantity) || self.Order.Quantity <= 0) {
        self.Order.Quantity = 1;
      }
      self.Order.Amount = self.Order.Quantity * self.Order.Price;
    };
    // Increase Quantity
    self.increaseQuantity = () => {
      self.Order.Quantity++;
      self.calculateAmount();
    };
    // Reduction Quantity
    self.reductionQuantity = () => {
      self.Order.Quantity--;
      self.calculateAmount();
    };
    // Open Order
    self.onOpenOrder = (id, name, image, price) => {
      self.Order.ProductId = id;
      self.ProductName = name;
      self.ProductImage = image;
      self.Order.Price = price;
      self.Order.Quantity = 1;
      self.Order.Price = price;
      self.Order.Amount = self.Order.Price * self.Order.Quantity;
    };
    // Check Valid
    self.checkValid = () => {
      if (
        !_isNullOrEmpty(self.Order.ProductId) &&
        !_isNullOrEmpty(self.Order.Gender) &&
        !_isNullOrEmpty(self.Order.Name) &&
        !_isNullOrEmpty(self.Order.PhoneNumber) &&
        !_isNullOrEmpty(self.Order.Address) &&
        !_isNullOrEmpty(self.Order.Price) &&
        !_isNullOrEmpty(self.Order.Quantity) &&
        !_isNullOrEmpty(self.Order.Amount)
      ) {
        return true;
      } else {
        return false;
      }
    };
    // Order
    self.onOrder = () => {
      if (self.checkValid()) {
        const temp = {
          ProductId: self.Order.ProductId,
          Price: self.Order.Price,
          Quantity: self.Order.Quantity,
          Amount: self.Order.Amount,
          Gender: self.Order.Gender === "true" ? true : false,
          Name: self.Order.Name,
          PhoneNumber: self.Order.PhoneNumber,
          Email: self.Order.Email,
          Address: self.Order.Address,
          Note: self.Order.Note,
        };
        $http.post("/api/OrderAPI", temp).then(
          (res) => {
            $("#modalAddCart").modal("toggle");
            $("#modalBuySuccess").modal("toggle");
          },
          (res) => {
            alert("Gửi phiếu đặt hàng thất bại");
          }
        );
      }
    };
    //#endregion

    // Check Null Or Empty
    function _isNullOrEmpty(input) {
      if (input === null || input === "" || input === undefined) {
        return true;
      } else {
        return false;
      }
    }
  });
