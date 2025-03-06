import { ITicket } from "../interfaces/ITicket";
import { PRICING } from "../utlis/Constants";
import { VehicleType } from "../utlis/Enums";

export class Ticket implements ITicket {
    vehiclePlate: string;
    vehicleType: VehicleType;
    entryTime: Date;
    exitTime?: Date;
    
    constructor(vehiclePlate: string, vehicleType: VehicleType) {
        this.vehiclePlate = vehiclePlate;
        this.vehicleType = vehicleType;
        this.entryTime = new Date();
    }
    
    calculateCharge(hours: number): number {
        return hours * PRICING[this.vehicleType];
    }
}