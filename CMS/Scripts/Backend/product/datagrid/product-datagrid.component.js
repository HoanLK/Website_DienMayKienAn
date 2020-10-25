import templateUrl from "./product-datagrid.component.html";

export default class ProductDatagridController {
  constructor(
    $scope,
    CommonService,
    DevextremeService,
    ProductService,
    ProductCategoryService,
    BrandService
  ) {
    "ngInject";

    this.$scope = $scope;
    this.commonService = CommonService;
    this.devextremeService = DevextremeService;
    this.productService = ProductService;
    this.productCategoryService = ProductCategoryService;
    this.brandService = BrandService;

    // VAR
    this.datagrid = {};
    this.gridInstance = {};
    this.loadPanelInstance = {};
    this.delete = {
      id: null,
      visible: false,
    };

    this.$scope.showFilter = true;

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
    // Types
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

    // Init Datagrid
    this.datagrid = angular.extend(this.devextremeService.getDefaultGrid(), {
      onInitialized: (e) => {
        this.gridInstance = e.component;
      },
      bindingOptions: {
        "filterRow.visible": "showFilter",
        "columns[6].lookup.dataSource": "categories",
        "columns[7].lookup.dataSource": "brands",
        "columns[8].lookup.dataSource": "types",
      },
      dataSource: this.productService.gets([
        "Id",
        "Code",
        "ThumbImage",
        "CategoryId",
        "BrandId",
        "GroupId",
        "ProductGroup.Name",
        "Name",
        "Type",
        "Price",
        "Published",
        "Featured",
        "SortOrder",
        "Note",
        "CreateTime",
        "Views",
      ]),
      columns: [
        {
          // 0
          dataType: "string",
          cellTemplate: "functionBtnTemplate",
          showInColumnChooser: false,
          caption: "",
          allowEditing: false,
          allowExporting: false,
          allowFiltering: false,
          allowGrouping: false,
          allowHeaderFiltering: false,
          allowHiding: false,
          allowReordering: false,
          allowResizing: false,
          allowSearch: false,
          allowSorting: false,
          width: 120,
        },
        {
          //1
          allowEditing: false,
          caption: "ID",
          dataField: "Id",
          dataType: "number",
          visible: false,
          width: 60,
        },
        {
          //2
          allowEditing: false,
          caption: "HÌNH ẢNH",
          dataField: "ThumbImage",
          dataType: "string",
          cellTemplate: "imageCellTemplate",
          width: 100,
        },
        {
          //3
          cssClass: "font-weight-bold editable-column",
          caption: "TÊN",
          dataField: "Name",
          dataType: "string",
          sortOrder: "asc",
          minWidth: 300,
        },
        {
          //4
          cssClass: "editable-column",
          caption: "MÃ",
          dataField: "Code",
          dataType: "string",
          width: 80,
        },
        {
          //5
          allowEditing: false,
          alignment: "right",
          caption: "GIÁ",
          dataField: "Price",
          dataType: "number",
          format: "fixedPoint",
          width: 100,
        },
        {
          //6
          allowEditing: false,
          caption: "DANH MỤC",
          dataField: "CategoryId",
          dataType: "number",
          lookup: {
            displayExpr: "Name",
            valueExpr: "Id",
          },
          width: 150,
        },
        {
          //7
          allowEditing: false,
          caption: "NHÃN HIỆU",
          dataField: "BrandId",
          dataType: "number",
          lookup: {
            displayExpr: "Name",
            valueExpr: "Id",
          },
          width: 150,
        },
        {
          //8
          allowEditing: false,
          caption: "LOẠI",
          dataField: "Type",
          dataType: "number",
          lookup: {
            displayExpr: "text",
            valueExpr: "value",
          },
          width: 100,
        },
        {
          //9
          allowEditing: false,
          caption: "NHÓM",
          dataField: "ProductGroup.Name",
          dataType: "string",
          width: 150,
        },
        {
          //10
          cssClass: "editable-column",
          caption: "XUẤT BẢN",
          dataField: "Published",
          dataType: "boolean",
          cellTemplate: "publishedCellTemplate",
          trueText: "Xuất bản",
          falseText: "Chưa xuất bản",
          width: 100,
        },
        {
          //11
          cssClass: "editable-column",
          caption: "NỔI BẬT",
          dataField: "Featured",
          dataType: "boolean",
          cellTemplate: "featuredCellTemplate",
          trueText: "Có",
          falseText: "Không",
          width: 100,
        },
        {
          //12
          cssClass: "editable-column",
          caption: "THỨ TỰ",
          dataField: "SortOrder",
          dataType: "number",
          width: 100,
        },
        {
          //13
          allowEditing: false,
          alignment: "center",
          caption: "VIEWS",
          dataField: "Views",
          dataType: "number",
          cellTemplate: "viewsCellTemplate",
          width: 80,
        },
      ],
      editing: {
        mode: "cell",
        allowAdding: false,
        allowDeleting: false,
        allowUpdating: true,
      },
      stateStoring: {
        customLoad: null,
        customSave: null,
        enabled: true,
        savingTimeout: 50,
        storageKey: "datagridProducts",
        type: "localStorage",
      },
      summary: {
        texts: {
          count: "{0}",
        },
        totalItems: [
          {
            column: "Name",
            summaryType: "count",
          },
        ],
      },
      rowFilter: {
        visible: this.showFilter,
      },
      onToolbarPreparing: (e) => {
        e.toolbarOptions.items.unshift(
          // RIGHT
          {
            // CREATE
            location: "before",
            widget: "dxButton",
            options: {
              hint: "Thêm sản phẩm",
              icon: "add",
              text: "Thêm sản phẩm",
              type: "success",
              onClick: () => {
                this.onCreate();
              },
            },
            locateInMenu: "auto",
          },
          {
            // FILTER
            location: "after",
            widget: "dxButton",
            options: {
              hint: "Lọc dữ liệu",
              icon: "filter",
              type: this.$scope.showFilter ? "success" : "normal",
              onClick: () => {
                setTimeout(() => {
                  this.$scope.showFilter = !this.$scope.showFilter;
                  this.gridInstance.repaint();
                }, 0);
              },
            },
            locateInMenu: "auto",
          },
          {
            // REFRESH
            location: "after",
            widget: "dxButton",
            options: {
              hint: "Refresh",
              icon: "refresh",
              onClick: () => {
                localStorage.removeItem("datagridProducts");
                location.reload();
              },
            },
            locateInMenu: "auto",
          }
        );
      },
      onRowDblClick: (e) => {
        this.onEdit(e.data.Id);
      },
    });
  }

  // INIT
  $onInit() {
    this.initControls();
  }

  // INIT CONTROLS
  initControls() {
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

  // CREATE
  onCreate() {
    this.productService.redirectCreate();
  }

  // EDIT
  onEdit(id) {
    this.productService.redirectEdit(id);
  }

  // DELETE
  onDelete(id) {
    this.delete.id = id;
    this.delete.visible = true;
  }
  onDeleted() {
    this.delete = {
      id: null,
      visible: false,
    };
    this.gridInstance.getDataSource().reload();
  }
  onClosedDelete() {
    this.delete = {
      id: null,
      visible: false,
    };
  }

  // CLONE
  onClone(id) {
    this.loadPanelInstance.show();

    this.productService.clone(id).then(
      (res) => {
        toastr.success("Nhân đôi sản phẩm", "Thành công");
        this.gridInstance.getDataSource().reload();
        this.loadPanelInstance.hide();
      },
      (res) => {
        toastr.error("Nhân đôi sản phẩm", "Thất bại");

        this.loadPanelInstance.hide();
      }
    );
  }
}

ProductDatagridController.$inject = [
  "$scope",
  "CommonService",
  "DevextremeService",
  "ProductService",
  "ProductCategoryService",
  "BrandService",
];

export const ProductDatagridComponent = {
  template: templateUrl,
  controller: ProductDatagridController,
};
