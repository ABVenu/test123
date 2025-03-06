import { IVehicle } from "../interfaces/IVehicle";
import { VehicleType } from "../utlis/Enums";

export class Vehicle implements IVehicle {
    type: VehicleType;
    plateNumber: string;
    
    constructor(type: VehicleType, plateNumber: string) {
        this.type = type;
        this.plateNumber = plateNumber;
    }
}
