namespace Taxidentville {
    export class Main implements SlideManager {        
        slides:Slide[];
        currentSlideIndex:number;

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
}