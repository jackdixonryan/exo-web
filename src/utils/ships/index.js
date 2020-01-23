const travelTime = require("../phys/travelTime");

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
  minimumTimeToReach(distance) {
    return travelTime(distance, this.maxDeltaV);
  }
}

const solidFuelRocket = new Ship(2500, 10e7, "minutes", 7000, "Flight proven");

const ionThruster = new Ship(210000, 1, "days", 100000, "Flight proven");

const monopropellantRocket = new Ship(
  3000,
  400,
  "milliseconds - minutes",
  3000,
  "Flight proven"
);

const liquidFuelRocket = new Ship(
  4400,
  10e7,
  "minutes",
  9000,
  "Flight proven"
);

const hallEffectThruster = new Ship(
  50000,
  null,
  "Months-Years",
  100000,
  "Flight Proven"
)

const lightSpeedVoyager = new Ship(
  299792000,
  null,
  "unknown",
  299792000,
  "Theoretical"
)

module.exports = {
  solidFuelRocket,
  ionThruster,
  monopropellantRocket,
  hallEffectThruster,
  lightSpeedVoyager,
  liquidFuelRocket
}
