import templateUrl from "./component-create.component.html";

export default class ComponentCreateController {
  constructor(
    $rootScope,
    $scope,
    DevextremeService,
    CommonService,
    ComponentService,
    ModuleService
  ) {
    "ngInject";

    this.$scope = $scope;
    this.commonService = CommonService;
    this.devextremeService = DevextremeService;
    this.componentService = ComponentService;
    this.moduleService = ModuleService;

    this.loadPanelInstance = {};

    this.$scope.data = {
      ModuleId: null,
      Name: null,
      MainTitle: null,
      SubTitle: null,
      Content: null,
      Link: null,
      TextButton: null,
      Published: true,
      SortOrder: 0,
      Note: null,
      Images: [],
    };
    // Modules
    this.$scope.modules = [];
    this.$scope.$watch(
      () => {
        return this.moduleService.getModules();
      },
      (newValue, oldValue) => {
        this.$scope.modules = newValue;
      }
    );

    // SET TITLE
    $rootScope.title = "Thêm thành phần";
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
      },
      slbModule: {
        displayExpr: "Name",
        valueExpr: "Id",
        searchEnabled: true,
        placeholder: "Chọn module ...",
        showClearButton: true,
        bindingOptions: {
          dataSource: "modules",
          value: "data.ModuleId",
        },
      },
      nbSortOrder: {
        showClearButton: true,
        bindingOptions: {
          value: "data.SortOrder",
        },
      },
      cbPublished: {
        bindingOptions: {
          value: "data.Published",
        },
        text: " Xuất bản",
      },
      // Main Title
      tbMainTitle: {
        showClearButton: true,
        bindingOptions: {
          value: "data.MainTitle",
        },
      },
      tbSubTitle: {
        showClearButton: true,
        bindingOptions: {
          value: "data.SubTitle",
        },
      },
      tbLink: {
        showClearButton: true,
        bindingOptions: {
          value: "data.Link",
        },
      },
      tbTextButton: {
        showClearButton: true,
        bindingOptions: {
          value: "data.TextButton",
        },
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
        text: "CHỌN MEDIA",
        type: "primary",
        onClick: () => {
          this.addMedia();
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
          this.componentService.redirectList();
        },
      },
    };

    this.validators = {
      name: {
        validationRules: [
          {
            type: "required",
            message: "Nhập tên",
          },
        ],
      },
    };

    this.loadPanel = angular.extend(
      angular.copy(this.devextremeService.getDefaultLoadPanel()),
      {
        message: "Đang xử lý",
        onInitialized: (e) => {
          this.loadPanelInstance = e.component;
        },
      }
    );
  }

  // --- MULTI MEDIA ---
  // Add Media
  addMedia() {
    var finder = new CKFinder();
    finder.selectActionFunction = (fileUrl) => {
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
    this.$scope.$apply();
  }

  // SAVE
  onSave(e) {
    this.loadPanelInstance.show();

    this.componentService.create(this.$scope.data).then(
      (res) => {
        this.componentService.redirectEdit(res.data);
        toastr.success("Lưu thành phần", "Thành công");

        this.loadPanelInstance.hide();
      },
      (res) => {
        toastr.error("Lưu thành phần", "Thất bại");

        this.loadPanelInstance.hide();
      }
    );
  }
}

ComponentCreateController.$inject = [
  "$rootScope",
  "$scope",
  "DevextremeService",
  "CommonService",
  "ComponentService",
  "ModuleService",
];

export const ComponentCreateComponent = {
  template: templateUrl,
  controller: ComponentCreateController,
};
