const API_URL = "/api/OrderAPI";
const ODATA_URL = "/odata/OrderOData";
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

export default class OrderService {
    constructor($q, $window, $http, CommonService) {
        "ngInject";
        this.$q = $q;
        this.$window = $window;
        this.$http = $http;
        this.commonService = CommonService;
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

            update: (key, values) => {
                return this.$http.patch(`${ODATA_URL}('${key}')`, values).then(
                    (res) => {
                        toastr.success("Lưu thành công");
                    },
                    (res) => {
                        toastr.error("Lưu thất bại");
                    }
                );
            },
        });
    }

    // GET
    get(id) {
        return this.$http.get(`${API_URL}/${id}`);
    }

    // DELETE
    delete(id) {
        return this.$http.delete(`${API_URL}/${id}`);
    }


    //--- REDIRECT ---

    // REDIRECT LIST
    redirectList() {
        this.$window.location.href = "/admin#!/order";
    }
}

OrderService.$inject = ["$q", "$window", "$http", "CommonService"];
