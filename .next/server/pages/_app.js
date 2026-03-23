/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./components/CartContext.js":
/*!***********************************!*\
  !*** ./components/CartContext.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CartProvider: () => (/* binding */ CartProvider),\n/* harmony export */   useCart: () => (/* binding */ useCart)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\n/** Number of distinct line items (products) in the cart, not total quantity. */ function lineItemCountInCart(cart) {\n    if (!cart) return 0;\n    const items = cart.items;\n    if (Array.isArray(items)) {\n        return items.length;\n    }\n    return Number(cart.items_count) || 0;\n}\nconst CartContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);\nfunction CartProvider({ children }) {\n    const [cart, setCart] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const refreshCart = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async ()=>{\n        setLoading(true);\n        try {\n            const r = await fetch(\"/api/wc/cart\", {\n                credentials: \"include\"\n            });\n            const data = await r.json();\n            if (!r.ok) {\n                setCart(null);\n                return;\n            }\n            setCart(data);\n        } catch  {\n            setCart(null);\n        } finally{\n            setLoading(false);\n        }\n    }, []);\n    /** Apply cart JSON from Woo Store API (e.g. add-item response) without a round trip */ const applyCartSnapshot = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((data)=>{\n        if (data && typeof data === \"object\" && (Array.isArray(data.items) || data.items_count != null)) {\n            setCart(data);\n            setLoading(false);\n        }\n    }, []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        refreshCart();\n    }, [\n        refreshCart\n    ]);\n    const itemCount = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>lineItemCountInCart(cart), [\n        cart\n    ]);\n    const value = {\n        cart,\n        loading,\n        refreshCart,\n        applyCartSnapshot,\n        itemCount\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CartContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"/home/faizan/Documents/projects/store-transform/git/headless_cms/components/CartContext.js\",\n        lineNumber: 70,\n        columnNumber: 9\n    }, this);\n}\nfunction useCart() {\n    const ctx = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(CartContext);\n    if (!ctx) {\n        throw new Error(\"useCart must be used within CartProvider\");\n    }\n    return ctx;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0NhcnRDb250ZXh0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPZTtBQUVmLDhFQUE4RSxHQUM5RSxTQUFTTSxvQkFBb0JDLElBQUk7SUFDN0IsSUFBSSxDQUFDQSxNQUFNLE9BQU87SUFDbEIsTUFBTUMsUUFBUUQsS0FBS0MsS0FBSztJQUN4QixJQUFJQyxNQUFNQyxPQUFPLENBQUNGLFFBQVE7UUFDdEIsT0FBT0EsTUFBTUcsTUFBTTtJQUN2QjtJQUNBLE9BQU9DLE9BQU9MLEtBQUtNLFdBQVcsS0FBSztBQUN2QztBQUVBLE1BQU1DLDRCQUFjZCxvREFBYUEsQ0FBQztBQUUzQixTQUFTZSxhQUFhLEVBQUVDLFFBQVEsRUFBRTtJQUNyQyxNQUFNLENBQUNULE1BQU1VLFFBQVEsR0FBR1osK0NBQVFBLENBQUM7SUFDakMsTUFBTSxDQUFDYSxTQUFTQyxXQUFXLEdBQUdkLCtDQUFRQSxDQUFDO0lBRXZDLE1BQU1lLGNBQWNuQixrREFBV0EsQ0FBQztRQUM1QmtCLFdBQVc7UUFDWCxJQUFJO1lBQ0EsTUFBTUUsSUFBSSxNQUFNQyxNQUFNLGdCQUFnQjtnQkFBRUMsYUFBYTtZQUFVO1lBQy9ELE1BQU1DLE9BQU8sTUFBTUgsRUFBRUksSUFBSTtZQUN6QixJQUFJLENBQUNKLEVBQUVLLEVBQUUsRUFBRTtnQkFDUFQsUUFBUTtnQkFDUjtZQUNKO1lBQ0FBLFFBQVFPO1FBQ1osRUFBRSxPQUFNO1lBQ0pQLFFBQVE7UUFDWixTQUFVO1lBQ05FLFdBQVc7UUFDZjtJQUNKLEdBQUcsRUFBRTtJQUVMLHFGQUFxRixHQUNyRixNQUFNUSxvQkFBb0IxQixrREFBV0EsQ0FBQyxDQUFDdUI7UUFDbkMsSUFDSUEsUUFDQSxPQUFPQSxTQUFTLFlBQ2ZmLENBQUFBLE1BQU1DLE9BQU8sQ0FBQ2MsS0FBS2hCLEtBQUssS0FBS2dCLEtBQUtYLFdBQVcsSUFBSSxJQUFHLEdBQ3ZEO1lBQ0VJLFFBQVFPO1lBQ1JMLFdBQVc7UUFDZjtJQUNKLEdBQUcsRUFBRTtJQUVMaEIsZ0RBQVNBLENBQUM7UUFDTmlCO0lBQ0osR0FBRztRQUFDQTtLQUFZO0lBRWhCLE1BQU1RLFlBQVl4Qiw4Q0FBT0EsQ0FBQyxJQUFNRSxvQkFBb0JDLE9BQU87UUFBQ0E7S0FBSztJQUVqRSxNQUFNc0IsUUFBUTtRQUNWdEI7UUFDQVc7UUFDQUU7UUFDQU87UUFDQUM7SUFDSjtJQUVBLHFCQUNJLDhEQUFDZCxZQUFZZ0IsUUFBUTtRQUFDRCxPQUFPQTtrQkFBUWI7Ozs7OztBQUU3QztBQUVPLFNBQVNlO0lBQ1osTUFBTUMsTUFBTTlCLGlEQUFVQSxDQUFDWTtJQUN2QixJQUFJLENBQUNrQixLQUFLO1FBQ04sTUFBTSxJQUFJQyxNQUFNO0lBQ3BCO0lBQ0EsT0FBT0Q7QUFDWCIsInNvdXJjZXMiOlsid2VicGFjazovL25leHRqcy1ibG9nLy4vY29tcG9uZW50cy9DYXJ0Q29udGV4dC5qcz84MjNmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgY3JlYXRlQ29udGV4dCxcbiAgICB1c2VDYWxsYmFjayxcbiAgICB1c2VDb250ZXh0LFxuICAgIHVzZUVmZmVjdCxcbiAgICB1c2VNZW1vLFxuICAgIHVzZVN0YXRlLFxufSBmcm9tIFwicmVhY3RcIjtcblxuLyoqIE51bWJlciBvZiBkaXN0aW5jdCBsaW5lIGl0ZW1zIChwcm9kdWN0cykgaW4gdGhlIGNhcnQsIG5vdCB0b3RhbCBxdWFudGl0eS4gKi9cbmZ1bmN0aW9uIGxpbmVJdGVtQ291bnRJbkNhcnQoY2FydCkge1xuICAgIGlmICghY2FydCkgcmV0dXJuIDA7XG4gICAgY29uc3QgaXRlbXMgPSBjYXJ0Lml0ZW1zO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW1zKSkge1xuICAgICAgICByZXR1cm4gaXRlbXMubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gTnVtYmVyKGNhcnQuaXRlbXNfY291bnQpIHx8IDA7XG59XG5cbmNvbnN0IENhcnRDb250ZXh0ID0gY3JlYXRlQ29udGV4dChudWxsKTtcblxuZXhwb3J0IGZ1bmN0aW9uIENhcnRQcm92aWRlcih7IGNoaWxkcmVuIH0pIHtcbiAgICBjb25zdCBbY2FydCwgc2V0Q2FydF0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICAgIGNvbnN0IHJlZnJlc2hDYXJ0ID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICBzZXRMb2FkaW5nKHRydWUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKFwiL2FwaS93Yy9jYXJ0XCIsIHsgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiIH0pO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgaWYgKCFyLm9rKSB7XG4gICAgICAgICAgICAgICAgc2V0Q2FydChudWxsKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRDYXJ0KGRhdGEpO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHNldENhcnQobnVsbCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH0sIFtdKTtcblxuICAgIC8qKiBBcHBseSBjYXJ0IEpTT04gZnJvbSBXb28gU3RvcmUgQVBJIChlLmcuIGFkZC1pdGVtIHJlc3BvbnNlKSB3aXRob3V0IGEgcm91bmQgdHJpcCAqL1xuICAgIGNvbnN0IGFwcGx5Q2FydFNuYXBzaG90ID0gdXNlQ2FsbGJhY2soKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZGF0YSAmJlxuICAgICAgICAgICAgdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIChBcnJheS5pc0FycmF5KGRhdGEuaXRlbXMpIHx8IGRhdGEuaXRlbXNfY291bnQgIT0gbnVsbClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBzZXRDYXJ0KGRhdGEpO1xuICAgICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9LCBbXSk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICByZWZyZXNoQ2FydCgpO1xuICAgIH0sIFtyZWZyZXNoQ2FydF0pO1xuXG4gICAgY29uc3QgaXRlbUNvdW50ID0gdXNlTWVtbygoKSA9PiBsaW5lSXRlbUNvdW50SW5DYXJ0KGNhcnQpLCBbY2FydF0pO1xuXG4gICAgY29uc3QgdmFsdWUgPSB7XG4gICAgICAgIGNhcnQsXG4gICAgICAgIGxvYWRpbmcsXG4gICAgICAgIHJlZnJlc2hDYXJ0LFxuICAgICAgICBhcHBseUNhcnRTbmFwc2hvdCxcbiAgICAgICAgaXRlbUNvdW50LFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Q2FydENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfT57Y2hpbGRyZW59PC9DYXJ0Q29udGV4dC5Qcm92aWRlcj5cbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlQ2FydCgpIHtcbiAgICBjb25zdCBjdHggPSB1c2VDb250ZXh0KENhcnRDb250ZXh0KTtcbiAgICBpZiAoIWN0eCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1c2VDYXJ0IG11c3QgYmUgdXNlZCB3aXRoaW4gQ2FydFByb3ZpZGVyXCIpO1xuICAgIH1cbiAgICByZXR1cm4gY3R4O1xufVxuIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDYWxsYmFjayIsInVzZUNvbnRleHQiLCJ1c2VFZmZlY3QiLCJ1c2VNZW1vIiwidXNlU3RhdGUiLCJsaW5lSXRlbUNvdW50SW5DYXJ0IiwiY2FydCIsIml0ZW1zIiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwiTnVtYmVyIiwiaXRlbXNfY291bnQiLCJDYXJ0Q29udGV4dCIsIkNhcnRQcm92aWRlciIsImNoaWxkcmVuIiwic2V0Q2FydCIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwicmVmcmVzaENhcnQiLCJyIiwiZmV0Y2giLCJjcmVkZW50aWFscyIsImRhdGEiLCJqc29uIiwib2siLCJhcHBseUNhcnRTbmFwc2hvdCIsIml0ZW1Db3VudCIsInZhbHVlIiwiUHJvdmlkZXIiLCJ1c2VDYXJ0IiwiY3R4IiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/CartContext.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_main_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/main.css */ \"./styles/main.css\");\n/* harmony import */ var _styles_main_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_main_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_CartContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/CartContext */ \"./components/CartContext.js\");\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_CartContext__WEBPACK_IMPORTED_MODULE_2__.CartProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/home/faizan/Documents/projects/store-transform/git/headless_cms/pages/_app.js\",\n            lineNumber: 7,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/faizan/Documents/projects/store-transform/git/headless_cms/pages/_app.js\",\n        lineNumber: 6,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBMkI7QUFDNkI7QUFFekMsU0FBU0MsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNsRCxxQkFDRSw4REFBQ0gsaUVBQVlBO2tCQUNYLDRFQUFDRTtZQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7O0FBRzlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dGpzLWJsb2cvLi9wYWdlcy9fYXBwLmpzP2UwYWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMvbWFpbi5jc3MnXG5pbXBvcnQgeyBDYXJ0UHJvdmlkZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL0NhcnRDb250ZXh0J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIHJldHVybiAoXG4gICAgPENhcnRQcm92aWRlcj5cbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICA8L0NhcnRQcm92aWRlcj5cbiAgKVxufVxuIl0sIm5hbWVzIjpbIkNhcnRQcm92aWRlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/main.css":
/*!*************************!*\
  !*** ./styles/main.css ***!
  \*************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();