"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParkingSlot = void 0;
const Enums_1 = require("../utlis/Enums");
class ParkingSlot {
    constructor(id, type, status = Enums_1.SlotStatus.AVAILABLE) {
        this.id = id;
        this.type = type;
        this.status = status;
    }
    occupySlot() {
        this.status = Enums_1.SlotStatus.OCCUPIED;
    }
    freeSlot() {
        this.status = Enums_1.SlotStatus.AVAILABLE;
    }
}
exports.ParkingSlot = ParkingSlot;
