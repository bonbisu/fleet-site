import { Car } from "../classes/car.js";
import { Drone } from "../classes/drone.js";
import { DataError } from "./data-error.js";

export class FleetDataService {
    constructor() {
        this.cars = [];
        this.drones = [];
        this.errors = [];
        
    }

    loadData(fleet) {
        for (let data of fleet) {
            switch (data.type) {
                case 'car':
                    if (this.validateCarData(data) ) { // execute if have no errors
                        let car = this.loadCar(data);
                        if (car) {
                            this.cars.push(car);
                        }
                    } else {
                        let e = new DataError('invalid car data', data);
                        this.errors.push(e);
                    }
                    break;

                case 'drone':
                    if (this.validateDroneData(data) ) {
                        let drone = this.loadDrone(data);
                        if (drone) {
                            this.drones.push(drone);
                        } 
                    } else {
                            let e = new DataError('invalid drone data', data);
                            this.errors.push(e);
                    }
                    break;

                default:
                    let e = new DataError('Invalid vehicle type', data);
                    this.errors.push(e);
                    break;
            }            
        }
    }
     
    loadCar(car) {
        try{ // if ocurrs some problem inside the block, jump to catch
            let c = new Car(car.license, car.model, car.latLong);
            c.miles = car.miles;
            c.make = car.make;
            return c;
        } catch(e) {
            this.errors.push(new DataError('error loading car', car) );
        }
        return null;
    }

    loadDrone(drone) {
        try {
            let d = new Drone(drone.license, drone.model, drone.latLong);
            d.airTimeHour = drone.airTimeHour;
            d.base = drone.base;
            return d;
        } catch(e) {
            this.errors.push(new DataError('error loading drone', drone) );
        }
        return null;
    }

    validateCarData(car) {
        let requiredProps = 'license model latLong miles make'.split(' ');
        let hasErrors = false;

        for (let field of requiredProps) {
            if ( ! car[field] ) {
                this.errors.push(new DataError(`invalid field ${field}`, car) ); // ES6 backtick syntax allows to use iterated variable
                hasErrors = true;
            }
        }

        if (Number.isNaN(Number.parseFloat(car.miles) ) ) {
            this.errors.push(new DataError('invalid mileage', car) );
            hasErrors = true;
        }
        return !hasErrors; // send true if no errors
    }

    validateDroneData(drone) {
        let requiredProps = 'license model latLong airTimeHours base'.split(' ');
        let hasErrors = false;
        
        for (let field of requiredProps) {
            if ( ! drone[field] ) {
                this.errors.push(new DataError(`invalid field ${field}`, drone) );
                hasErrors = true;
            }
        }

        if (Number.isNaN(Number.parseFloat(drone.airTimeHours) ) ) {
            this.errors.push(new DataError('invalid air time', drone) );
            hasErrors = true;
        }
        return !hasErrors;
    }
}