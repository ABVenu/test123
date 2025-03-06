"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParkingLot = void 0;
const Constants_1 = require("../utlis/Constants");
const Enums_1 = require("../utlis/Enums");
const ParkingSlot_1 = require("./ParkingSlot");
class ParkingLot {
    constructor() {
        this.slots = [];
    }
    static getInstance() {
        if (!ParkingLot.instance) {
            ParkingLot.instance = new ParkingLot();
        }
        return ParkingLot.instance;
    }
    addSlot(slot) {
        this.slots.push(slot);
    }
    createSlots(twoWheelerCount, fourWheelerCount, largeVehicleCount) {
        let idCounter = this.slots.length + 1;
        for (let i = 0; i < twoWheelerCount; i++) {
            this.addSlot(new ParkingSlot_1.ParkingSlot(idCounter++, Enums_1.VehicleType.TWO_WHEELER));
        }
        for (let i = 0; i < fourWheelerCount; i++) {
            this.addSlot(new ParkingSlot_1.ParkingSlot(idCounter++, Enums_1.VehicleType.FOUR_WHEELER));
        }
        for (let i = 0; i < largeVehicleCount; i++) {
            this.addSlot(new ParkingSlot_1.ParkingSlot(idCounter++, Enums_1.VehicleType.LARGE_VEHICLE));
        }
    }
    findAvailableSlot(vehicleType) {
        return this.slots.find(slot => slot.type === vehicleType && slot.status === Enums_1.SlotStatus.AVAILABLE) || null;
    }
    calculatePricing(vehicleType, hours) {
        return hours * Constants_1.PRICING[vehicleType];
    }
}
exports.ParkingLot = ParkingLot;
