import templateUrl from "./product-category-create.component.html";

export default class ProductCategoryCreateController {
  constructor(
    $rootScope,
    $scope,
    DevextremeService,
    CommonService,
    ProductCategoryService
  ) {
    "ngInject";

    this.$scope = $scope;
    this.commonService = CommonService;
    this.devextremeService = DevextremeService;
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
    this.$scope.data = {
      Name: null,
      Description: null,
      Content: null,
      Published: true,
      Featured: false,
      Image: null,
      ImageBanner: null,
      CountImageBanner: 0,
      Tags: null,
      SortOrder: 0,
      Note: null,
      SEO_Title: null,
      SEO_Description: null,
      SEO_Keywords: null,
      SEO_Image: null,
      Images: [],
    };

    // SET TITLE
    $rootScope.title = "Thêm danh mục";
  }

  // INIT
  $onInit() {
    this.initControls();
  }

  // INIT CONTROLS
  initControls() {
    this.controls = {
      tbName: {
        showClearButton: true,
        bindingOptions: {
          value: "data.Name",
        },
        onFocusOut: (e) => {
          this.$scope.data.SEO_Title = this.$scope.data.Name;
        },
      },
      taDescription: {
        showClearButton: true,
        bindingOptions: {
          value: "data.Description",
        },
        onFocusOut: (e) => {
          this.$scope.data.SEO_Description = this.$scope.data.Description;
        },
      },
      nbCountImageBanner: {
        min: 0,
        max: 4,
        showClearButton: true,
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
      name: {
        validationRules: [
          {
            type: "required",
            message: "Nhập tên danh mục",
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
  // Add Media
  addMedia() {
    var finder = new CKFinder();
    finder.selectActionFunction = (fileUrl) => {
      console.log(fileUrl);

      this.$scope.data.Images.push(fileUrl);
      this.$scope.$apply();
    };
    finder.SelectFunction = "ShowFileInfo";
    finder.popup();
  }
  // Update Media
  updateMedia(index) {
    var finder = new CKFinder();
    finder.selectActionFunction = (fileUrl) => {
      this.$scope.data.Images[index] = fileUrl;
      this.$scope.$apply();
    };
    finder.SelectFunction = "ShowFileInfo";
    finder.popup();
  }
  // Remove Media
  removeMedia(index) {
    this.$scope.data.Images.splice(index, 1);
    // this.$scope.$apply();
  }
  //#endregion

  // SAVE
  onSave(e) {
    this.loadPanelInstance.show();

    this.productCategoryService.create(this.$scope.data).then(
      (res) => {
        this.productCategoryService.redirectEdit(res.data);
        toastr.success("Lưu danh mục", "Thành công");

        this.loadPanelInstance.hide();
      },
      (res) => {
        toastr.error("Lưu danh mục", "Thất bại");

        this.loadPanelInstance.hide();
      }
    );
  }
}

ProductCategoryCreateController.$inject = [
  "$rootScope",
  "$scope",
  "DevextremeService",
  "CommonService",
  "ProductCategoryService",
];

export const ProductCategoryCreateComponent = {
  template: templateUrl,
  controller: ProductCategoryCreateController,
};
