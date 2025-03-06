import { Vehicle } from "../models/Vehicle";
import { VehicleType } from "../utlis/Enums";

export class VehicleFactory {
    static createVehicle(type: VehicleType, plateNumber: string): Vehicle {
        return new Vehicle(type, plateNumber);
    }
}