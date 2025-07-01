"use strict";
(self["webpackChunkPAl"] = self["webpackChunkPAl"] || []).push([["resources_js_Admin_src_routes_authRoute_js"],{

/***/ "./resources/js/Admin/src/routes/authRoute.js":
/*!****************************************************!*\
  !*** ./resources/js/Admin/src/routes/authRoute.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");



function AuthRoute(_ref) {
  var children = _ref.children;
  var get_user = window.helpers.getStorageData('session');
  if (get_user) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.Navigate, {
      replace: true,
      to: "/admin/dashboard"
    });
  } else {
    return children;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AuthRoute);

/***/ })

}]);