var Taxidentville;
(function (Taxidentville) {
    class CabSliderController {
        constructor(elementId, startValue, onValueChanged, scale = 1) {
            this.dragging = null;
            this.velocity = 0;
            this.onValueChanged = onValueChanged;
            this.cabsSlider = document.getElementById(elementId);
            this.generateElements(this.cabsSlider);
            window.requestAnimationFrame(() => {
                this.sliderWidth = this.sliderSvg.getBoundingClientRect().width;
                this.totalWidth = this.cabsSlider.clientWidth;
                this.initDragging();
                this.setLeft(this.leftByValue(startValue));
            });
        }
        setIsDisabled(isDisabled) {
            if (isDisabled) {
                this.sliderSvgWrapper.classList.add("disabled");
            }
            else {
                this.sliderSvgWrapper.classList.remove("disabled");
            }
        }
        startFtueHop() {
            this.sliderSvgWrapper.classList.add("ftue-hop");
        }
        stopFtueHop() {
            this.sliderSvgWrapper.classList.remove("ftue-hop");
        }
        setValue(value) {
            if (this.value != value) {
                this.value = value;
                for (let i = 0; i < 10; i++) {
                    if (i < value) {
                        this.cabSvgs[i].classList.add("blue");
                    }
                    else {
                        this.cabSvgs[i].classList.remove("blue");
                    }
                }
            }
        }
        setLeft(left) {
            this.sliderSvgWrapper.style.left = left + "px";
        }
        valueByLeft(left) {
            const cabCount = 10;
            let stepStride = ((this.totalWidth - this.sliderWidth) / cabCount);
            return Math.round(left / stepStride);
        }
        leftByValue(value) {
            const cabCount = 10;
            let stepStride = ((this.totalWidth - this.sliderWidth) / cabCount);
            return value * stepStride;
        }
        leftStringToLeftNumber(leftString) {
            if (leftString == "") {
                return 0;
            }
            else {
                return Number(leftString.substring(0, leftString.length - 2));
            }
        }
        sliderSvg_touchstart(ev) {
            this.startDrag(ev.touches[0].clientX);
            ev.preventDefault();
        }
        sliderSvg_touchmove(ev) {
            this.dragMove(ev.touches[0].clientX);
            ev.preventDefault();
        }
        sliderSvg_touchend(ev) {
            this.endDrag();
            ev.preventDefault();
        }
        sliderSvg_mousedown(ev) {
            this.startDrag(ev.clientX);
        }
        body_mousemove(ev) {
            this.dragMove(ev.clientX);
        }
        body_mouseup(ev) {
            this.endDrag();
        }
        startDrag(clientX) {
            // stop FTUE when starting to drag
            this.stopFtueHop();
            let left = this.leftStringToLeftNumber(this.sliderSvgWrapper.style.left);
            this.dragging = {
                xOnDown: clientX,
                leftOnDown: left,
            };
            this.valueBeforeDragging = this.value;
            this.velocity = 0;
            this.targetLeft = this.dragging.leftOnDown;
        }
        endDrag() {
            if (this.dragging) {
                this.isWaitingToReportValueAfterDragging = true;
            }
            this.dragging = null;
        }
        dragMove(clientX) {
            if (this.dragging) {
                let offset = (clientX - this.dragging.xOnDown);
                this.targetLeft = this.dragging.leftOnDown + offset;
            }
        }
        dispose() {
            this.stopFtueHop();
            this.sliderSvgWrapper.removeEventListener('touchstart', this.hander_sliderSvg_touchstart);
            this.sliderSvgWrapper.removeEventListener('touchmove', this.hander_sliderSvg_touchmove);
            this.sliderSvgWrapper.removeEventListener('touchend', this.hander_sliderSvg_touchend);
            this.sliderSvgWrapper.removeEventListener('mousedown', this.hander_sliderSvg_mousedown);
            document.body.removeEventListener('mousemove', this.handler_body_mousemove);
            document.body.removeEventListener('mouseup', this.handler_body_mouseup);
            this.isDisposed = true;
        }
        initDragging() {
            this.hander_sliderSvg_touchstart = this.sliderSvg_touchstart.bind(this);
            this.hander_sliderSvg_touchmove = this.sliderSvg_touchmove.bind(this);
            this.hander_sliderSvg_touchend = this.sliderSvg_touchend.bind(this);
            this.hander_sliderSvg_mousedown = this.sliderSvg_mousedown.bind(this);
            this.handler_body_mousemove = this.body_mousemove.bind(this);
            this.handler_body_mouseup = this.body_mouseup.bind(this);
            this.sliderSvgWrapper.addEventListener('touchstart', this.hander_sliderSvg_touchstart);
            this.sliderSvgWrapper.addEventListener('touchmove', this.hander_sliderSvg_touchmove);
            this.sliderSvgWrapper.addEventListener('touchend', this.hander_sliderSvg_touchend);
            this.sliderSvgWrapper.addEventListener('mousedown', this.hander_sliderSvg_mousedown);
            document.body.addEventListener('mousemove', this.handler_body_mousemove);
            document.body.addEventListener('mouseup', this.handler_body_mouseup);
            const loop = () => {
                let currentLeft = this.leftStringToLeftNumber(this.sliderSvgWrapper.style.left);
                let closestStep = this.valueByLeft(currentLeft);
                this.setValue(closestStep);
                if (!this.dragging) {
                    this.targetLeft = this.leftByValue(closestStep);
                }
                if (this.isWaitingToReportValueAfterDragging && Math.abs(this.velocity) < 0.01) {
                    if (this.valueBeforeDragging != this.value) {
                        this.onValueChanged(this.value);
                    }
                    this.isWaitingToReportValueAfterDragging = false;
                }
                let damping = 0.5;
                this.velocity += (this.targetLeft - currentLeft) * 0.9;
                this.velocity *= damping;
                let newLeft = (currentLeft + this.velocity);
                newLeft = Math.min(Math.max(newLeft, 0), this.totalWidth - this.sliderWidth); // area width - slider width
                // set rotation
                let rotationDegrees = this.velocity;
                rotationDegrees = Math.max(Math.min(rotationDegrees, 60), -60);
                this.sliderSvg.style.transform = `rotate(${rotationDegrees}deg)`;
                this.setLeft(newLeft);
                if (!this.isDisposed) {
                    requestAnimationFrame(loop);
                }
            };
            loop();
        }
        generateElements(cabsSlider) {
            cabsSlider.classList.add("cabs-slider");
            cabsSlider.innerHTML = "";
            // <div>
            this.sliderSvgWrapper = document.createElement("div");
            this.sliderSvgWrapper.classList.add("cabs-slider-slider");
            // <svg>
            this.sliderSvg = Taxidentville.Helper.createSvgFromSprite('slider');
            this.sliderSvgWrapper.appendChild(this.sliderSvg);
            cabsSlider.appendChild(this.sliderSvgWrapper);
            // <ul>
            let cabsSliderCabs = document.createElement("ul");
            cabsSliderCabs.className = "cabs-slider-cabs";
            this.cabSvgs = [];
            for (let i = 0; i < 10; i++) {
                let cabItem = document.createElement("li");
                let cabSvg = Taxidentville.Helper.createSvgFromSprite('cab');
                this.cabSvgs.push(cabSvg);
                cabItem.appendChild(cabSvg);
                cabsSliderCabs.appendChild(cabItem);
            }
            cabsSlider.appendChild(cabsSliderCabs);
        }
    }
    Taxidentville.CabSliderController = CabSliderController;
})(Taxidentville || (Taxidentville = {}));
