import { SlotStatus, VehicleType } from "../utlis/Enums";

export interface IParkingSlot {
    id: number;
    type: VehicleType;
    status: SlotStatus;
    occupySlot(): void;
    freeSlot(): void;
}
