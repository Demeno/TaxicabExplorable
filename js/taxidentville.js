var Taxidentville;
(function (Taxidentville) {
    class Main {
        constructor() {
            this.slides = [
                new Taxidentville.Intro(this),
                new Taxidentville.Slide1(this),
                new Taxidentville.Slide2(this),
                new Taxidentville.Slide3(this),
                new Taxidentville.Slide4(this),
                new Taxidentville.Slide5(this),
                new Taxidentville.Slide6(this),
                new Taxidentville.Credits(this),
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
                slideIndex = hashAsNumber;
            }
            else {
                slideIndex = 0;
            }
            this.navigateToSlideIndex(slideIndex, true);
        }
        isValidSlideNumber(number) {
            return (isNaN(number) || number < 1 || number > this.slides.length);
        }
        initNavButtons(slides) {
            const navButtonsContainer = document.getElementById("slides-navigation");
            // Generate buttons
            this.navButtons = [];
            for (let slideKey in slides) {
                let button = document.createElement("button");
                button.textContent = String(Number(slideKey));
                navButtonsContainer.appendChild(button);
                this.navButtons.push(button);
            }
            // Register click event
            navButtonsContainer.addEventListener("click", (ev) => {
                let clickedElement = ev.target;
                if (!(clickedElement instanceof HTMLButtonElement))
                    return;
                let index = this.navButtons.indexOf(clickedElement);
                this.navigateToSlideIndex(index);
            });
        }
        navigateToNextSlide() {
            this.navigateToSlideIndex(this.currentSlideIndex + 1);
        }
        navigateToSlideIndex(slideIndex, isFirst) {
            if (isFirst) {
                history.replaceState({ slideIndex: slideIndex }, null, `#${slideIndex}`);
            }
            else {
                history.pushState({ slideIndex: slideIndex }, null, `#${slideIndex}`);
            }
            this.gotoSlideIndex(slideIndex);
        }
        gotoSlideIndex(slideIndex) {
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
    Taxidentville.Main = Main;
})(Taxidentville || (Taxidentville = {}));
