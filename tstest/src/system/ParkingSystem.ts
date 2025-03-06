import { VehicleFactory } from "../factory/VehicleFactory";
import { ParkingLot } from "../models/ParkingLot";
import { Ticket } from "../models/Ticket";
import { VehicleType } from "../utlis/Enums";

export class ParkingSystem {
    parkingLot: ParkingLot;
    tickets: Ticket[] = [];

    constructor() {
        this.parkingLot = ParkingLot.getInstance();
    }

    enterVehicle(vehicleType: VehicleType, plateNumber: string): string {
        const vehicle = VehicleFactory.createVehicle(vehicleType, plateNumber);
        const slot = this.parkingLot.findAvailableSlot(vehicle.type);
        
        if (!slot) {
            return "No available slots for this vehicle type.";
        }
        
        slot.occupySlot();
        const ticket = new Ticket(vehicle.plateNumber, vehicle.type);
        this.tickets.push(ticket);
        return `Vehicle ${vehicle.plateNumber} parked in slot ${slot.id}. Ticket issued.`;
    }

    exitVehicle(plateNumber: string, hours: number): string {
        const ticket = this.tickets.find(t => t.vehiclePlate === plateNumber);
        if (!ticket) {
            return "No such vehicle found in the parking lot.";
        }
        
        const amount = ticket.calculateCharge(hours);
        ticket.exitTime = new Date();
        this.tickets = this.tickets.filter(t => t.vehiclePlate !== plateNumber);
        return `Vehicle ${plateNumber} exited. Total charge: ₹${amount}`;
    }
    

}
