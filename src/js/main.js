var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Scene = /** @class */ (function () {
    function Scene() {
        this.active = false;
    }
    Scene.prototype.isActive = function () { return this.active; };
    Scene.prototype.toggle = function () { this.active = !this.active; };
    return Scene;
}());
var SelectionScene = /** @class */ (function (_super) {
    __extends(SelectionScene, _super);
    function SelectionScene(repository) {
        var _this = _super.call(this) || this;
        _this.repository = repository;
        _this.tests = repository.getTests();
        _this.content = document.querySelector(".content");
        _this.title = document.querySelector(".content.selection > .title");
        _this.container = document.querySelector(".content > .container");
        _this.select = document.getElementById("test_selector");
        _this.button = document.getElementById("test_start");
        _this.loadTests();
        return _this;
    }
    SelectionScene.prototype.loadTests = function () {
        for (var i = 0; i < this.tests.length; i++) {
            this.select.options.add(new Option(this.tests[i].getTitle(), "test" + i.toString()));
        }
    };
    SelectionScene.prototype.toggle = function () {
        _super.prototype.toggle.call(this);
        this.content.classList.toggle("hidden");
    };
    SelectionScene.prototype.setOnButtonClick = function (listener) {
        this.button.addEventListener("click", listener);
    };
    SelectionScene.prototype.getSelectedTest = function () {
        return this.tests[this.select.selectedIndex];
    };
    return SelectionScene;
}(Scene));
var QuestionScene = /** @class */ (function (_super) {
    __extends(QuestionScene, _super);
    function QuestionScene() {
        var _this = _super.call(this) || this;
        _this.options = [];
        _this.correct = [];
        _this.testStats = [];
        _this.content = document.querySelector(".content.question");
        _this.questionID = document.querySelector(".question_id");
        _this.title = document.querySelector(".question_title");
        _this.container = document.querySelector(".answer_container");
        return _this;
    }
    QuestionScene.prototype.setSceneManager = function (manager) {
        this.sceneManager = manager;
    };
    QuestionScene.prototype.displayQuestion = function (question, last) {
        var _this = this;
        if (last === void 0) { last = false; }
        this.container.innerHTML = "";
        this.options = [];
        this.correct = [];
        this.questionID.textContent = "Вопрос #" + question.getId();
        this.title.textContent = question.getText();
        var opt = question.getOptions();
        this.container.dataset.amount = opt.length.toString();
        var _loop_1 = function (i) {
            this_1.options.push(document.createElement("button"));
            this_1.correct.push(opt[i].isCorrect());
            this_1.options[i].classList.add("answer_btn");
            this_1.options[i].textContent = opt[i].getText();
            this_1.container.appendChild(this_1.options[i]);
            if (!last) {
                this_1.options[i].addEventListener("click", function () {
                    _this.testStats.push(_this.correct[i]);
                    _this.sceneManager.nextQuestion();
                });
            }
            else {
                this_1.options[i].addEventListener("click", function () {
                    _this.testStats.push(_this.correct[i]);
                    _this.sceneManager.showResults();
                });
            }
        };
        var this_1 = this;
        for (var i = 0; i < opt.length; i++) {
            _loop_1(i);
        }
    };
    QuestionScene.prototype.toggle = function () {
        _super.prototype.toggle.call(this);
        this.content.classList.toggle("hidden");
    };
    return QuestionScene;
}(Scene));
var ResultsScene = /** @class */ (function (_super) {
    __extends(ResultsScene, _super);
    function ResultsScene() {
        var _this = _super.call(this) || this;
        _this.content = document.querySelector(".content.results");
        _this.title = document.querySelector(".content.results > .title");
        _this.subtitle = document.querySelector(".content.results > .subtitle");
        _this.container = document.querySelector(".content.results > .results_container");
        _this.total = document.querySelector(".total > .score");
        return _this;
    }
    ResultsScene.prototype.loadResults = function (test, stats) {
        this.container.innerHTML = "";
        this.subtitle.textContent = test.getTitle();
        var questions = test.getQuestions();
        for (var i = 0; i < questions.length; i++) {
            var res = document.createElement("div");
            res.classList.add("result");
            var name_1 = document.createElement("div");
            name_1.classList.add("question");
            name_1.textContent = (i + 1).toString() + ". " + questions[i].getText();
            var score = document.createElement("div");
            score.classList.add("score");
            if (stats[i]) {
                score.classList.add("correct");
                score.textContent = "1/1";
            }
            else
                score.textContent = "0/1";
            this.container.appendChild(res);
            res.appendChild(name_1);
            res.appendChild(score);
        }
        var cnt = 0;
        for (var _i = 0, stats_1 = stats; _i < stats_1.length; _i++) {
            var ans = stats_1[_i];
            if (ans)
                cnt++;
        }
        this.total.textContent = cnt.toString() + "/" + stats.length.toString();
    };
    ResultsScene.prototype.toggle = function () {
        _super.prototype.toggle.call(this);
        this.content.classList.toggle("hidden");
    };
    return ResultsScene;
}(Scene));
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
var Test = /** @class */ (function () {
    function Test(title, questions) {
        if (title === void 0) { title = ""; }
        if (questions === void 0) { questions = []; }
        this.title = title;
        this.questions = questions;
    }
    Test.prototype.getTitle = function () { return this.title; };
    Test.prototype.getQuestions = function () { return this.questions; };
    Test.prototype.getLength = function () { return this.questions.length; };
    return Test;
}());
var LocalRepository = /** @class */ (function () {
    function LocalRepository() {
        this.tests = [
            new Test("Да или нет?", [
                new Question(1, "Да?", [
                    new AnswerOption("Да", true),
                    new AnswerOption("Нет", false)
                ]),
                new Question(2, "Нет?", [
                    new AnswerOption("Да", false),
                    new AnswerOption("Нет", true)
                ]),
            ])
        ];
    }
    LocalRepository.prototype.getTests = function () {
        return this.tests;
    };
    return LocalRepository;
}());
var SceneManager = /** @class */ (function () {
    function SceneManager(scenes, testManager) {
        var _this = this;
        this.selection = scenes[0];
        this.question = scenes[1];
        this.results = scenes[2];
        this.selection.setOnButtonClick(function () { _this.switchToQuestionScene(); });
        this.question.setSceneManager(this);
        this.testManager = testManager;
    }
    SceneManager.prototype.switchToQuestionScene = function () {
        this.selection.toggle();
        this.question.toggle();
        var test = this.selection.getSelectedTest();
        this.testManager.startTest(test);
        this.nextQuestion();
    };
    SceneManager.prototype.nextQuestion = function () {
        this.question.displayQuestion(this.testManager.nextQuestion(), this.testManager.end());
    };
    SceneManager.prototype.showResults = function () {
        this.question.toggle();
        this.results.toggle();
        this.results.loadResults(this.testManager.getTest(), this.question.testStats);
    };
    return SceneManager;
}());
var TestManager = /** @class */ (function () {
    function TestManager() {
    }
    TestManager.prototype.startTest = function (test) {
        this.test = test;
        this.questionId = 0;
    };
    TestManager.prototype.end = function () {
        return this.questionId == this.test.getLength();
    };
    TestManager.prototype.nextQuestion = function () {
        return this.test.getQuestions()[this.questionId++];
    };
    TestManager.prototype.getTest = function () { return this.test; };
    return TestManager;
}());
function main() {
    var repository = new LocalRepository();
    var scenes = [
        new SelectionScene(repository),
        new QuestionScene(),
        new ResultsScene()
    ];
    var testManager = new TestManager();
    var sceneManager = new SceneManager(scenes, testManager);
}
main();
