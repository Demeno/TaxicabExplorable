namespace Taxidentville {
    export class WitnessSliderController {        
        rootElement: HTMLElement;
        sliderSvgWrapper: HTMLDivElement;
        sliderSvg: SVGSVGElement;
        witnessLi: HTMLLIElement[];
        
        sliderSvgTargetLeft: number;
        value: number;

        totalWidth: number;
        sliderWidth: number;

        dragging:any = null;
        valueBeforeDragging: number;
        targetLeft: number;
        velocity: number = 0;
        isWaitingToReportValueAfterDragging: boolean;

        onValueChanged: Function;

        isDisposed: boolean;

        constructor(elementId: string, startValue: number, onValueChanged: Function, scale = 1) {            
            this.onValueChanged = onValueChanged;
            this.rootElement = document.getElementById(elementId);
            this.generateElements(this.rootElement);

            window.requestAnimationFrame(() => {
                this.sliderWidth = this.sliderSvg.getBoundingClientRect().width;
                this.totalWidth = this.rootElement.clientWidth;
                this.initDragging();
                this.setLeft(this.leftByValue(startValue));
            });
        }   
        
        public setIsDisabled(isDisabled: boolean): void {
            if (isDisabled) {
                this.sliderSvgWrapper.classList.add("disabled");
            } else {
                this.sliderSvgWrapper.classList.remove("disabled");
            }
        }        

        private setValue(value) {
            if (this.value != value) {
                this.value = value;                

                for (let i = 0; i < 10; i++) {
                    if (i < value) {
                        this.witnessLi[i].classList.add("right");
                    } else {
                        this.witnessLi[i].classList.remove("right");
                    }
                }
            }
        }

        private setLeft(left: number) {
            this.sliderSvgWrapper.style.left = left + "px";
        }

        private valueByLeft(left: number):number {
            const count = 10;
            let stepStride = ((this.totalWidth - this.sliderWidth) / count);
            return Math.round(left / stepStride);
        }

        private leftByValue(value: number):number {
            const count = 10;
            let stepStride = ((this.totalWidth - this.sliderWidth) / count);
            return value * stepStride;
        }

        private leftStringToLeftNumber(leftString: string):number {
            if (leftString == "") {
                return 0;
            } else {
                return Number(leftString.substring(0,leftString.length - 2));
            }
        }

        private sliderSvg_touchstart(ev) {
            this.startDrag(ev.touches[0].clientX);
            ev.preventDefault();
        }
        private sliderSvg_touchmove(ev) {
            this.dragMove(ev.touches[0].clientX);
            ev.preventDefault();
        }
        private sliderSvg_touchend(ev) {
            this.endDrag();
            ev.preventDefault();
        }

        private sliderSvg_mousedown(ev) {
            this.startDrag(ev.clientX);
        }
        private body_mousemove(ev) {
            this.dragMove(ev.clientX);
        }
        private body_mouseup(ev) {
            this.endDrag();
        }
        
        private startDrag(clientX: number) {
            let left = this.leftStringToLeftNumber(this.sliderSvgWrapper.style.left);
            this.dragging = {
                xOnDown: clientX,
                leftOnDown: left,
            };
            this.valueBeforeDragging = this.value;
            this.velocity = 0;
            this.targetLeft = this.dragging.leftOnDown;
        }

        private endDrag() {
            if (this.dragging) {
                this.isWaitingToReportValueAfterDragging = true;
            }
            this.dragging = null;
        }

        private dragMove(clientX: number) {
            if (this.dragging) {
                let offset = (clientX - this.dragging.xOnDown);
                this.targetLeft = this.dragging.leftOnDown + offset;
            }
        }

        dispose() {
            this.sliderSvgWrapper.removeEventListener('touchstart', this.hander_sliderSvg_touchstart);
            this.sliderSvgWrapper.removeEventListener('touchmove', this.hander_sliderSvg_touchmove);
            this.sliderSvgWrapper.removeEventListener('touchend', this.hander_sliderSvg_touchend);
            this.sliderSvgWrapper.removeEventListener('mousedown', this.hander_sliderSvg_mousedown);
            document.body.removeEventListener('mousemove', this.handler_body_mousemove);
            document.body.removeEventListener('mouseup', this.handler_body_mouseup);
            this.isDisposed = true;
        }

        hander_sliderSvg_touchstart: EventListenerObject;
        hander_sliderSvg_touchmove: EventListenerObject;
        hander_sliderSvg_touchend: EventListenerObject;

        hander_sliderSvg_mousedown: EventListenerObject;
        handler_body_mousemove: EventListenerObject;
        handler_body_mouseup: EventListenerObject;

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
                    this.targetLeft =  this.leftByValue(closestStep);
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
            }

            loop();
        }

        private generateElements(rootElement) {
            rootElement.classList.add("witness-slider");

            rootElement.innerHTML = "";
        
            // <div>
            this.sliderSvgWrapper = document.createElement("div");
            this.sliderSvgWrapper.classList.add("witness-slider-slider");

            // <svg>
            this.sliderSvg = Helper.createSvgFromSprite('slider');
            this.sliderSvgWrapper.appendChild(this.sliderSvg);
            
            rootElement.appendChild(this.sliderSvgWrapper);
            
            // <ul>
            let witnessSliderHeads = document.createElement("ul");
            witnessSliderHeads.className = "witness-slider-heads";
                        
            this.witnessLi = [];
            for (let i = 0; i < 10; i++) {
                let headItem = document.createElement("li");
                let headWrongSvg = Helper.createSvgFromSprite('head_wrong');
                let headRightSvg = Helper.createSvgFromSprite('head_right');
                headRightSvg.classList.add("right");
                this.witnessLi.push(headItem);

                headItem.appendChild(headWrongSvg);
                headItem.appendChild(headRightSvg);
                witnessSliderHeads.appendChild(headItem);                
            }

            rootElement.appendChild(witnessSliderHeads);
        }
    }
}