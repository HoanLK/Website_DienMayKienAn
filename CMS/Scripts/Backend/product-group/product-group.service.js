const API_URL = "/api/ProductGroupAPI";
const ODATA_URL = "/odata/ProductGroupOData";
const LIST_FUNCTION = [
  "skip",
  "take",
  "requireTotalCount",
  "requireGroupCount",
  "sort",
  "filter",
  "totalSummary",
  "group",
  "groupSummary",
];

export default class ProductGroupService {
  constructor($q, $window, $http, CommonService) {
    "ngInject";
    this.$q = $q;
    this.$window = $window;
    this.$http = $http;
    this.commonService = CommonService;

    // Groups
    this.groups = [];
    this.gets(["Id", "Name"])
      .load()
      .then(
        (res) => {
          this.groups = res.data;
        },
        (res) => {
          toastr.error("Lấy danh sách nhóm sản phẩm", "Thất bại");
        }
      );
  }

  // GET CATEGORIES
  getGroups() {
    return this.groups;
  }

  // GETS
  gets(selects = []) {
    return new DevExpress.data.CustomStore({
      key: "Id",
      load: (loadOptions) => {
        let defer = this.$q.defer();
        let params = {};
        LIST_FUNCTION.forEach((i) => {
          if (i in loadOptions && !this.commonService.isNullOrEmpty(i))
            params[i] = JSON.stringify(loadOptions[i]);
        });
        params.select = JSON.stringify(selects);

        this.$http({
          method: "GET",
          url: API_URL,
          params: params,
        }).then(
          (res) => {
            defer.resolve(res.data);
          },
          (res) => {
            defer.reject(res);
            toastr.error("Không lấy được dữ liệu");
          }
        );

        return defer.promise;
      },
    });
  }

  // GET
  get(id) {
    return this.$http.get(`${API_URL}/${id}`);
  }

  // CREAT
  create(data) {
    return this.$http.post(API_URL, data);
  }

  // EDIT
  edit(id, data) {
    const index = this.groups.findIndex((g) => g.Id === id);
    this.groups[index] = { Id: id, Name: data.Name };

    return this.$http.put(`${API_URL}/${id}`, data);
  }

  // DELETE
  delete(id) {
    const index = this.groups.findIndex((g) => g.Id === id);
    this.groups.splice(index, 1);

    return this.$http.delete(`${API_URL}/${id}`);
  }

  //--- REDIRECT ---

  // REDIRECT LIST
  redirectList() {
    this.$window.location.href = "/admin#!/product-group";
  }

  // REDIRECT EDIT
  redirectEdit(id) {
    this.$window.location.href = `/admin#!/product-group/edit/${id}`;
  }

  // REDIRECT CREATE
  redirectCreate() {
    this.$window.location.href = "/admin#!/product-group/create";
  }
}

ProductGroupService.$inject = ["$q", "$window", "$http", "CommonService"];
