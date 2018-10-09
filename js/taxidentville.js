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
            this.currentSlideIndex = -1;
            // this.currentSlideIndex = 2;
            this.gotoNextSlide();
        }
        gotoNextSlide() {
            if (this.currentSlideIndex >= 0) {
                this.slides[this.currentSlideIndex].leave();
            }
            setTimeout(() => {
                this.currentSlideIndex++;
                if (this.currentSlideIndex < this.slides.length) {
                    this.slides[this.currentSlideIndex].enter();
                }
            }, 200);
        }
    }
    Taxidentville.Main = Main;
})(Taxidentville || (Taxidentville = {}));
