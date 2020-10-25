const API_URL = "/api/BrandAPI";
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

export default class BrandService {
  constructor($q, $window, $http, $filter, CommonService) {
    "ngInject";
    this.$q = $q;
    this.$window = $window;
    this.$http = $http;
    this.commonService = CommonService;

    // Brands
    this.brands = [];
    this.gets(["Id", "Name", "Image", "Note"])
      .load()
      .then(
        (res) => {
          this.brands = $filter("orderBy")(res.data, "Name", false);
        },
        (res) => {
          toastr.error("Lấy danh sách nhãn hiệu", "Thất bại");
        }
      );
  }

  // GET BRANDS
  getBrands() {
    return this.brands;
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
    this.brands.push({ Id: data.Id, Name: data.Name });
    return this.$http.post(API_URL, data);
  }

  // EDIT
  edit(id, data) {
    const index = this.brands.findIndex((g) => g.Id === id);
    this.brands[index] = { Id: id, Name: data.Name };

    return this.$http.put(`${API_URL}/${id}`, data);
  }

  // EDIT
  delete(id) {
    const index = this.brands.findIndex((g) => g.Id === id);
    this.brands.splice(index, 1);

    return this.$http.delete(`${API_URL}/${id}`);
  }

  //--- REDIRECT ---

  // REDIRECT LIST
  redirectList() {
    this.$window.location.href = "/admin#!/brand";
  }

  // REDIRECT EDIT
  redirectEdit(id) {
    this.$window.location.href = `/admin#!/brand/edit/${id}`;
  }

  // REDIRECT CREATE
  redirectCreate() {
    this.$window.location.href = "/admin#!/brand/create";
  }
}

BrandService.$inject = ["$q", "$window", "$http", "$filter", "CommonService"];
