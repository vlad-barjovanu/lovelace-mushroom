import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("mushroom-button")
export class Button extends LitElement {
    @property() public title: string = "";
    @property({ type: Boolean }) public disabled: boolean = false;
    @property({ type: Boolean }) public round: boolean = false;
    @property({ type: String }) public btnClass: string = "";

    protected getClass(): string{
        var outCls = "";
        if(this.round)
            outCls = outCls.concat("button-round");
        else
            outCls = outCls.concat("button");
        if(this.btnClass && this.btnClass.length > 0){
            outCls = outCls.concat(" ", this.btnClass);
        }
        return outCls;
    }
    protected render(): TemplateResult {
        return html`
            <button type="button" class=${this.getClass()} .title=${this.title} .disabled=${this.disabled}>
                <slot> </slot>
            </button>
        `;
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
            }
            .open-button {
                --icon-color: rgb(var(--rgb-button-cover-open));
            }
            .close-button {
                --icon-color: rgb(var(--rgb-button-cover-close));
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
