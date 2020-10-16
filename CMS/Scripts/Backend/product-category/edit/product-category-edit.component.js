import templateUrl from "./product-category-edit.component.html";

export default class ProductCategoryEditController {
  constructor(
    $rootScope,
    $scope,
    $stateParams,
    $timeout,
    DevextremeService,
    CommonService,
    ProductCategoryService
  ) {
    "ngInject";

    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.devextremeService = DevextremeService;
    this.commonService = CommonService;
    this.productCategoryService = ProductCategoryService;

    this.loadPanelInstance = {};

    this.$scope.statuses = [
      {
        value: true,
        text: "Xuất bản",
      },
      {
        value: false,
        text: "Không xuất bản",
      },
    ];

    this.id = this.$stateParams.id;
    this.$scope.data = {};

    // SET TITLE
    $rootScope.title = "Sửa danh mục";
  }

  // INIT
  $onInit() {
    this.initControls();
    this.getProductCategory();
  }

  // INIT CONTROLS
  initControls() {
    this.controls = {
      tbName: {
        showClearButton: true,
        bindingOptions: {
          value: "data.Name",
        },
      },
      taDescription: {
        showClearButton: true,
        bindingOptions: {
          value: "data.Description",
        },
      },
      nbCountImageBanner: {
        showClearButton: true,
        min: 0,
        max: 4,
        bindingOptions: {
          value: "data.CountImageBanner",
        },
      },
      slbStatus: {
        bindingOptions: {
          value: "data.Published",
          dataSource: "statuses",
        },
        displayExpr: "text",
        valueExpr: "value",
      },
      cbFeatured: {
        bindingOptions: {
          value: "data.Featured",
        },
        text: " Nổi bật",
      },
      nbSortOrder: {
        showClearButton: true,
        bindingOptions: {
          value: "data.SortOrder",
        },
      },
      tbIcon: {
        bindingOptions: {
          value: "data.Icon",
          "buttons[0].options.icon": "data.Icon",
        },
        buttons: [
          {
            location: "after",
            name: "chooseImage",
          },
        ],
      },
      tbImage: {
        bindingOptions: {
          value: "data.Image",
        },
        buttons: [
          {
            location: "after",
            name: "chooseImage",
            options: {
              icon: "image",
              hint: "Chọn hình ảnh",
              onClick: (e) => {
                this.chooseImage();
              },
            },
          },
        ],
      },
      tbImageBanner: {
        bindingOptions: {
          value: "data.ImageBanner",
        },
        buttons: [
          {
            location: "after",
            name: "chooseImageBanner",
            options: {
              icon: "image",
              hint: "Chọn hình ảnh",
              onClick: (e) => {
                this.chooseImageBanner();
              },
            },
          },
        ],
      },
      taNote: {
        height: 80,
        bindingOptions: {
          value: "data.Note",
        },
      },
      // Media
      btnAddMedia: {
        icon: "fa fa-image",
        text: "THÊM ẢNH",
        type: "primary",
        onClick: () => {
          this.addMedia();
        },
      },
      // SEO
      tbSEOTitle: {
        showClearButton: true,
        bindingOptions: {
          value: "data.SEO_Title",
        },
      },
      taSEODescription: {
        height: 100,
        bindingOptions: {
          value: "data.SEO_Description",
        },
      },
      btnSave: {
        icon: "fa fa-save",
        text: "LƯU",
        type: "success",
        useSubmitBehavior: true,
      },
      btnClose: {
        icon: "fa fa-times",
        text: "ĐÓNG",
        type: "danger",
        onClick: () => {
          this.productCategoryService.redirectList();
        },
      },
    };

    this.validators = {
      title: {
        validationRules: [
          {
            type: "required",
            message: "Nhập tiêu đề",
          },
        ],
      },
    };

    this.loadPanel = angular.extend(
      angular.copy(this.devextremeService.getDefaultLoadPanel()),
      {
        message: `Đang xử lý`,
        onInitialized: (e) => {
          this.loadPanelInstance = e.component;
        },
      }
    );
  }

  // Get Product Category
  getProductCategory() {
    this.productCategoryService.get(this.id).then(
      (res) => {
        angular.copy(res.data, this.$scope.data);
      },
      (res) => {
        toastr.error("Lấy dữ liệu", "Thất bại");
      }
    );
  }

  // Choose Image
  chooseImage() {
    var finder = new CKFinder();
    finder.selectActionFunction = (fileUrl) => {
      this.$scope.data.Image = fileUrl;
      this.$scope.data.SEO_Image = fileUrl;
      this.$scope.$apply();
    };
    finder.SelectFunction = "ShowFileInfo";
    finder.popup();
  }
  // Clear Image
  clearImage() {
    this.$scope.data.Image = "";
    this.$scope.data.SEO_Image = "";
  }

  // Choose Image Banner
  chooseImageBanner() {
    var finder = new CKFinder();
    finder.selectActionFunction = (fileUrl) => {
      this.$scope.data.ImageBanner = fileUrl;
      this.$scope.$apply();
    };
    finder.SelectFunction = "ShowFileInfo";
    finder.popup();
  }
  // Clear Image Banner
  clearImageBanner() {
    this.$scope.data.ImageBanner = "";
  }

  //#region [ IMAGES ]
  // Add Image
  addMedia() {
    var finder = new CKFinder();
    finder.selectActionFunction = (fileUrl) => {
      this.$scope.data.Images.push(fileUrl);
      this.$scope.$apply();
    };
    finder.SelectFunction = "ShowFileInfo";
    finder.popup();
  }
  // Update Image
  updateMedia(index) {
    var finder = new CKFinder();
    finder.selectActionFunction = (fileUrl) => {
      this.$scope.data.Images[index] = fileUrl;
      this.$scope.$apply();
    };
    finder.SelectFunction = "ShowFileInfo";
    finder.popup();
  }
  // Remove Image
  removeMedia(index) {
    this.$scope.data.Images.splice(index, 1);
    // this.$scope.$apply();
  }
  //#endregion

  // SAVE
  onSave(e) {
    this.loadPanelInstance.show();

    this.productCategoryService.edit(this.id, this.$scope.data).then(
      (res) => {
        toastr.success("Lưu sản phẩm", "Thành công");

        this.loadPanelInstance.hide();
      },
      (res) => {
        toastr.error("Lưu sản phẩm", "Thất bại");

        this.loadPanelInstance.hide();
      }
    );
  }
}

ProductCategoryEditController.$inject = [
  "$rootScope",
  "$scope",
  "$stateParams",
  "$timeout",
  "DevextremeService",
  "CommonService",
  "ProductCategoryService",
];

export const ProductCategoryEditComponent = {
  template: templateUrl,
  controller: ProductCategoryEditController,
};
