import { ParkingSystem } from "./system/ParkingSystem";
import { VehicleType } from "./utlis/Enums";

// Initialize Parking System
const parkingSystem = new ParkingSystem();

// Create Parking Slots (e.g., 2 two-wheelers, 3 four-wheelers, 1 large vehicle)
parkingSystem.parkingLot.createSlots(2, 3, 1);

// Simulate Vehicle Entry
console.log(parkingSystem.enterVehicle(VehicleType.TWO_WHEELER, "MH12AB1234"));
console.log(parkingSystem.enterVehicle(VehicleType.FOUR_WHEELER, "MH14XY5678"));
console.log(parkingSystem.enterVehicle(VehicleType.LARGE_VEHICLE, "MH14XY5678"));


// Simulate Vehicle Exit
console.log(parkingSystem.exitVehicle("MH12AB1234", 3));
console.log(parkingSystem.exitVehicle("MH14XY5678", 2));
