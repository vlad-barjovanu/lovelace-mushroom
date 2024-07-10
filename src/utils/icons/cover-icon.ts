import { HassEntity } from "home-assistant-js-websocket";

export const computeOpenIcon = (stateObj: HassEntity): string => {
    switch (stateObj.attributes.device_class) {
        case "awning":
        case "curtain":
        case "door":
        case "gate":
            return "mdi:arrow-expand-horizontal";
        default:
            return "mdi:arrow-up-bold-circle";
    }
};

export const computeCloseIcon = (stateObj: HassEntity): string => {
    switch (stateObj.attributes.device_class) {
        case "awning":
        case "curtain":
        case "door":
        case "gate":
            return "mdi:arrow-collapse-horizontal";
        default:
            return "mdi:arrow-down-bold-circle";
    }
};
