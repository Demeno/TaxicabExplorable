namespace Taxidentville {
    export interface SlideManager {
        gotoNextSlide();
    }

    export abstract class Slide {
        abstract enter();
        abstract leave();

        slideManager:SlideManager;
        slide:HTMLElement;

        constructor(slideId: string, slideManager: SlideManager) {
            this.slide = document.getElementById(slideId);
            this.slideManager = slideManager;
        }

        show() {                        
            this.slide.classList.remove("collapsed");
            setTimeout(() => {
                this.slide.classList.add("active");
            }, 10);
        };
        hide() {
            this.slide.classList.remove("active");            
        }
        collapse() {
            this.slide.classList.add("collapsed");
        }
        
        finishSlide() {
            this.slideManager.gotoNextSlide();
        }
    }

    export class Slide1 extends Slide {        
        percentButtons: HTMLElement;
        continueButton: HTMLButtonElement;
        slide1Text1: HTMLElement;        
        slide1Text2: HTMLElement;
        slide1Text2DynamicParagaraph: HTMLParagraphElement;

        constructor(slideManager: SlideManager) {
            super("slide1", slideManager);

            this.percentButtons = document.getElementById("percent-buttons");
            this.continueButton = <HTMLButtonElement>document.getElementById("slide1-continue-button");
            this.slide1Text1 = document.getElementById("slide1-text1");
            this.slide1Text2 = document.getElementById("slide1-text2");
            this.slide1Text2DynamicParagaraph = <HTMLParagraphElement>document.getElementById("slide1Text2DynamicParagaraph");
            
            this.percentButtons.addEventListener("click", (ev) => {
                if (ev.target instanceof HTMLButtonElement) {
                    let selectedPercent = Number(ev.target.innerText.substring(0,ev.target.innerText.length - 1));
                    this.goToState2(selectedPercent);
                }
            });
            
            this.continueButton.addEventListener("click", (ev) => {
                this.finishSlide();
            });
        }

        goToState1() {
            this.percentButtons.classList.remove("collapsed");
            this.continueButton.classList.add("collapsed");
            this.slide1Text1.classList.remove("collapsed");
            this.slide1Text2.classList.add("collapsed");
        }
        
        goToState2(selectedPercent: number) {
            this.updateDynamicParagraph(selectedPercent);

            this.percentButtons.classList.add("collapsed");
            this.continueButton.classList.remove("collapsed");
            this.slide1Text1.classList.add("collapsed");
            this.slide1Text2.classList.remove("collapsed");
        }

        updateDynamicParagraph(selectedPercent: number) {
            let text:string = `${selectedPercent}% - `;
            if (selectedPercent == 30) {
                text += `Wow, you actually got it. Are you already a master of bayesian inference or just a very good guesser? anyways, I hope you’ll still stick around for some interactive fun. :)`;
            } else if (selectedPercent == 80) {
                text += `Congratulations, like most people, including me, you’ve been fooled by your intuitions to get this completely wrong. Even though it doesn’t feels like it, what the witness saw is only a part of the picture.`;
            } else if (selectedPercent == 10) {
                text += `Yeah, no. The amount of blue cabs are only a part of the picture.`;
            } else {
                text += `Well, that isn’t it. But no worries, I didn’t expect anyone to actually get it right from the get go.`;
            }

            this.slide1Text2DynamicParagaraph.innerText = text;
        }

        enter() {            
            super.show();
        };
        leave() {
            super.hide();
            setTimeout(() => {
                super.collapse();
                this.goToState1();
            }, 400 + 10);
        }
    }    

    export class Slide2 extends Slide {        
        continueButton:HTMLButtonElement;
        cabSliderController:CabSliderController;

        constructor(slideManager: SlideManager) {
            super("slide2", slideManager);

            this.continueButton = <HTMLButtonElement>document.getElementById("slide2-continue-button");
            this.continueButton.addEventListener("click", (ev) => {
                this.finishSlide();
            });
        }

        enter() {
            this.cabSliderController = new CabSliderController("slide2-cabs-slider", 1, (newValue) => {
                if (newValue == 6) {
                    document.getElementById("slide2-bottom-part").classList.remove("collapsed");
                } else {
                    document.getElementById("slide2-bottom-part").classList.add("collapsed");
                }
            });

            super.show();
        }    
        leave() {            
            super.hide();
            setTimeout(() => {
                super.collapse();
                this.cabSliderController.dispose();
                this.cabSliderController = null;
                document.getElementById("slide2-bottom-part").classList.add("collapsed");
            }, 400 + 10);
        }    
    }

    export class Slide3 extends Slide {        
        cabSliderController: CabSliderController;
        mapController: MapController;

        simulatedAccidentsCount: number;
        simulatedBlueAccidentsCount: number;

        constructor(slideManager: SlideManager) {
            super("slide3", slideManager);

            const shuffleAccidentButton = <HTMLButtonElement>document.getElementById("slide3-shuffle-accident-button");
            const placeAccidentButton = <HTMLButtonElement>document.getElementById("slide3-place-accident-button");
            shuffleAccidentButton.addEventListener("click", (ev) => {
                this.mapController.startRandomizingAccident();
                shuffleAccidentButton.classList.add("disabled");
                placeAccidentButton.classList.remove("disabled");
            });
            placeAccidentButton.addEventListener("click", (ev) => {
                this.mapController.stopRandomizingAccident();
                document.getElementById("slide3-phase1").classList.add("collapsed");
                document.getElementById("slide3-phase2").classList.remove("collapsed");
            });

            const shuffleCabsButton = <HTMLButtonElement>document.getElementById("slide3-shuffle-cabs-button");
            const placeCabsButton = <HTMLButtonElement>document.getElementById("slide3-place-cabs-button");
            shuffleCabsButton.addEventListener("click", (ev) => {
                this.mapController.initCabs(this.cabSliderController.value);
                this.mapController.startRandomizingCabPositions();
                shuffleCabsButton.classList.add("disabled");
                placeCabsButton.classList.remove("disabled");
            });
            placeCabsButton.addEventListener("click", (ev) => {
                this.mapController.finishRandomizingCabPositions();
                document.getElementById("slide3-phase2").classList.add("collapsed");
                document.getElementById("slide3-phase3").classList.remove("collapsed");
            });

            const hundredTimesButton = document.getElementById("slide3-100-times-button");
            hundredTimesButton.addEventListener("click", () => {                
                hundredTimesButton.classList.add("disabled");
                this.cabSliderController.setIsDisabled(true);
                document.getElementById("slide3-phase3-content_a").classList.add("collapsed");
                this.mapController.onQueueDone = () => {
                    hundredTimesButton.classList.remove("disabled");
                    this.cabSliderController.setIsDisabled(false);
                    document.getElementById("slide3-phase3-content_b").classList.remove("collapsed");
                    document.getElementById("slide3-phase3-button_a").classList.add("collapsed");
                    document.getElementById("slide3-phase3-button_b").classList.remove("collapsed");
                };

                this.clearAccidentStats();
                this.simulate100(0.15);
            });

            document.getElementById("slide3-phase3-sandbox-run-sim-button").addEventListener("click", () => {
                this.mapController.enqueueSimulation(1);
            });
            document.getElementById("slide3-phase3-sandbox-100-times-button").addEventListener("click", () => {
                this.simulate100(0.3);
            });
            document.getElementById("slide3-phase3-sandbox-reset-stats-button").addEventListener("click", () => {
                this.clearAccidentStats();
                document.getElementById("slide3-phase3-report-cabs-percent").innerText = `${(this.cabSliderController.value / 10.0) * 100}%`;
                document.getElementById("slide3-phase3-report-cabs-accidents").innerText = "?";
            });

            document.getElementById("slide3-continue-button").addEventListener("click", () => {
                this.finishSlide();
            });
        }

        simulate100(acceleration: number) {
            for (let i = 0; i < 100; i++) {
                this.mapController.enqueueSimulation(1 + i * acceleration);
            }
        }

        clearAccidentStats() {
            this.simulatedAccidentsCount = 0;
            this.simulatedBlueAccidentsCount = 0;
        }

        onAccident(wasAccidentBlue) {
            this.simulatedAccidentsCount++;
            if (wasAccidentBlue) {
                this.simulatedBlueAccidentsCount++;
            }

            const cabColorSpanElement = document.getElementById("slide3-phase3-cab-color");
            if (!cabColorSpanElement.innerText) {
                cabColorSpanElement.innerText = wasAccidentBlue ? "blue" : "green";
            }

            document.getElementById("slide3-phase3-report-cabs-percent").innerText =
                `${(this.cabSliderController.value / 10.0) * 100}%`;
            
            let bluePercent = (this.simulatedBlueAccidentsCount / this.simulatedAccidentsCount) * 100;
            bluePercent = Math.round(bluePercent * 100) / 100;
            document.getElementById("slide3-phase3-report-cabs-accidents").innerText =
                `${this.simulatedBlueAccidentsCount}/${this.simulatedAccidentsCount} = ${bluePercent}%`;
        }

        enter() {
            this.clearAccidentStats();

            this.cabSliderController = new CabSliderController("slide3-cabs-slider", 6, (newValue) => {
                this.mapController.setCabColorsByValue(newValue);
            });
            this.mapController = new MapController("taxidentville-graphics-container", (wasAccidentBlue) => this.onAccident(wasAccidentBlue));

            super.show();
        }    
        leave() {            
            super.hide();
            setTimeout(() => {
                super.collapse();
                this.cabSliderController.dispose();
                this.cabSliderController = null;
                this.mapController.reset();
                this.mapController = null;

                // reset possible HTML changes to starting state
                const shuffleAccidentButton = <HTMLButtonElement>document.getElementById("slide3-shuffle-accident-button");
                const placeAccidentButton = <HTMLButtonElement>document.getElementById("slide3-place-accident-button");
                shuffleAccidentButton.classList.remove("disabled");
                placeAccidentButton.classList.add("disabled");
                document.getElementById("slide3-phase1").classList.remove("collapsed");
                document.getElementById("slide3-phase2").classList.add("collapsed");
                const shuffleCabsButton = <HTMLButtonElement>document.getElementById("slide3-shuffle-cabs-button");
                const placeCabsButton = <HTMLButtonElement>document.getElementById("slide3-place-cabs-button");
                shuffleCabsButton.classList.remove("disabled");
                placeCabsButton.classList.add("disabled");
                document.getElementById("slide3-phase3").classList.add("collapsed");
                const hundredTimesButton = document.getElementById("slide3-100-times-button");
                hundredTimesButton.classList.remove("disabled");
                document.getElementById("slide3-phase3-content_a").classList.remove("collapsed");
                document.getElementById("slide3-phase3-content_b").classList.add("collapsed");
                document.getElementById("slide3-phase3-button_a").classList.remove("collapsed");
                document.getElementById("slide3-phase3-button_b").classList.add("collapsed");
                const cabColorSpanElement = document.getElementById("slide3-phase3-cab-color");
                cabColorSpanElement.innerText = "";
            }, 400 + 10);
        }    
    }

    export class Slide4 extends Slide {        
        cabSliderController: CabSliderController;
        witnessSliderController: WitnessSliderController;

        constructor(slideManager: SlideManager) {
            super("slide4", slideManager);            

            document.getElementById("slide4-continue-button").addEventListener("click", () => {
                this.finishSlide();
            });
        }

        enter() {            
            this.cabSliderController = new CabSliderController("slide4-cabs-slider", 0, null);
            this.cabSliderController.setIsDisabled(true);

            this.witnessSliderController = new WitnessSliderController("slide4-witness-slider", 6, null);
            this.witnessSliderController.setIsDisabled(true);
            
            super.show();
        }    
        leave() {            
            super.hide();
            setTimeout(() => {
                super.collapse();
                this.cabSliderController.dispose();
                this.cabSliderController = null;

                this.witnessSliderController.dispose();
                this.witnessSliderController = null;
            }, 400 + 10);
        }    
    }

    export class Slide5 extends Slide {        
        cabSliderController: CabSliderController;
        witnessSliderController: WitnessSliderController;
        witnessCabsController: WitnessCabsController;

        currentPhase: number;

        constructor(slideManager: SlideManager) {
            super("slide5", slideManager);            

            document.getElementById("slide5-phase3-continue-button").addEventListener("click", () => {
                document.getElementById("slide5-phase3").classList.add("collapsed");
                document.getElementById("slide5-phase4").classList.remove("collapsed");
            });
            document.getElementById("slide5-continue-button").addEventListener("click", () => {
                this.finishSlide();
            });
        }

        onSlidersChanged() {            
            this.witnessCabsController.setState(this.cabSliderController.value, this.witnessSliderController.value);

            if (this.currentPhase == 1 && this.cabSliderController.value == 5) {
                this.currentPhase++;
                document.getElementById("slide5-phase1").classList.add("collapsed");
                document.getElementById("slide5-phase2").classList.remove("collapsed");
            } else if (this.currentPhase == 2 && this.cabSliderController.value == 1 && this.witnessSliderController.value == 8) {
                this.currentPhase++;
                document.getElementById("slide5-phase2").classList.add("collapsed");
                document.getElementById("slide5-phase3").classList.remove("collapsed");
            }
        }

        enter() {      
            this.currentPhase = 1;
            const startCabs = 0;
            const startRight = 6;
            this.cabSliderController = new CabSliderController("slide5-cabs-slider", startCabs, () => this.onSlidersChanged());
            this.witnessSliderController = new WitnessSliderController("slide5-witness-slider", startRight, () => this.onSlidersChanged());
            this.witnessCabsController = new WitnessCabsController("slide5-witness-cabs", startCabs, startRight);
            
            super.show();
        }    
        leave() {            
            super.hide();
            setTimeout(() => {
                super.collapse();
                this.cabSliderController.dispose();
                this.cabSliderController = null;

                this.witnessSliderController.dispose();
                this.witnessSliderController = null;
            }, 400 + 10);
        }    
    }
    
    export class Slide6 extends Slide {        
        cabSliderController: CabSliderController;
        witnessSliderController: WitnessSliderController;
        mapController: MapController;
        
        simulatedAccidentsCount: number;
        simulatedAccidentsWhereWitnessSawBlue: number;
        simulatedAccidentsWhereWitnessSawBlueAndWasCorrect: number;

        constructor(slideManager: SlideManager) {
            super("slide6", slideManager);            

            document.getElementById("slide6-sandbox-run-sim-button").addEventListener("click", () => {
                this.mapController.enqueueSimulation(1);
            });
            document.getElementById("slide6-sandbox-100-times-button").addEventListener("click", () => {
                this.simulate100(1);
            });
            document.getElementById("slide6-sandbox-reset-stats-button").addEventListener("click", () => {
                this.clearAccidentStats();
            });

            document.getElementById("slide6-continue-button").addEventListener("click", () => {
                this.finishSlide();
            });
        }

        simulate100(acceleration: number) {
            for (let i = 0; i < 100; i++) {
                this.mapController.enqueueSimulation(1 + i * acceleration);
            }

            setTimeout(() => {
                document.getElementById("slide6-continue-button").classList.remove("collapsed");
            }, 3000);
        }

        clearAccidentStats() {
            this.simulatedAccidentsCount = 0;
            this.simulatedAccidentsWhereWitnessSawBlue = 0;
            this.simulatedAccidentsWhereWitnessSawBlueAndWasCorrect = 0;
            document.getElementById("slide6-report-witness-said-blue").innerHTML = "0 / 0";
            document.getElementById("slide6-report-actual-result").innerText = "0 / 0";
        }

        onSlidersChanged() {
            this.mapController.setCabColorsByValue(this.cabSliderController.value);

            let blueCabsFraction = this.cabSliderController.value / 10.0;
            let witnessAccuracyFraction = this.witnessSliderController.value / 10.0;

            document.getElementById("slide6-report-cabs-percent").innerText = 
                `${blueCabsFraction * 100}%`;

            document.getElementById("slide6-report-witness-accuracy").innerText = 
                `${witnessAccuracyFraction * 100}%`;

            let ourGuess;
            let blueCabsSeenBlue = (blueCabsFraction * witnessAccuracyFraction);
            let greenCabsSeenBlue = (1 - witnessAccuracyFraction) * (1 - blueCabsFraction);
            if (blueCabsSeenBlue + greenCabsSeenBlue != 0) {
                ourGuess = blueCabsSeenBlue / (blueCabsSeenBlue + greenCabsSeenBlue);
                ourGuess *= 100;
                ourGuess = Math.round(ourGuess * 100.0) / 100.0;
                document.getElementById("slide6-report-our-guess").innerText = `${ourGuess}%`;
            } else {
                document.getElementById("slide6-report-our-guess").innerText = "Witness will never say blue";
            }
        }

        onAccident(wasAccidentBlue: boolean) {  
            this.simulatedAccidentsCount++;

            let witnessAccuracyFraction = this.witnessSliderController.value / 10.0;      
            let wasWitnessCorrect = (Math.random() < witnessAccuracyFraction);

            if (wasAccidentBlue) {
                if (wasWitnessCorrect) {
                    this.simulatedAccidentsWhereWitnessSawBlue++;
                    this.simulatedAccidentsWhereWitnessSawBlueAndWasCorrect++;
                }
            } else {
                if (!wasWitnessCorrect) {
                    this.simulatedAccidentsWhereWitnessSawBlue++;
                }
            }
            
            document.getElementById("slide6-report-witness-said-blue").innerText =
                `${this.simulatedAccidentsWhereWitnessSawBlue} / ${this.simulatedAccidentsCount}`;
            
            if (this.simulatedAccidentsWhereWitnessSawBlue != 0) {
                let correctBluePercent = (this.simulatedAccidentsWhereWitnessSawBlueAndWasCorrect / this.simulatedAccidentsWhereWitnessSawBlue) * 100;
                correctBluePercent = Math.round(correctBluePercent * 100) / 100;

                document.getElementById("slide6-report-actual-result").innerText =
                    `${this.simulatedAccidentsWhereWitnessSawBlueAndWasCorrect} / ${this.simulatedAccidentsWhereWitnessSawBlue} = ${correctBluePercent}%`;
            } else {
                document.getElementById("slide6-report-actual-result").innerText = "0 / 0";
            }
        }

        enter() {            
            this.clearAccidentStats();
            const startCabSliderValue = 1;
            this.cabSliderController = new CabSliderController("slide6-cabs-slider", startCabSliderValue, () => this.onSlidersChanged());
            this.witnessSliderController = new WitnessSliderController("slide6-witness-slider", 8, () => this.onSlidersChanged());
            this.mapController = new MapController("phase6-taxidentville-graphics-container", null);
            
            setTimeout(() => {
                this.onSlidersChanged();

                this.mapController.initAccident();
                this.mapController.initCabs(this.cabSliderController.value);
                this.mapController.setCabColorsByValue(startCabSliderValue);            
                this.mapController.startRandomizingCabPositions();
                this.mapController.finishRandomizingCabPositions();                
                this.mapController.onAccident = (wasAccidentBlue) => this.onAccident(wasAccidentBlue);
            }, 100);

            super.show();
        }    
        leave() {            
            super.hide();
            setTimeout(() => {
                super.collapse();
                this.cabSliderController.dispose();
                this.cabSliderController = null;

                this.witnessSliderController.dispose();
                this.witnessSliderController = null;
            }, 400 + 10);
        }    
    }

    export class Credits extends Slide {                
        constructor(slideManager: SlideManager) {
            super("credits", slideManager);
        }

        enter() {
            document.getElementsByTagName("body")[0].style.background = "#113A27";
            (<HTMLMainElement>document.getElementsByTagName("main")[0]).style.background = "transparent";

            super.show();
        }    
        leave() {            
            super.hide();
            setTimeout(() => {
                super.collapse();
            }, 400 + 10);
        }
    }
}