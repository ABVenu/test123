import { VehicleType } from "../utlis/Enums";

export interface ITicket {
    vehiclePlate: string;
    vehicleType: VehicleType;
    entryTime: Date;
    exitTime?: Date;
    calculateCharge(hours: number): number;
}