import templateUrl from "./product-create.component.html";

export default class ProductCreateController {
  constructor(
    $q,
    $rootScope,
    $scope,
    DevextremeService,
    CommonService,
    ProductService,
    ProductCategoryService,
    ProductGroupService,
    BrandService
  ) {
    "ngInject";

    // SERVICE
    this.$scope = $scope;
    this.commonService = CommonService;
    this.devextremeService = DevextremeService;
    this.productService = ProductService;
    this.productCategoryService = ProductCategoryService;
    this.productGroupService = ProductGroupService;
    this.brandService = BrandService;

    // VAR
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
    this.$scope.types = [
      {
        value: 0,
        text: "Bình thường",
      },
      {
        value: 1,
        text: "Mới",
      },
      {
        value: 2,
        text: "Hot",
      },
      {
        value: 3,
        text: "Khuyến mãi",
      },
    ];
    this.$scope.data = {
      CategoryId: null,
      Name: null,
      Code: null,
      Description: null,
      Content: null,
      Type: 0, // 0 - Bình thường; 1 - Mới; 2 - Hot; 3 - Khuyến mãi
      Price: 0,
      OldPrice: 0,
      EN_Name: null,
      EN_Description: null,
      EN_Content: null,
      Published: true,
      Featured: false,
      Image: null,
      ImageBanner: null,
      Tags: null,
      SortOrder: 0,
      Note: null,
      SEO_Title: null,
      SEO_Description: null,
      SEO_Keywords: null,
      SEO_Image: null,
      Images: [],
    };
    // Categories
    this.$scope.categories = [];
    this.$scope.$watch(
      () => {
        return this.productCategoryService.getCategories();
      },
      (newValue, oldValue) => {
        this.$scope.categories = newValue;
      }
    );
    // Groups
    this.createGroup = {
      visible: false,
    };
    this.$scope.groups = [];
    this.$scope.$watch(
      () => {
        return this.productGroupService.getGroups();
      },
      (newValue, oldValue) => {
        this.$scope.groups = newValue;
      }
    );
    // Brands
    this.$scope.brands = [];
    this.$scope.competitors = [];
    this.$scope.$watch(
      () => {
        return this.brandService.getBrands();
      },
      (newValue, oldValue) => {
        this.$scope.brands = newValue;
        newValue.forEach((e) => {
          if (e.Note == "Đối thủ") {
            this.$scope.competitors.push(e);
          }
        });
      }
    );
    // TechInfo
    this.techInfoDatagrid = {};
    this.gridTechInfoInstance = {};
    this.$scope.techInfos = [];
    // Prices
    this.pricesDatagrid = {};
    this.gridPricesInstance = {};
    this.$scope.prices = [];

    // SET TITLE
    $rootScope.title = "Thêm sản phẩm";
  }

  // INIT
  $onInit() {
    this.initControls();
    this.initDatagrid();
  }

  // INIT DATAGRID
  initDatagrid() {
    // TechInfo
    this.techInfoDatagrid = {
      onInitialized: (e) => {
        this.gridTechInfoInstance = e.component;
      },
      bindingOptions: {
        dataSource: "techInfos",
      },
      columns: [
        {
          // 0
          caption: "TÊN",
          dataField: "Field",
          dataType: "string",
          validationRules: [{ type: "required", message: "Nhập tên" }],
        },
        {
          // 1
          caption: "THÔNG SỐ",
          dataField: "Value",
          dataType: "string",
          validationRules: [{ type: "required", message: "Nhập thông số" }],
        },
      ],
      editing: {
        mode: "cell",
        allowAdding: true,
        allowDeleting: true,
        allowUpdating: true,
      },
      keyExpr: "Field",
    };
    // Prices
    this.pricesDatagrid = {
      onInitialized: (e) => {
        this.gridPricesInstance = e.component;
      },
      bindingOptions: {
        dataSource: "prices",
        "columns[0].lookup.dataSource": "competitors",
      },
      columns: [
        {
          //0
          caption: "TÊN THƯƠNG HIỆU",
          dataField: "Id",
          dataType: "number",
          lookup: {
            displayExpr: "Name",
            valueExpr: "Id",
          },
          validationRules: [{ type: "required", message: "Chọn thương hiệu" }],
        },
        {
          // 1
          caption: "GIÁ",
          dataField: "Price",
          dataType: "number",
          format: "fixedPoint",
          width: "120",
          validationRules: [{ type: "required", message: "Nhập giá" }],
        },
        {
          // 2
          caption: "LINK",
          dataField: "Link",
          dataType: "string",
          width: "200",
        },
      ],
      editing: {
        mode: "cell",
        allowAdding: true,
        allowDeleting: true,
        allowUpdating: true,
      },
      keyExpr: "Id",
    };
  }

  // INIT CONTROLS
  initControls() {
    this.controls = {
      slbGroup: {
        displayExpr: "Name",
        valueExpr: "Id",
        searchEnabled: true,
        placeholder: "Chọn nhóm ...",
        showClearButton: true,
        bindingOptions: {
          dataSource: "groups",
          value: "data.GroupId",
        },
        buttons: [
          {
            location: "after",
            name: "createGroup",
            options: {
              icon: "plus",
              hint: "Thêm nhóm sản phẩm",
              onClick: (e) => {
                this.onCreateGroup();
              },
            },
          },
        ],
      },
      slbCategory: {
        displayExpr: "Name",
        valueExpr: "Id",
        searchEnabled: true,
        placeholder: "Chọn danh mục ...",
        showClearButton: true,
        bindingOptions: {
          dataSource: "categories",
          value: "data.CategoryId",
        },
      },
      slbBrand: {
        displayExpr: "Name",
        valueExpr: "Id",
        searchEnabled: true,
        placeholder: "Chọn nhãn hiệu ...",
        showClearButton: true,
        bindingOptions: {
          dataSource: "brands",
          value: "data.BrandId",
        },
      },
      slbType: {
        displayExpr: "text",
        valueExpr: "value",
        searchEnabled: true,
        placeholder: "Chọn loại ...",
        bindingOptions: {
          dataSource: "types",
          value: "data.Type",
        },
      },
      tbName: {
        showClearButton: true,
        bindingOptions: {
          value: "data.Name",
        },
        onFocusOut: (e) => {
          this.$scope.data.SEO_Title = this.$scope.data.Name;
        },
      },
      tbCode: {
        showClearButton: true,
        bindingOptions: {
          value: "data.Code",
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
      nbPrice: {
        format: "#,##0",
        min: 0,
        rtlEnabled: true,
        bindingOptions: {
          value: "data.Price",
        },
      },
      nbOldPrice: {
        format: "#,##0",
        min: 0,
        rtlEnabled: true,
        bindingOptions: {
          value: "data.OldPrice",
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
          this.productService.redirectList();
        },
      },
    };

    this.validators = {
      name: {
        validationRules: [
          {
            type: "required",
            message: "Nhập tên sản phẩm",
          },
        ],
      },
      category: {
        validationRules: [
          {
            type: "required",
            message: "Chọn danh mục",
          },
        ],
      },
      brand: {
        validationRules: [
          {
            type: "required",
            message: "Chọn nhãn hiệu",
          },
        ],
      },
      price: {
        validationRules: [
          {
            type: "required",
            message: "Nhập giá",
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

  //#region [ IMAGE ]
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
  //#endregion

  //#region [ IMAGE BANNER ]
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
  //#endregion

  //#region [ IMAGES ]
  // Add Media
  addMedia() {
    var finder = new CKFinder();
    finder.selectActionFunction = (fileUrl) => {
      const tempArray = fileUrl.split("/");
      // Get path
      let path = "";
      tempArray.forEach((e, i) => {
        if (i < tempArray.length - 1) {
          path += e + "/";
        }
      });
      // Get Images
      const selectedFiles = finder.api.getSelectedFiles();
      selectedFiles.forEach((e) => {
        this.$scope.data.Images.push(path + e.name);
        this.$scope.$apply();
      });
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

  //#region [ CREATE GROUP ]
  onCreateGroup() {
    this.createGroup.visible = true;
  }
  onCreatedGroup() {}
  onCreateGroupClosed() {
    this.createGroup.visible = false;
  }
  //#endregion

  // SAVE
  onSave(e) {
    this.loadPanelInstance.show();

    // TechInfos
    this.gridTechInfoInstance
      .getDataSource()
      .load()
      .then((techInfos) => {
        this.$scope.data.Feature = JSON.stringify(techInfos);

        // Prices
        this.gridPricesInstance
          .getDataSource()
          .load()
          .then((prices) => {
            this.$scope.data.Prices = JSON.stringify(prices);

            this.productService.create(this.$scope.data).then(
              (res) => {
                this.productService.redirectEdit(res.data);
                toastr.success("Lưu sản phẩm", "Thành công");

                this.loadPanelInstance.hide();
              },
              (res) => {
                toastr.error("Lưu sản phẩm", "Thất bại");

                this.loadPanelInstance.hide();
              }
            );
          });
      });
  }
}

ProductCreateController.$inject = [
  "$q",
  "$rootScope",
  "$scope",
  "DevextremeService",
  "CommonService",
  "ProductService",
  "ProductCategoryService",
  "ProductGroupService",
  "BrandService",
];

export const ProductCreateComponent = {
  template: templateUrl,
  controller: ProductCreateController,
};
