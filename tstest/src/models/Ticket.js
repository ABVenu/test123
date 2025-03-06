"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
const Constants_1 = require("../utlis/Constants");
class Ticket {
    constructor(vehiclePlate, vehicleType) {
        this.vehiclePlate = vehiclePlate;
        this.vehicleType = vehicleType;
        this.entryTime = new Date();
    }
    calculateCharge(hours) {
        return hours * Constants_1.PRICING[this.vehicleType];
    }
}
exports.Ticket = Ticket;
