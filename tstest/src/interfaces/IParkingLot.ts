import { ParkingSlot } from "../models/ParkingSlot";
import { VehicleType } from "../utlis/Enums";

export interface IParkingLot {
    addSlot(slot: ParkingSlot): void;
    createSlots(twoWheelerCount: number, fourWheelerCount: number, largeVehicleCount: number): void;
    findAvailableSlot(vehicleType: VehicleType): ParkingSlot | null;
    calculatePricing(vehicleType: VehicleType, hours: number): number;
}