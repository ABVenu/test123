"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotStatus = exports.VehicleType = void 0;
var VehicleType;
(function (VehicleType) {
    VehicleType["TWO_WHEELER"] = "TwoWheeler";
    VehicleType["FOUR_WHEELER"] = "FourWheeler";
    VehicleType["LARGE_VEHICLE"] = "LargeVehicle";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var SlotStatus;
(function (SlotStatus) {
    SlotStatus["AVAILABLE"] = "Available";
    SlotStatus["OCCUPIED"] = "Occupied";
    SlotStatus["RESERVED"] = "Reserved";
})(SlotStatus || (exports.SlotStatus = SlotStatus = {}));
