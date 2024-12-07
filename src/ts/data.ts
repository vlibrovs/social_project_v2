export class AnswerOption {
    private text: string;
    private correct: boolean;

    constructor(text: string = "", correct: boolean = false) {
        this.text = text;
        this.correct = correct;
    }

    public getText(): string { return this.text; }
    public isCorrect(): boolean { return this.correct; }
}

export class Question {
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

export class Test {
    private title: string;
    private questions: Question[];

    constructor(title: string = "", questions: Question[] = []) {
        this.title = title;
        this.questions = questions;
    }
}