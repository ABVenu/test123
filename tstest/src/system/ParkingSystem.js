"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParkingSystem = void 0;
const VehicleFactory_1 = require("../factory/VehicleFactory");
const ParkingLot_1 = require("../models/ParkingLot");
const Ticket_1 = require("../models/Ticket");
class ParkingSystem {
    constructor() {
        this.tickets = [];
        this.parkingLot = ParkingLot_1.ParkingLot.getInstance();
    }
    enterVehicle(vehicleType, plateNumber) {
        const vehicle = VehicleFactory_1.VehicleFactory.createVehicle(vehicleType, plateNumber);
        const slot = this.parkingLot.findAvailableSlot(vehicle.type);
        if (!slot) {
            return "No available slots for this vehicle type.";
        }
        slot.occupySlot();
        const ticket = new Ticket_1.Ticket(vehicle.plateNumber, vehicle.type);
        this.tickets.push(ticket);
        return `Vehicle ${vehicle.plateNumber} parked in slot ${slot.id}. Ticket issued.`;
    }
    exitVehicle(plateNumber, hours) {
        const ticket = this.tickets.find(t => t.vehiclePlate === plateNumber);
        if (!ticket) {
            return "No such vehicle found in the parking lot.";
        }
        const amount = ticket.calculateCharge(hours);
        ticket.exitTime = new Date();
        return `Vehicle ${plateNumber} exited. Total charge: ₹${amount}`;
    }
}
exports.ParkingSystem = ParkingSystem;
