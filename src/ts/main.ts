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
        this.tests = repository.getTests();
        this.content = document.querySelector(".content") as HTMLDivElement;
        this.title = document.querySelector(".content.selection > .title") as HTMLHeadingElement;
        this.container = document.querySelector(".content > .container") as HTMLDivElement;
        this.select = document.getElementById("test_selector") as HTMLSelectElement;
        this.button = document.getElementById("test_start") as HTMLButtonElement;

        this.loadTests();
    }

    private loadTests(): void {
        for (let i = 0; i < this.tests.length; i++) {
            this.select.options.add(new Option(this.tests[i].getTitle(), "test" + i.toString()));
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
        this.questionID.textContent = "Вопрос #" + question.getId();
        this.title.textContent = question.getText();
        const opt = question.getOptions();
        this.container.dataset.amount = opt.length.toString();
        for (let i = 0; i < opt.length; i++) {
            this.options.push(document.createElement("button") as HTMLButtonElement);
            this.correct.push(opt[i].isCorrect());
            this.options[i].classList.add("answer_btn");
            this.options[i].textContent = opt[i].getText();
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
        this.subtitle.textContent = test.getTitle();
        const questions = test.getQuestions();
        for (let i = 0; i < questions.length; i++) {
            const res = document.createElement("div");
            res.classList.add("result");

            const name = document.createElement("div");
            name.classList.add("question");
            name.textContent = (i+1).toString() + ". " + questions[i].getText();

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
    private text: string;
    private correct: boolean;

    constructor(text: string = "", correct: boolean = false) {
        this.text = text;
        this.correct = correct;
    }

    public getText(): string { return this.text; }
    public isCorrect(): boolean { return this.correct; }
}

class Question {
    private id: number;
    private text: string;
    private options: AnswerOption[];

    constructor(id: number = 0, text: string = "", options: AnswerOption[] = []) {
        this.id = id;
        this.text = text;
        this.options = options;
    }

    public getId(): number { return this.id; }
    public getText(): string { return this.text; }
    public getOptions(): AnswerOption[] { return this.options; }
}

class Test {
    private title: string;
    private questions: Question[];

    constructor(title: string = "", questions: Question[] = []) {
        this.title = title;
        this.questions = questions;
    }

    public getTitle(): string { return this.title; }
    public getQuestions(): Question[] { return this.questions; }
    public getLength(): number { return this.questions.length; }
}

interface Repository {
    getTests(): Test[];
}

class LocalRepository implements Repository {
    private tests: Test[];
    constructor() {
        this.tests = [
            new Test("Да или нет?",
                [
                    new Question(1, "Да?", [
                        new AnswerOption("Да", true),
                        new AnswerOption("Нет", false)
                    ]),
                    new Question(2, "Нет?", [
                        new AnswerOption("Да", false),
                        new AnswerOption("Нет", true)
                    ]),
                ]
            )
        ];
    }
    getTests(): Test[] {
        return this.tests;
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
        return this.questionId == this.test.getLength();
    }

    public nextQuestion(): Question {
        return this.test.getQuestions()[this.questionId++];
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