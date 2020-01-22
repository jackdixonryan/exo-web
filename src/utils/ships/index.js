const travelTime = require("../phys/travelTime")

class Ship {
  constructor(
    exhaustVelocity,
    thrust,
    firingDuration,
    maxDeltaV,
    techReadiness
  ) {
    // where ev is m/s
    (this.exhaustVelocity = exhaustVelocity),
      // newtons
      (this.thrust = thrust),
      // string
      (this.firingDuration = firingDuration),
      // m/s
      (this.maxDeltaV = maxDeltaV),
      // string
      (this.techReadiness = techReadiness);
  }
  maxGForce() {
    // in a conventional rocket, DELTA V is a measure of how much speed change can be achieved with a maximum engine burn that destroys the rocket's entire fuel load. So Max G Force is WELL ABOVE the usual burn
    try {
      // g is merely earth gravity, pure and simple.
      const g = 9.81; 
      const gForce = this.maxDeltaV / g;
      return gForce;
      
    } catch (error) {
      return error;
    }
  }
}

const solidFuelRocket = new Ship(2500, 10e7, "minutes", 7000, "Flight proven");

const ionThruster = new Ship(210000, 1, "days", 100000, "Flight proven");

console.log(solidFuelRocket.maxGForce());
console.log(ionThruster.maxGForce());