import templateUrl from "./product-group-datagrid.component.html";

export default class ProductGroupDatagridController {
  constructor(
    $scope,
    CommonService,
    DevextremeService,
    ProductGroupService,
    ProductCategoryService
  ) {
    "ngInject";

    // SERVICE
    this.$scope = $scope;
    this.commonService = CommonService;
    this.devextremeService = DevextremeService;
    this.productGroupService = ProductGroupService;
    this.productCategoryService = ProductCategoryService;

    // VAR
    this.datagrid = {};
    this.gridInstance = {};
    this.create = {
      visible: false,
    };
    this.edit = {
      id: null,
      visible: false,
    };
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

    // Init Datagrid
    this.datagrid = angular.extend(this.devextremeService.getDefaultGrid(), {
      onInitialized: (e) => {
        this.gridInstance = e.component;
      },
      bindingOptions: {
        "filterRow.visible": "showFilter",
        "columns[3].lookup.dataSource": "categories",
      },
      dataSource: this.productGroupService.gets([
        "Id",
        "Name",
        "CategoryId",
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
          width: 80,
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
          cssClass: "font-weight-bold",
          caption: "TÊN",
          dataField: "Name",
          dataType: "string",
          minWidth: 150,
        },
        {
          //3
          allowEditing: false,
          caption: "DANH MỤC",
          dataField: "CategoryId",
          dataType: "number",
          lookup: {
            displayExpr: "Name",
            valueExpr: "Id",
          },
          width: 200,
        },
        {
          //4
          allowEditing: false,
          alignment: "left",
          caption: "THỜI GIAN",
          dataField: "CreateTime",
          dataType: "date",
          format: "dd/MM/yyyy",
          customizeText: function(cellInfo) {
            return cellInfo.valueText;
          },
          width: 100,
        },
      ],
      // editing: {
      //   mode: "cell",
      //   allowAdding: false,
      //   allowDeleting: false,
      //   allowUpdating: true,
      // },
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
              hint: "Thêm nhóm",
              icon: "add",
              text: "Thêm nhóm",
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
                this.gridInstance.getDataSource().reload();
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
  $onInit() {}

  //#region [ CREATE ]
  onCreate() {
    this.create.visible = true;
  }
  onCreated() {
    this.gridInstance.getDataSource().reload();
  }
  onCreateClosed() {
    this.create.visible = false;
  }
  //#endregion

  //#region [ EDIT ]
  onEdit(id) {
    this.edit.id = id;
    this.edit.visible = true;
  }
  onEdited() {
    this.gridInstance.getDataSource().reload();
  }
  onEditClosed() {
    this.edit.id = null;
    this.edit.visible = false;
  }
  //#endregion

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

ProductGroupDatagridController.$inject = [
  "$scope",
  "CommonService",
  "DevextremeService",
  "ProductGroupService",
  "ProductCategoryService",
];

export const ProductGroupDatagridComponent = {
  template: templateUrl,
  controller: ProductGroupDatagridController,
};
