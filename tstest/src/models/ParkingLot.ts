
import { IParkingLot } from "../interfaces/IParkingLot";
import { PRICING } from "../utlis/Constants";
import { SlotStatus, VehicleType } from "../utlis/Enums";
import { ParkingSlot } from "./ParkingSlot";

export class ParkingLot implements IParkingLot {
    private static instance: ParkingLot;
    slots: ParkingSlot[] = [];

    private constructor() {}

    static getInstance(): ParkingLot {
        if (!ParkingLot.instance) {
            ParkingLot.instance = new ParkingLot();
        }
        return ParkingLot.instance;
    }

    addSlot(slot: ParkingSlot): void {
        this.slots.push(slot);
    }

    createSlots(twoWheelerCount: number, fourWheelerCount: number, largeVehicleCount: number): void {
        let idCounter = this.slots.length + 1;
        
        for (let i = 0; i < twoWheelerCount; i++) {
            this.addSlot(new ParkingSlot(idCounter++, VehicleType.TWO_WHEELER));
        }

        for (let i = 0; i < fourWheelerCount; i++) {
            this.addSlot(new ParkingSlot(idCounter++, VehicleType.FOUR_WHEELER));
        }

        for (let i = 0; i< largeVehicleCount; i++) {
            this.addSlot(new ParkingSlot(idCounter++, VehicleType.LARGE_VEHICLE));
        }
    }

    findAvailableSlot(vehicleType: VehicleType): ParkingSlot | null {
        return this.slots.find(slot => slot.type === vehicleType && slot.status === SlotStatus.AVAILABLE) || null;
    }
    calculatePricing(vehicleType: VehicleType, hours: number): number {
        return hours * PRICING[vehicleType];
    }
}