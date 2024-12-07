export class TestSelectionScreen {
    button: HTMLButtonElement;
    select: HTMLSelectElement;
    screen: HTMLElement;
    elements: NodeList;
    isActive: boolean;
    
    constructor() {
        this.button = document.getElementById("test_start")! as HTMLButtonElement
        this.select = document.getElementById("test_selector")! as HTMLSelectElement;
        this.screen = document.querySelector(".content.selection")! as HTMLElement;
        this.elements = document.querySelectorAll(".selection > *");
        this.isActive = true;
    }
}

export class QuestionScreen {
    title: HTMLHeadingElement;
    question: HTMLHeadingElement;
    buttonWrapper: HTMLElement;
    buttons: HTMLButtonElement[];

    constructor() {}
}
