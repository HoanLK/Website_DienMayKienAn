import templateUrl from "./order-datagrid.component.html";

export default class OrderDatagridController {
  constructor(
    $scope,
    CommonService,
    DevextremeService,
    OrderService,
    ProductCategoryService,
    BrandService
  ) {
    "ngInject";

    this.$scope = $scope;
    this.commonService = CommonService;
    this.devextremeService = DevextremeService;
    this.orderService = OrderService;
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
    // Genders
    this.$scope.genders = [
      {
        value: true,
        text: "Nam",
      },
      {
        value: false,
        text: "Nữ",
      },
    ];

    // Init Datagrid
    this.datagrid = angular.extend(this.devextremeService.getDefaultGrid(), {
      onInitialized: (e) => {
        this.gridInstance = e.component;
      },
      bindingOptions: {
        "filterRow.visible": "showFilter",
        "columns[7].columns[2].lookup.dataSource": "genders",
        "columns[8].lookup.dataSource": "categories",
        "columns[9].lookup.dataSource": "brands",
      },
      dataSource: this.orderService.gets([
        "Id",
        "ProductId",
        "Product.Name",
        "Product.CategoryId",
        "Product.BrandId",
        "Price",
        "Quantity",
        "Amount",
        "Name",
        "Gender",
        "PhoneNumber",
        "Email",
        "Address",
        "Note",
        "Processed",
        "CreateTime",
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
          width: 40,
        },
        {
          //1
          cssClass: "editable-column",
          caption: "XỬ LÝ",
          dataField: "Processed",
          dataType: "boolean",
          cellTemplate: "processedCellTemplate",
          trueText: "Đã xử lý",
          falseText: "Chưa xử lý",
          sortOrder: "asc",
          sortIndex: 0,
          width: 120,
        },
        {
          //2
          allowEditing: false,
          caption: "ID",
          dataField: "Id",
          dataType: "number",
          visible: false,
          width: 60,
        },
        {
          //3
          allowEditing: false,
          cssClass: "font-weight-bold",
          caption: "SẢN PHẨM",
          dataField: "Product.Name",
          dataType: "string",
          width: 300,
        },
        {
          //4
          allowEditing: false,
          alignment: "right",
          caption: "GIÁ",
          dataField: "Price",
          dataType: "number",
          format: "fixedPoint",
          width: 100,
        },
        {
          //5
          allowEditing: false,
          alignment: "right",
          caption: "SL",
          dataField: "Quantity",
          dataType: "number",
          format: "fixedPoint",
          width: 60,
        },
        {
          //6
          allowEditing: false,
          alignment: "right",
          caption: "TỔNG TIỀN",
          dataField: "Amount",
          dataType: "number",
          format: "fixedPoint",
          width: 100,
        },
        {
          //7
          caption: "THÔNG TIN KHÁCH HÀNG",
          alignment: "center",
          columns: [
            {
              //0
              cssClass: "editable-column",
              caption: "NGÀY ĐẶT",
              dataField: "CreateTime",
              dataType: "date",
              format: "dd/MM/yyyy",
              sortOrder: "desc",
              sortIndex: 1,
              width: 120,
            },
            {
              //1
              cssClass: "editable-column",
              caption: "TÊN",
              dataField: "Name",
              dataType: "string",
              width: 120,
            },
            {
              //2
              cssClass: "editable-column",
              caption: "GIỚI TÍNH",
              dataField: "Gender",
              dataType: "number",
              lookup: {
                displayExpr: "text",
                valueExpr: "value",
              },
              width: 100,
            },
            {
              //3
              cssClass: "editable-column",
              caption: "ĐIỆN THOẠI",
              dataField: "PhoneNumber",
              dataType: "string",
              width: 120,
            },
            {
              //4
              cssClass: "editable-column",
              caption: "EMAIL",
              dataField: "Email",
              dataType: "string",
              width: 150,
            },
            {
              //5
              cssClass: "editable-column",
              caption: "ĐỊA CHỈ",
              dataField: "Address",
              dataType: "string",
              width: 200,
            },
          ],
        },
        {
          //8
          allowEditing: false,
          caption: "DANH MỤC",
          dataField: "Product.CategoryId",
          dataType: "number",
          lookup: {
            displayExpr: "Name",
            valueExpr: "Id",
          },
          width: 120,
        },
        {
          //9
          allowEditing: false,
          caption: "NHÃN HIỆU",
          dataField: "Product.BrandId",
          dataType: "number",
          lookup: {
            displayExpr: "Name",
            valueExpr: "Id",
          },
          width: 120,
        },
        {
          //10
          cssClass: "editable-column",
          caption: "GHI CHÚ",
          dataField: "Note",
          dataType: "string",
          width: 150,
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
        savingTimeout: 2000,
        storageKey: "datagridOrders",
        type: "localStorage",
      },
      summary: {
        texts: {
          count: "{0}",
        },
        totalItems: [
          {
            column: "Processed",
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
                localStorage.removeItem("datagridOrders");
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
}

OrderDatagridController.$inject = [
  "$scope",
  "CommonService",
  "DevextremeService",
  "OrderService",
  "ProductCategoryService",
  "BrandService",
];

export const OrderDatagridComponent = {
  template: templateUrl,
  controller: OrderDatagridController,
};
