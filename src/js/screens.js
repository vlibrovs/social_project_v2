"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionScreen = exports.TestSelectionScreen = void 0;
var TestSelectionScreen = /** @class */ (function () {
    function TestSelectionScreen() {
        this.button = document.getElementById("test_start");
        this.select = document.getElementById("test_selector");
        this.screen = document.querySelector(".content.selection");
        this.elements = document.querySelectorAll(".selection > *");
        this.isActive = true;
    }
    return TestSelectionScreen;
}());
exports.TestSelectionScreen = TestSelectionScreen;
var QuestionScreen = /** @class */ (function () {
    function QuestionScreen() {
    }
    return QuestionScreen;
}());
exports.QuestionScreen = QuestionScreen;
