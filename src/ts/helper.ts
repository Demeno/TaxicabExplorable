namespace Taxidentville {
    export class Helper {
        static createSvg(xlinkHref:string):SVGSVGElement {
            // <svg>
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");            
                        
            // <use>
            let use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", xlinkHref);

            svg.appendChild(use);

            return svg;
        }

        static createSvgFromSprite(name: string):SVGSVGElement {
            return this.createSvg(`svg/sprite.svg#${name}`);
        }
    }
}