var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Scene {
    constructor() {
        this.active = false;
    }
    isActive() { return this.active; }
    toggle() { this.active = !this.active; }
}
class SelectionScene extends Scene {
    constructor(repository) {
        super();
        this.repository = repository;
        this.content = document.querySelector(".content");
        this.title = document.querySelector(".content.selection > .title");
        this.container = document.querySelector(".content > .container");
        this.select = document.getElementById("test_selector");
        this.button = document.getElementById("test_start");
        this.repository.getTests().then((tests) => {
            this.tests = tests;
            this.loadTests();
        });
    }
    loadTests() {
        for (let i = 0; i < this.tests.length; i++) {
            this.select.options.add(new Option(this.tests[i].title, "test" + i.toString()));
        }
    }
    toggle() {
        super.toggle();
        this.content.classList.toggle("hidden");
    }
    setOnButtonClick(listener) {
        this.button.addEventListener("click", listener);
    }
    getSelectedTest() {
        return this.tests[this.select.selectedIndex];
    }
}
class QuestionScene extends Scene {
    constructor() {
        super();
        this.options = [];
        this.correct = [];
        this.testStats = [];
        this.content = document.querySelector(".content.question");
        this.questionID = document.querySelector(".question_id");
        this.title = document.querySelector(".question_title");
        this.container = document.querySelector(".answer_container");
    }
    setSceneManager(manager) {
        this.sceneManager = manager;
    }
    displayQuestion(question, last = false) {
        this.container.innerHTML = "";
        this.options = [];
        this.correct = [];
        this.questionID.textContent = "Вопрос #" + question.id;
        this.title.textContent = question.text;
        const opt = question.options;
        this.container.dataset.amount = opt.length.toString();
        for (let i = 0; i < opt.length; i++) {
            this.options.push(document.createElement("button"));
            this.correct.push(opt[i].correct);
            this.options[i].classList.add("answer_btn");
            this.options[i].textContent = opt[i].text;
            this.container.appendChild(this.options[i]);
            if (!last) {
                this.options[i].addEventListener("click", () => {
                    this.testStats.push(this.correct[i]);
                    this.sceneManager.nextQuestion();
                });
            }
            else {
                this.options[i].addEventListener("click", () => {
                    this.testStats.push(this.correct[i]);
                    this.sceneManager.showResults();
                });
            }
        }
    }
    toggle() {
        super.toggle();
        this.content.classList.toggle("hidden");
    }
}
class ResultsScene extends Scene {
    constructor() {
        super();
        this.content = document.querySelector(".content.results");
        this.title = document.querySelector(".content.results > .title");
        this.subtitle = document.querySelector(".content.results > .subtitle");
        this.container = document.querySelector(".content.results > .results_container");
        this.total = document.querySelector(".total > .score");
    }
    loadResults(test, stats) {
        this.container.innerHTML = "";
        this.subtitle.textContent = test.title;
        const questions = test.questions;
        for (let i = 0; i < questions.length; i++) {
            const res = document.createElement("div");
            res.classList.add("result");
            const name = document.createElement("div");
            name.classList.add("question");
            name.textContent = (i + 1).toString() + ". " + questions[i].text;
            const score = document.createElement("div");
            score.classList.add("score");
            if (stats[i]) {
                score.classList.add("correct");
                score.textContent = "1/1";
            }
            else
                score.textContent = "0/1";
            this.container.appendChild(res);
            res.appendChild(name);
            res.appendChild(score);
        }
        let cnt = 0;
        for (const ans of stats)
            if (ans)
                cnt++;
        this.total.textContent = cnt.toString() + "/" + stats.length.toString();
    }
    toggle() {
        super.toggle();
        this.content.classList.toggle("hidden");
    }
}
class AnswerOption {
}
class Question {
}
class Test {
}
class LocalRepository {
    getTests() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("data/tests.json");
            const data = yield response.json();
            return data;
        });
    }
}
class SceneManager {
    switchToQuestionScene() {
        this.selection.toggle();
        this.question.toggle();
        const test = this.selection.getSelectedTest();
        this.testManager.startTest(test);
        this.nextQuestion();
    }
    nextQuestion() {
        this.question.displayQuestion(this.testManager.nextQuestion(), this.testManager.end());
    }
    showResults() {
        this.question.toggle();
        this.results.toggle();
        this.results.loadResults(this.testManager.getTest(), this.question.testStats);
    }
    constructor(scenes, testManager) {
        this.selection = scenes[0];
        this.question = scenes[1];
        this.results = scenes[2];
        this.selection.setOnButtonClick(() => { this.switchToQuestionScene(); });
        this.question.setSceneManager(this);
        this.testManager = testManager;
    }
}
class TestManager {
    constructor() { }
    startTest(test) {
        this.test = test;
        this.questionId = 0;
    }
    end() {
        return this.questionId == this.test.questions.length;
    }
    nextQuestion() {
        return this.test.questions[this.questionId++];
    }
    getTest() { return this.test; }
}
function main() {
    const repository = new LocalRepository();
    const scenes = [
        new SelectionScene(repository),
        new QuestionScene(),
        new ResultsScene()
    ];
    const testManager = new TestManager();
    const sceneManager = new SceneManager(scenes, testManager);
}
main();
