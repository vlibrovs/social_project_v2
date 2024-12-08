abstract class Scene {
    private active: boolean;
    constructor() {
        this.active = false;
    }

    public isActive(): boolean { return this.active; }
    public toggle() { this.active = !this.active; }
}

class SelectionScene extends Scene {
    private content: HTMLDivElement;
    private title: HTMLHeadingElement;
    private container: HTMLDivElement;
    private select: HTMLSelectElement;
    private button: HTMLButtonElement;

    private repository: Repository;
    private tests: Test[];

    constructor(repository: Repository) {
        super()
        this.repository = repository;
        this.content = document.querySelector(".content") as HTMLDivElement;
        this.title = document.querySelector(".content.selection > .title") as HTMLHeadingElement;
        this.container = document.querySelector(".content > .container") as HTMLDivElement;
        this.select = document.getElementById("test_selector") as HTMLSelectElement;
        this.button = document.getElementById("test_start") as HTMLButtonElement;

        this.repository.getTests().then((tests) => {
            this.tests = tests;
            this.loadTests();
        });

    }

    private loadTests(): void {
        for (let i = 0; i < this.tests.length; i++) {
            this.select.options.add(new Option(this.tests[i].title, "test" + i.toString()));
        }
    }

    public toggle(): void {
        super.toggle();
        this.content.classList.toggle("hidden");
    }

    public setOnButtonClick(listener: (ev: MouseEvent) => any): void {
        this.button.addEventListener("click", listener);
    }

    public getSelectedTest(): Test {
        return this.tests[this.select.selectedIndex];
    }
}

class QuestionScene extends Scene {
    private content: HTMLDivElement;
    private questionID: HTMLHeadElement;
    private title: HTMLHeadingElement;
    private container: HTMLDivElement;
    private options: HTMLButtonElement[] = [];
    private correct: boolean[] = [];

    public testStats: boolean[] = [];

    private sceneManager: SceneManager;

    constructor() {
        super()
        this.content = document.querySelector(".content.question");
        this.questionID = document.querySelector(".question_id");
        this.title = document.querySelector(".question_title");
        this.container = document.querySelector(".answer_container");
    }

    public setSceneManager(manager: SceneManager) {
        this.sceneManager = manager;
    }

    public displayQuestion(question: Question, last: boolean = false): void {
        this.container.innerHTML = "";
        this.options = [];
        this.correct = [];
        this.questionID.textContent = "Вопрос #" + question.id;
        this.title.textContent = question.text;
        const opt = question.options;
        this.container.dataset.amount = opt.length.toString();
        for (let i = 0; i < opt.length; i++) {
            this.options.push(document.createElement("button") as HTMLButtonElement);
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

    public toggle(): void {
        super.toggle();
        this.content.classList.toggle("hidden");
    }
}

class ResultsScene extends Scene {
    private content: HTMLDivElement;
    private title: HTMLHeadingElement;
    private subtitle: HTMLHeadingElement;
    private container: HTMLDivElement;
    private total: HTMLDivElement;

    constructor() {
        super()
        this.content = document.querySelector(".content.results");
        this.title = document.querySelector(".content.results > .title");
        this.subtitle = document.querySelector(".content.results > .subtitle");
        this.container = document.querySelector(".content.results > .results_container");
        this.total = document.querySelector(".total > .score");
    }

    public loadResults(test: Test, stats: boolean[]): void {
        this.container.innerHTML = "";
        this.subtitle.textContent = test.title;
        const questions = test.questions;
        for (let i = 0; i < questions.length; i++) {
            const res = document.createElement("div");
            res.classList.add("result");

            const name = document.createElement("div");
            name.classList.add("question");
            name.textContent = (i+1).toString() + ". " + questions[i].text;

            const score = document.createElement("div");
            score.classList.add("score");
            if (stats[i]) {
                score.classList.add("correct");
                score.textContent = "1/1";
            }
            else score.textContent = "0/1";

            this.container.appendChild(res);
            res.appendChild(name);
            res.appendChild(score);
        }

        let cnt = 0;
        for (const ans of stats) if (ans) cnt++;
        this.total.textContent = cnt.toString() + "/" + stats.length.toString();
    }

    public toggle(): void {
        super.toggle();
        this.content.classList.toggle("hidden");
    }
}

class AnswerOption {
    public text: string;
    public correct: boolean;
}

class Question {
    public id: number;
    public text: string;
    public options: AnswerOption[];
}

class Test {
    public title: string;
    public questions: Question[];
}

interface Repository {
    getTests(): Promise<Test[]>;
}

class LocalRepository implements Repository {
    async getTests(): Promise<Test[]> {
        const response = await fetch("data/tests.json");
        const data = await response.json();
        return data as Test[];
    }
}

class SceneManager {
    private selection: SelectionScene;
    private question: QuestionScene;
    private results: ResultsScene;
    private testManager: TestManager;

    private switchToQuestionScene(): void {
        this.selection.toggle();
        this.question.toggle();
        const test = this.selection.getSelectedTest();
        this.testManager.startTest(test);
        this.nextQuestion();
    }

    public nextQuestion(): void {
        this.question.displayQuestion(this.testManager.nextQuestion(), this.testManager.end());
    }

    public showResults(): void {
        this.question.toggle();
        this.results.toggle();
        this.results.loadResults(this.testManager.getTest(), this.question.testStats);
    }

    constructor(scenes: Scene[], testManager: TestManager) {
        this.selection = scenes[0] as SelectionScene;
        this.question = scenes[1] as QuestionScene;
        this.results = scenes[2] as ResultsScene;
        this.selection.setOnButtonClick(() => { this.switchToQuestionScene(); });

        this.question.setSceneManager(this);
        this.testManager = testManager;
    }
}

class TestManager {
    private test: Test;
    private questionId: number;
    constructor() {}

    public startTest(test: Test): void {
        this.test = test;
        this.questionId = 0;
    }

    public end(): boolean {
        return this.questionId == this.test.questions.length;
    }

    public nextQuestion(): Question {
        return this.test.questions[this.questionId++];
    }

    public getTest(): Test { return this.test; }
}

function main() {
    const repository: Repository = new LocalRepository();
    const scenes: Scene[] = [
        new SelectionScene(repository),
        new QuestionScene(),
        new ResultsScene()
    ];
    const testManager = new TestManager();
    const sceneManager = new SceneManager(scenes, testManager);
}

main();