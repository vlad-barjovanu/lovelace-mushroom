import {css, CSSResultGroup, html, LitElement, TemplateResult} from "lit";
import {property, customElement} from "lit/decorators.js";

@customElement("mushroom-button")
export class Button extends LitElement {
    @property() public title: string = "";
    @property({type: Boolean}) public disabled: boolean = false;
    @property({type: Boolean}) public round: boolean = false;
    @property({type: Boolean}) public gradient: boolean = false;
    @property({type: String}) public btnClass: string = "";

    protected getClass(): string {
        var outCls = "";
        if (this.round)
            outCls = outCls.concat("button-round");
        else
            outCls = outCls.concat("button");
        if (this.btnClass && this.btnClass.length > 0) {
            outCls = outCls.concat(" ", this.btnClass);
        }
        return outCls;
    }

    protected render(): TemplateResult {
        return html`
            <button type="button" class=${this.getClass()} .title=${this.title} .disabled=${this.disabled}>
                <slot></slot>
            </button>
        `;
    }

    // Method to generate a unique ID
    _generateUniqueId() {
        return 'unique-' + Math.random().toString(36).substr(2, 9);
    }

    _applyGradientColors(){
        // Access computed styles for this element
        var button = this.renderRoot.querySelector('button');
        var gradientColor1, gradientOffset1, gradientColor2, gradientOffset2;
        var gradientX1, gradientX2, gradientY1, gradientY2;
        var computedStyle;
        if (button) {
            computedStyle = getComputedStyle(button);
        }
        if (computedStyle) {
            // Example: Read the values of --gradient-color-1 and --gradient-offset-1
            gradientColor1 = computedStyle.getPropertyValue('--gradient-color-1').trim();
            gradientOffset1 = computedStyle.getPropertyValue('--gradient-offset-1').trim();
            gradientColor2 = computedStyle.getPropertyValue('--gradient-color-2').trim();
            gradientOffset2 = computedStyle.getPropertyValue('--gradient-offset-2').trim();
            gradientX1 = computedStyle.getPropertyValue('--gradient-x1').trim();
            gradientX2 = computedStyle.getPropertyValue('--gradient-x2').trim();
            gradientY1 = computedStyle.getPropertyValue('--gradient-y1').trim();
            gradientY2 = computedStyle.getPropertyValue('--gradient-y2').trim();
        } else {
            gradientColor1 = "gray";
            gradientOffset1 = "0%";
            gradientColor2 = "gray";
            gradientOffset2 = "100%";
            gradientX1 = "0%";
            gradientX2 = "0%";
            gradientY1 = "0%";
            gradientY2 = "100%";
        }

        console.log("gradientColor1: ", gradientColor1);
        console.log("gradientOffset1: ", gradientOffset1);
        console.log("gradientColor2: ", gradientColor2);
        console.log("gradientOffset2: ", gradientOffset2);

        // Find the ha-icon element and set up a MutationObserver
        const haIcon = this.renderRoot.host.querySelector('ha-icon');
        if (haIcon) {
            const haIconObserver = new MutationObserver(() => {
                const haSvgIcon = haIcon.shadowRoot?.querySelector('ha-svg-icon');
                if (haSvgIcon) {
                    // Once we find ha-svg-icon, set up another observer for its shadow DOM
                    const haSvgIconObserver = new MutationObserver(() => {
                        const svgElement = haSvgIcon.shadowRoot?.querySelector('svg');
                        if (svgElement) {
                            // Generate a unique ID for the linearGradient
                            const uniqueId = this._generateUniqueId();

                            // Create the <defs> element
                            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

                            // Create the <linearGradient> element
                            const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                            linearGradient.setAttribute('id', uniqueId);
                            linearGradient.setAttribute('x1', gradientX1);
                            linearGradient.setAttribute('y1', gradientY1);
                            linearGradient.setAttribute('x2', gradientX2);
                            linearGradient.setAttribute('y2', gradientY2);
                            // Create the first <stop> element
                            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                            stop1.setAttribute('offset', gradientOffset1);
                            stop1.setAttribute('stop-color', gradientColor1);

                            // Create the second <stop> element
                            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                            stop2.setAttribute('offset', gradientOffset2);
                            stop2.setAttribute('stop-color', gradientColor2);

                            // Append stops to linearGradient
                            linearGradient.appendChild(stop1);
                            linearGradient.appendChild(stop2);

                            // Append linearGradient to defs
                            defs.appendChild(linearGradient);

                            // Append defs to svgElement
                            svgElement.appendChild(defs);

                            // Set the fill attribute of the svgElement to use the unique linearGradient
                            svgElement.setAttribute('style', `fill: url(#${uniqueId});`);

                            // Stop observing once the target element is found
                            haSvgIconObserver.disconnect();
                        } else
                            console.warn("Could not find the svg element");
                    });

                    // Start observing the shadow DOM of ha-svg-icon for changes
                    haSvgIconObserver.observe(haSvgIcon.shadowRoot, {childList: true, subtree: true});

                    // Disconnect haIconObserver since we've found the ha-svg-icon
                    haIconObserver.disconnect();
                } else
                    console.warn("Could not find the haSvgIcon element");
            });

            // Start observing the shadow DOM of ha-icon for changes
            haIconObserver.observe(haIcon.shadowRoot, {childList: true, subtree: true});
        } else
            console.warn("Could not find the haIcon element");
    }

    // Override the firstUpdated lifecycle method
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        console.log('Button rendered with all its children DOM elements.');
        if (this.gradient){
            this._applyGradientColors();
        }
    }

    static get styles(): CSSResultGroup {
        return css`
            :host {
                --icon-color: var(--primary-text-color);
                --icon-color-disabled: rgb(var(--rgb-disabled));
                --bg-color: rgba(var(--rgb-primary-text-color), 0.05);
                --bg-color-disabled: rgba(var(--rgb-disabled), 0.2);
                height: var(--control-height);
                width: calc(var(--control-height) * var(--control-button-ratio));
                flex: none;
            }

            :host([round="true"]) {
                --icon-color: var(--primary-text-color);
                --icon-color-disabled: rgb(var(--rgb-disabled));
                --bg-color: rgba(var(--rgb-primary-text-color), 0.05);
                --bg-color-disabled: rgba(var(--rgb-disabled), 0.2);
                height: var(--control-round-height);
                width: calc(var(--control-round-height) * var(--control-button-ratio));
                flex: none;
            }

            .stop-button {
                --icon-color: rgb(var(--rgb-button-cover-stop));
                --gradient-color-1: rgb(var(--rgb-button-cover-stop-1));
                --gradient-offset-1: var(--rgb-offset-button-cover-stop-1);
                --gradient-color-2: rgb(var(--rgb-button-cover-stop-2));
                --gradient-offset-2: var(--rgb-offset-button-cover-stop-2);
                --gradient-x1: 0%;
                --gradient-x2: 100%;
                --gradient-y1: 0%;
                --gradient-y2: 100%;
            }

            .open-button {
                --icon-color: rgb(var(--rgb-button-cover-open));
                --gradient-color-1: rgb(var(--rgb-button-cover-open-1));
                --gradient-offset-1: var(--rgb-offset-button-cover-open-1);
                --gradient-color-2: rgb(var(--rgb-button-cover-open-2));
                --gradient-offset-2: var(--rgb-offset-button-cover-open-2);
                --gradient-x1: 0%;
                --gradient-x2: 0%;
                --gradient-y1: 0%;
                --gradient-y2: 100%;
            }

            .close-button {
                --icon-color: rgb(var(--rgb-button-cover-close));
                --gradient-color-1: rgb(var(--rgb-button-cover-close-1));
                --gradient-offset-1: var(--rgb-offset-button-cover-close-1);
                --gradient-color-2: rgb(var(--rgb-button-cover-close-2));
                --gradient-offset-2: var(--rgb-offset-button-cover-close-2);
                --gradient-x1: 0%;
                --gradient-x2: 0%;
                --gradient-y1: 0%;
                --gradient-y2: 100%;
            }

            .button {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                border-radius: var(--control-border-radius);
                border: none;
                background-color: var(--bg-color);
                transition: background-color 280ms ease-in-out;
                font-size: var(--control-height);
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                line-height: 0;
            }

            .button:disabled {
                cursor: not-allowed;
                background-color: var(--bg-color-disabled);
            }

            .button ::slotted(*) {
                --mdc-icon-size: var(--control-icon-size);
                color: var(--icon-color);
                pointer-events: none;
            }

            .button:disabled ::slotted(*) {
                color: var(--icon-color-disabled);
            }

            .button-round {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                border-radius: var(--control-border-radius-round);
                border: none;
                background-color: var(--button-round-background);
                transition: background-color 280ms ease-in-out;
                font-size: var(--control-round-height);
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                line-height: 0;
            }

            .button-round:disabled {
                cursor: not-allowed;
                background-color: var(--button-round-background);
            }

            .button-round ::slotted(*) {
                --mdc-icon-size: var(--control-round-icon-size);
                color: var(--icon-color);
                pointer-events: none;
            }

            .button-round:disabled ::slotted(*) {
                color: var(--icon-color-disabled);
            }
        `;
    }
}
