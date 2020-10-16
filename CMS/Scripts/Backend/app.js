import angular from "angular";
import uiRouter from "angular-ui-router";
import ngCookies from "angular-cookies";
import ngSanitize from "angular-sanitize";

import "devextreme/dist/js/dx.all";
import config from "./config";

import DevextremeService from "./services/devextreme.service";
import CommonService from "./services/common.service";

import { PostModule } from "./post/post.module";
import { PostCategoryModule } from "./post-category/post-category.module";
import { ComponentModule } from "./component/component.module";
import { ModuleModule } from "./module/module.module";
import { ProductCategoryModule } from "./product-category/product-category.module";
import { ProductGroupModule } from "./product-group/product-group.module";
import { ProductModule } from "./product/product.module";
import { CertificateModule } from "./certificate/certificate.module";
import { InfoModule } from "./info/info.module";
import { BrandModule } from "./brand/brand.module";
import { BannerModule } from "./banner/banner.module";
import { OrderModule } from "./order/order.module";

DevExpress.localization.locale("vi");

export const App = angular
  .module("app", [
    "dx",
    "ng.ckeditor",
    uiRouter,
    ngCookies,
    ngSanitize,
    PostModule,
    PostCategoryModule,
    ComponentModule,
    ModuleModule,
    ProductCategoryModule,
    ProductModule,
    CertificateModule,
    InfoModule,
    BrandModule,
    ProductGroupModule,
    BannerModule,
    OrderModule,
  ])
  .service("CommonService", CommonService)
  .service("DevextremeService", DevextremeService)
  .config(config)
  .directive("ckEditor", function() {
    return {
      require: "?ngModel",
      link: function(scope, elm, attr, ngModel) {
        var ck = CKEDITOR.replace(elm[0]);
        if (!ngModel) return;
        ck.on("instanceReady", function() {
          ck.setData(ngModel.$viewValue);
        });
        function updateModel() {
          scope.$apply(function() {
            ngModel.$setViewValue(ck.getData());
          });
        }
        ck.on("change", updateModel);
        ck.on("key", updateModel);
        ck.on("dataReady", updateModel);

        ngModel.$render = function(value) {
          ck.setData(ngModel.$viewValue);
        };
      },
    };
  }).name;
