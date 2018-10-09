var Taxidentville;
(function (Taxidentville) {
    class WitnessedCab {
        constructor(element) {
            this.element = element;
        }
        refreshClassByState() {
            this.element.classList.remove("blue_seenblue");
            this.element.classList.remove("blue_seengreen");
            this.element.classList.remove("green_seengreen");
            this.element.classList.remove("green_seenblue");
            this.element.classList.add(`${this.isBlue ? "blue" : "green"}_seen${this.isSeenBlue ? "blue" : "green"}`);
        }
    }
    class WitnessCabsController {
        constructor(rootElementId, startValueBlue, startValueRight) {
            this.rootElement = document.getElementById(rootElementId);
            this.generateElements();
            this.setState(startValueBlue, startValueRight);
        }
        generateElements() {
            this.rootElement.classList.add("witness-cabs");
            this.rootElement.innerHTML = "";
            // <ul>
            let witnessedCabsUl = document.createElement("ul");
            witnessedCabsUl.className = "witnessed-cabs";
            this.witnessedCabs = [];
            const radius = 154;
            for (let i = 0; i < 10; i++) {
                let cabItem = document.createElement("li");
                let cabBlueSeenBlueSvg = Taxidentville.Helper.createSvgFromSprite('cab_blue_seenblue');
                let cabBlueSeenGreenSvg = Taxidentville.Helper.createSvgFromSprite('cab_blue_seengreen');
                let cabGreenSeenGreenSvg = Taxidentville.Helper.createSvgFromSprite('cab_green_seengreen');
                let cabGreenSeenBlueSvg = Taxidentville.Helper.createSvgFromSprite('cab_green_seenblue');
                cabBlueSeenBlueSvg.classList.add("blue_seenblue");
                cabBlueSeenGreenSvg.classList.add("blue_seengreen");
                cabGreenSeenGreenSvg.classList.add("green_seengreen");
                cabGreenSeenBlueSvg.classList.add("green_seenblue");
                cabItem.appendChild(cabBlueSeenBlueSvg);
                cabItem.appendChild(cabBlueSeenGreenSvg);
                cabItem.appendChild(cabGreenSeenGreenSvg);
                cabItem.appendChild(cabGreenSeenBlueSvg);
                let angle = (i / 10.0) * Math.PI * 2 + Math.PI * 0.5;
                let left = 380 / 2 - Math.cos(angle) * radius;
                let top = 380 / 2 - Math.sin(angle) * radius;
                cabItem.style.left = `${left}px`;
                cabItem.style.top = `${top}px`;
                witnessedCabsUl.appendChild(cabItem);
                this.witnessedCabs.push(new WitnessedCab(cabItem));
            }
            this.rootElement.appendChild(witnessedCabsUl);
        }
        setState(amountBlue, amountRight) {
            let amountRightBlue = Math.round(amountBlue * amountRight / 10.0);
            let amountRightGreen = Math.round((10 - amountBlue) * amountRight / 10.0);
            for (let i = 0; i < 10; i++) {
                let witnessedCab = this.witnessedCabs[i];
                if (i < amountBlue) {
                    witnessedCab.isBlue = true;
                    if (amountRightBlue-- > 0) {
                        witnessedCab.isSeenBlue = true;
                    }
                    else {
                        witnessedCab.isSeenBlue = false;
                    }
                }
                else {
                    witnessedCab.isBlue = false;
                    if (amountRightGreen-- > 0) {
                        witnessedCab.isSeenBlue = false;
                    }
                    else {
                        witnessedCab.isSeenBlue = true;
                    }
                }
                witnessedCab.refreshClassByState();
            }
        }
    }
    Taxidentville.WitnessCabsController = WitnessCabsController;
})(Taxidentville || (Taxidentville = {}));
