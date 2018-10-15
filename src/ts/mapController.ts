namespace Taxidentville {
    interface Vector2 {
        x: number;
        y: number;
    }

    class Cab {
        positionIndex: number;
        svgElement: SVGSVGElement;
        isBlue: boolean;

        constructor(svgElement: SVGSVGElement) {
            this.svgElement = svgElement;
        }

        setIsBlue(isBlue: boolean) {
            this.isBlue = isBlue;
            if (this.isBlue) {
                this.svgElement.classList.add("blue");
            } else {
                this.svgElement.classList.remove("blue");
            }
        }
    }

    export class MapController {        
        mapContainer: HTMLElement;
        accidentSvg: SVGSVGElement;
        
        accidentPositionIndex: number;
        accidentPossiblePositions: Vector2[] = [
            {x: 52, y: 260}, {x: 125, y: 90},
            {x: 125, y: 215}, {x: 125, y: 310},
            {x: 244, y: 40}, {x: 244, y: 215},
            {x: 336, y: 130}, {x: 336, y: 215},
            {x: 336, y: 286}, {x: 410, y: 286},
        ];

        accidentRandomizerInterval: number;
        cabPositionRandomizerInterval: number;
        simulateFullRandomizingTimeout: number;

        cabs: Cab[];

        onAccident: Function;
        onQueueDone: Function;

        simulationQueue:number[] = [];
        isSimulating: boolean;
        
        constructor(elementId: string, onAccident: Function) {
            this.onAccident = onAccident;
            this.mapContainer = document.getElementById(elementId);
        }
        
        public initAccident(): void {
            this.generateAccidentSvg();
            this.setAccidentPosition(0);
        }

        private generateAccidentSvg() {
            this.accidentSvg = Helper.createSvgFromSprite('accident');
            this.accidentSvg.classList.add("accident");
            this.mapContainer.appendChild(this.accidentSvg);
        }

        private placeAccidentAt(vector2: Vector2) {
            let size = this.accidentSvg.getBBox();
            this.accidentSvg.style.left = `${vector2.x - size.width / 2}px`;
            this.accidentSvg.style.top = `${vector2.y - size.height / 2}px`;
        }

        private setAccidentPosition(index: number) {
            this.accidentPositionIndex = index;
            this.placeAccidentAt(this.accidentPossiblePositions[this.accidentPositionIndex]);
        }

        private moveAccidentRandomly() {
            let newIndex = this.accidentPositionIndex + 1 + Math.floor(Math.random() * (this.accidentPossiblePositions.length - 1));
            newIndex = newIndex % (this.accidentPossiblePositions.length);
            this.setAccidentPosition(newIndex);
        }
        
        public startRandomizingAccident() {
            if (!this.accidentSvg) {
                this.initAccident();
                this.accidentPositionIndex = 0;
            }

            this.moveAccidentRandomly();
            this.accidentRandomizerInterval = setInterval(() => {
                this.moveAccidentRandomly();
            }, 200);
        }

        public stopRandomizingAccident() {
            clearInterval(this.accidentRandomizerInterval);
        }

        private generateCabs() {
            this.cabs = [];
            for (let i = 0; i < 10; i++) {
                let cabSvg = Helper.createSvgFromSprite('ville-cab');                
                cabSvg.classList.add("ville-cab");                
                this.mapContainer.appendChild(cabSvg);
                this.cabs[i] = new Cab(cabSvg);
            }
        }

        private randomizeCabPositions() {
            let positionIndeces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            
            for (let i = 0; i < 10; i++) {
                let positionIndexIndex = Math.floor(Math.random() * positionIndeces.length);
                this.cabs[i].positionIndex = positionIndeces[positionIndexIndex];
                positionIndeces.splice(positionIndexIndex, 1);
            }

            for (let i = 0; i < 10; i++) {
                let svg = this.cabs[i].svgElement;
                this.cabs[i].positionIndex;
                let size = svg.getBBox();
                let position = this.accidentPossiblePositions[this.cabs[i].positionIndex];
                svg.style.left = `${position.x - size.width / 2}px`;
                svg.style.top = `${position.y - size.height / 2}px`;
            }
        }

        public setCabColorsByValue(value: number) {
            if (!this.cabs) return;

            for (let i = 0; i < 10; i++) {
                if (i < value) {
                    this.cabs[i].setIsBlue(true);
                } else {
                    this.cabs[i].setIsBlue(false);
                }
            }
        }

        public initCabs(value: number) {
            if (!this.cabs) {
                this.generateCabs();
            }
            this.setCabColorsByValue(value);
        }

        public startRandomizingCabPositions() {
            this.randomizeCabPositions();
            this.cabPositionRandomizerInterval = setInterval(() => {
                this.randomizeCabPositions();
            }, 200);
        }

        public finishRandomizingCabPositions() {
            clearInterval(this.cabPositionRandomizerInterval);
            let cabThatHadAccident = this.cabs.find(x => x.positionIndex == this.accidentPositionIndex);            
            if (this.onAccident) {
                this.onAccident(cabThatHadAccident.isBlue);
            }
        }

        public enqueueSimulation(speed: number) {
            this.simulationQueue.push(speed);
            if (!this.isSimulating) {
                this.dequeueSimulation();
            }
        }

        public reset() {
            clearInterval(this.accidentRandomizerInterval);
            clearInterval(this.cabPositionRandomizerInterval);
            clearTimeout(this.simulateFullRandomizingTimeout);
            this.simulationQueue = [];

            if (this.accidentSvg) {
                this.mapContainer.removeChild(this.accidentSvg);
            }
            if (this.cabs) {
                for (let cab of this.cabs) {
                    this.mapContainer.removeChild(cab.svgElement);
                }
            }
        }

        private dequeueSimulation() {
            this.simulateFull(this.simulationQueue.shift());
        }
        
        private simulateFull(speed: number) {
            this.isSimulating = true;

            this.startRandomizingAccident();
            this.startRandomizingCabPositions();
            this.simulateFullRandomizingTimeout = setTimeout(() => {
                this.stopRandomizingAccident();
                this.finishRandomizingCabPositions();

                if (this.simulationQueue.length > 0) {
                    this.dequeueSimulation();
                } else {
                    this.isSimulating = false;
                    if (this.onQueueDone) {
                        this.onQueueDone();
                    }
                }
            }, 500 / speed);
        }
    }
}