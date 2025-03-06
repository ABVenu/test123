import { IParkingSlot } from "../interfaces/IParkingSlot";
import { SlotStatus, VehicleType } from "../utlis/Enums";

export class ParkingSlot implements IParkingSlot {
    id: number;
    type: VehicleType;
    status: SlotStatus;

    constructor(id: number, type: VehicleType, status: SlotStatus = SlotStatus.AVAILABLE) {
        this.id = id;
        this.type = type;
        this.status = status;
    }

    occupySlot(): void {
        this.status = SlotStatus.OCCUPIED;
    }

    freeSlot(): void {
        this.status = SlotStatus.AVAILABLE;
    }
}