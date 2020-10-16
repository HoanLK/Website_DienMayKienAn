import templateUrl from "./banner-edit.component.html";

export default class BannerEditController {
  constructor(
    $rootScope,
    $scope,
    $stateParams,
    $timeout,
    DevextremeService,
    CommonService,
    BannerService
  ) {
    "ngInject";

    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.devextremeService = DevextremeService;
    this.commonService = CommonService;
    this.bannerService = BannerService;

    this.treeViewInstance = {};
    this.loadPanelInstance = {};

    this.$scope.rootValue = null;
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
    this.$scope.id = this.$stateParams.id;
    this.$scope.data = {};

    // SET TITLE
    $rootScope.title = "Sửa banner";
  }

  // INIT
  $onInit() {
    this.initControls();
    this.getBanner();
  }

  // INIT CONTROLS
  initControls() {
    this.controls = {
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
      taContent: {
        height: 100,
        bindingOptions: {
          value: "data.Content",
        },
      },
      tbTextButton: {
        showClearButton: true,
        bindingOptions: {
          value: "data.TextButton",
        },
      },
      tbLink: {
        showClearButton: true,
        bindingOptions: {
          value: "data.Link",
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
      taNote: {
        height: 80,
        bindingOptions: {
          value: "data.Note",
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
          this.bannerService.redirectList();
        },
      },
    };

    this.validators = {};

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

  // Get Banner
  getBanner() {
    this.$timeout(() => {
      this.loadPanelInstance.show();
    });

    this.bannerService.get(this.$scope.id).then(
      (res) => {
        angular.copy(res.data, this.$scope.data);

        this.loadPanelInstance.hide();
      },
      (res) => {
        toastr.error("Lấy dữ liệu banner", "Thất bại");
        this.bannerService.redirectList();

        this.loadPanelInstance.hide();
      }
    );
  }

  // Choose Image
  chooseImage() {
    var finder = new CKFinder();
    finder.selectActionFunction = (fileUrl) => {
      this.$scope.data.Image = fileUrl;
      this.$scope.$apply();
    };
    finder.SelectFunction = "ShowFileInfo";
    finder.popup();
  }

  // Clear Image
  clearImage() {
    this.$scope.data.Image = "";
  }

  // SAVE
  onSave(e) {
    this.loadPanelInstance.show();

    this.bannerService.edit(this.$scope.id, this.$scope.data).then(
      (res) => {
        toastr.success("Lưu banner", "Thành công");

        this.loadPanelInstance.hide();
      },
      (res) => {
        toastr.error("Lưu banner", "Thất bại");

        this.loadPanelInstance.hide();
      }
    );
  }
}

BannerEditController.$inject = [
  "$rootScope",
  "$scope",
  "$stateParams",
  "$timeout",
  "DevextremeService",
  "CommonService",
  "BannerService",
];

export const BannerEditComponent = {
  template: templateUrl,
  controller: BannerEditController,
};
