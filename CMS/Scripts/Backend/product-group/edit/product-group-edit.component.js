import templateUrl from "./product-group-edit.template.html";

export default class ProductGroupEditController {
  constructor(
    $scope,
    $timeout,
    DevextremeService,
    CommonService,
    ProductGroupService,
    ProductCategoryService
  ) {
    "ngInject";

    // Service
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.devExtremeService = DevextremeService;
    this.commonService = CommonService;
    this.service = ProductGroupService;
    this.productCategoryService = ProductCategoryService;
    // Variable
    this.$scope.data = {
      Id: null,
      Name: null,
      CategoryId: null,
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
    this.instance = {
      loadPanel: {},
      popup: {},
      // Control
      tbName: {},
      // Valid
      validName: {},
      validCategory: {},
    };

    // Load Panel
    this.loadPanel = angular.extend(
      angular.copy(this.devExtremeService.getDefaultLoadPanel()),
      {
        onInitialized: (e) => {
          this.instance.loadPanel = e.component;
        },
      }
    );

    // Popup
    this.popup = angular.extend(
      angular.copy(this.devExtremeService.getDefaultPopup()),
      {
        contentTemplate: "editTemplate",
        height: "auto",
        title: "Sửa nhóm sản phẩm",
        showTitle: true,
        width: 400,
        onInitialized: (e) => {
          this.instance.popup = e.component;
        },
        onShown: (e) => {
          // Focus
          this.instance.tbName.focus();
        },
        onHidden: (e) => {
          this.onClose();
        },
      }
    );

    // Control
    this.controls = {
      tbName: {
        showClearButton: true,
        bindingOptions: {
          value: "data.Name",
        },
        onInitialized: (e) => {
          this.instance.tbName = e.component;
        },
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
      // Button
      btnSave: {
        tabIndex: 0,
        text: "Lưu",
        icon: "floppy",
        type: "success",
        useSubmitBehavior: true,
      },
      btnClose: {
        tabIndex: 1,
        text: "Đóng",
        icon: "clear",
        type: "danger",
        onClick: (e) => {
          this.instance.popup.hide();
        },
      },
    };

    // Validation
    this.validators = {
      Name: {
        validationRules: [
          {
            type: "required",
            message: "Nhập tên",
          },
        ],
        onInitialized: (e) => {
          this.instance.validName = e.component;
        },
      },
      Category: {
        validationRules: [
          {
            type: "required",
            message: "Chọn danh mục",
          },
        ],
        onInitialized: (e) => {
          this.instance.validCategory = e.component;
        },
      },
    };
  }

  $onChanges(e) {
    // Show Popup
    if (e.visible && this.visible === true) {
      this.$timeout(() => {
        // Update Status
        this.instance.loadPanel.show();
        // Lấy dữ liệu cho model
        this.service.get(this.id).then(
          (res) => {
            this.$scope.data = angular.copy(res.data);

            // Update Status
            this.instance.popup.show();
            this.instance.loadPanel.hide();
          },
          (res) => {
            toastr.error("Không lấy được dữ liệu");

            this.onClose();
            // Update Status
            this.instance.popup.hide();
            this.instance.loadPanel.hide();
          }
        );
      });
    }
  }

  // Save
  save(e) {
    // Update Status
    this.instance.loadPanel.show();

    this.service.edit(this.id, this.$scope.data).then(
      (res) => {
        // Refresh Grid
        this.onSaved();

        // Update Status
        this.instance.popup.hide();
        this.instance.loadPanel.hide();

        // Message
        toastr.success("Lưu thành công");
      },
      (res) => {
        // Message
        switch (res.status) {
          case 409:
            toastr.error(
              'Tên "<b>' + this.$scope.data.Name + '</b>" đã tồn tại.'
            );
            break;
          default:
            toastr.error("Lưu thất bại");
        }

        // Update Status
        this.instance.loadPanel.hide();
      }
    );
  }
}

ProductGroupEditController.$inject = [
  "$scope",
  "$timeout",
  "DevextremeService",
  "CommonService",
  "ProductGroupService",
  "ProductCategoryService",
];

export const ProductGroupEditComponent = {
  template: templateUrl,
  controller: ProductGroupEditController,
  bindings: {
    id: "<",
    visible: "<",
    onSaved: "&",
    onClose: "&",
  },
};
