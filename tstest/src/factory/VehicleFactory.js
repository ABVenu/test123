"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleFactory = void 0;
const Vehicle_1 = require("../models/Vehicle");
class VehicleFactory {
    static createVehicle(type, plateNumber) {
        return new Vehicle_1.Vehicle(type, plateNumber);
    }
}
exports.VehicleFactory = VehicleFactory;
