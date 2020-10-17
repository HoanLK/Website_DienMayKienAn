import templateUrl from "./product-edit.component.html";

export default class ProductEditController {
    constructor(
        $rootScope,
        $scope,
        $stateParams,
        $timeout,
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
        this.$stateParams = $stateParams;
        this.$timeout = $timeout;
        this.devextremeService = DevextremeService;
        this.commonService = CommonService;
        this.productService = ProductService;
        this.productCategoryService = ProductCategoryService;
        this.productGroupService = ProductGroupService;
        this.brandService = BrandService;

        // VAR
        this.techInfoDatagrid = {};
        this.loadPanelInstance = {};
        this.gridInstance = {};

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

        this.id = this.$stateParams.id;
        this.$scope.data = {};
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
        this.$scope.$watch(
            () => {
                return this.brandService.getBrands();
            },
            (newValue, oldValue) => {
                this.$scope.brands = newValue;
            }
        );
        // Thông tin kỹ thuật
        this.$scope.techInfos = [];

        // SET TITLE
        $rootScope.title = "Sửa sản phẩm";
    }

    // INIT
    $onInit() {
        this.initControls();
        this.initDatagrid();
        this.getProduct();
    }

    // INIT TECH INFO DATAGRID
    initDatagrid() {
        this.techInfoDatagrid = {
            onInitialized: (e) => {
                this.gridInstance = e.component;
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
                },
                {
                    // 1
                    caption: "THÔNG SỐ",
                    dataField: "Value",
                    dataType: "string",
                },
            ],
            editing: {
                mode: "cell",
                allowAdding: true,
                allowDeleting: true,
                allowUpdating: true,
            },
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
                rtlEnabled: true,
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

    // Get Product
    getProduct() {
        this.$timeout(() => {
            this.loadPanelInstance.show();
        });
        this.productService.get(this.id).then(
            (res) => {
                this.$timeout(() => {
                    angular.copy(res.data, this.$scope.data);

                    if (!this.isNullOrEmpty(this.$scope.data.Feature)) {
                        this.$scope.techInfos = JSON.parse(this.$scope.data.Feature);
                    } else {
                        this.$scope.techInfos = [];
                    }
                });

                this.loadPanelInstance.hide();
            },
            (res) => {
                toastr.error("Lấy dữ liệu", "Thất bại");

                this.loadPanelInstance.hide();

                this.productService.redirectList();
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

    //#region [ CREATE GROUP ]
    onCreateGroup() {
        this.createGroup.visible = true;
    }
    onCreatedGroup() {
        // this.gridInstance.getDataSource().reload();
    }
    onCreateGroupClosed() {
        this.createGroup.visible = false;
    }
    //#endregion

    // SAVE
    onSave(e) {
        this.loadPanelInstance.show();

        this.gridInstance
            .getDataSource()
            .load()
            .then((res) => {
                this.$scope.data.Feature = JSON.stringify(res);

                this.productService.edit(this.id, this.$scope.data).then(
                    (res) => {
                        toastr.success("Lưu sản phẩm", "Thành công");

                        this.loadPanelInstance.hide();
                    },
                    (res) => {
                        toastr.error("Lưu sản phẩm", "Thất bại");

                        this.loadPanelInstance.hide();
                    }
                );
            });
    }

    // Check Null Or Empty
    isNullOrEmpty(input) {
        if (input === null || input === "" || input === undefined || input == []) {
            return true;
        } else {
            return false;
        }
    }


}

ProductEditController.$inject = [
    "$rootScope",
    "$scope",
    "$stateParams",
    "$timeout",
    "DevextremeService",
    "CommonService",
    "ProductService",
    "ProductCategoryService",
    "ProductGroupService",
    "BrandService",
];

export const ProductEditComponent = {
    template: templateUrl,
    controller: ProductEditController,
};
