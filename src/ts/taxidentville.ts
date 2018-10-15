namespace Taxidentville {
    export class Main implements SlideManager {        
        slides: Slide[];
        currentSlideIndex: number;
        navButtons: HTMLButtonElement[];

        constructor() {
            this.slides = [
                new Slide1(this),
                new Slide2(this),
                new Slide3(this),
                new Slide4(this),
                new Slide5(this),
                new Slide6(this),
                new Credits(this),
            ];

            this.initNavButtons(this.slides);

            this.currentSlideIndex = -1;
            this.gotoNextSlide();
        }

        initNavButtons(slides: Slide[]): void {
            const navButtonsContainer = document.getElementById("slides-navigation");
            
            // Generate buttons
            this.navButtons = [];            
            for (let slideKey in slides) {
                let button = document.createElement("button");
                button.className = "basic";
                button.textContent = String(Number(slideKey) + 1);

                navButtonsContainer.appendChild(button);
                this.navButtons.push(button);
            }

            // Register click event
            navButtonsContainer.addEventListener("click", (ev) => {
                let clickedElement = ev.target;
                if (!(clickedElement instanceof HTMLButtonElement)) return;

                let index = this.navButtons.indexOf(clickedElement);
                this.gotoSlideIndex(index);
            });
        }

        gotoNextSlide() {
            this.gotoSlideIndex(this.currentSlideIndex + 1);
        }

        gotoSlideIndex(slideIndex: number) {
            let nextSlideAppearanceDelay = 200;
            if (this.currentSlideIndex == slideIndex) {
                // Longer delay in order to reshow the slide only after it was fully hidden
                nextSlideAppearanceDelay = 420;
            }

            if (this.currentSlideIndex >= 0) {
                this.slides[this.currentSlideIndex].leave();
                this.navButtons[this.currentSlideIndex].classList.remove("current");
            }

            setTimeout(() => {
                this.currentSlideIndex = slideIndex;
                this.navButtons[this.currentSlideIndex].classList.add("current");

                if (this.currentSlideIndex < this.slides.length) {
                    this.slides[this.currentSlideIndex].enter();
                }
            }, nextSlideAppearanceDelay);
        }        
    }
}