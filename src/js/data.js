"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = exports.Question = exports.AnswerOption = void 0;
var AnswerOption = /** @class */ (function () {
    function AnswerOption(text, correct) {
        if (text === void 0) { text = ""; }
        if (correct === void 0) { correct = false; }
        this.text = text;
        this.correct = correct;
    }
    AnswerOption.prototype.getText = function () { return this.text; };
    AnswerOption.prototype.isCorrect = function () { return this.correct; };
    return AnswerOption;
}());
exports.AnswerOption = AnswerOption;
var Question = /** @class */ (function () {
    function Question(id, text, options) {
        if (id === void 0) { id = 0; }
        if (text === void 0) { text = ""; }
        if (options === void 0) { options = []; }
        this.id = id;
        this.text = text;
        this.options = options;
    }
    Question.prototype.getId = function () { return this.id; };
    Question.prototype.getText = function () { return this.text; };
    Question.prototype.getOptions = function () { return this.options; };
    return Question;
}());
exports.Question = Question;
var Test = /** @class */ (function () {
    function Test(title, questions) {
        if (title === void 0) { title = ""; }
        if (questions === void 0) { questions = []; }
        this.title = title;
        this.questions = questions;
    }
    return Test;
}());
exports.Test = Test;
