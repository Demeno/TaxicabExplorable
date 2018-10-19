var Taxidentville;
(function (Taxidentville) {
    class Main {
        constructor() {
            this.slides = [
                new Taxidentville.Slide1(this),
                new Taxidentville.Slide2(this),
                new Taxidentville.Slide3(this),
                new Taxidentville.Slide4(this),
                new Taxidentville.Slide5(this),
                new Taxidentville.Slide6(this),
                new Taxidentville.Credits(this),
            ];
            this.initNavButtons(this.slides);
            this.currentSlideIndex = -1;
            this.gotoNextSlide();
        }
        initNavButtons(slides) {
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
                if (!(clickedElement instanceof HTMLButtonElement))
                    return;
                let index = this.navButtons.indexOf(clickedElement);
                this.gotoSlideIndex(index);
            });
        }
        gotoNextSlide() {
            this.gotoSlideIndex(this.currentSlideIndex + 1);
        }
        gotoSlideIndex(slideIndex) {
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
    Taxidentville.Main = Main;
})(Taxidentville || (Taxidentville = {}));
