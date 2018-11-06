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

            window.onhashchange = () => { 
                this.navigateToSlideByHashOrDefault();
            };

            this.initNavButtons(this.slides);
            this.currentSlideIndex = -1;
            this.navigateToSlideByHashOrDefault();
        }

        navigateToSlideByHashOrDefault() {
            let slideIndex;
            let hash = window.location.hash.substr(1);
            let hashAsNumber = Number(hash);
            if (hashAsNumber && !this.isValidSlideNumber(hashAsNumber)) {
                slideIndex = hashAsNumber - 1;
            }
            else {
                slideIndex = 0;
            }

            this.navigateToSlideIndex(slideIndex, true);
        }

        isValidSlideNumber(number) {
            return (isNaN(number) || number < 1 || number > this.slides.length);
        }

        initNavButtons(slides: Slide[]): void {
            const navButtonsContainer = document.getElementById("slides-navigation");
            
            // Generate buttons
            this.navButtons = [];            
            for (let slideKey in slides) {
                let button = document.createElement("button");
                button.textContent = String(Number(slideKey) + 1);

                navButtonsContainer.appendChild(button);
                this.navButtons.push(button);
            }

            // Register click event
            navButtonsContainer.addEventListener("click", (ev) => {
                let clickedElement = ev.target;
                if (!(clickedElement instanceof HTMLButtonElement)) return;

                let index = this.navButtons.indexOf(clickedElement);
                this.navigateToSlideIndex(index);
            });
        }

        navigateToNextSlide() {
            this.navigateToSlideIndex(this.currentSlideIndex + 1);
        }

        navigateToSlideIndex(slideIndex: number, isFirst?: boolean) {
            if (isFirst) {
                history.replaceState({ slideIndex: slideIndex }, null, `#${slideIndex + 1}`);
            } else {
                history.pushState({ slideIndex: slideIndex }, null, `#${slideIndex + 1}`);
            }

            this.gotoSlideIndex(slideIndex);
        }

        gotoSlideIndex(slideIndex: number) {
            // console.log("goto: " + slideIndex);
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