// spec for the solid fuel rocket
const solidFuel = { 
  // km/s
  exhaustVelocity: 2.5,
  // N
  thrust: 10e7,
  firingDuration: "minutes",
  // km/s
  maxDeltaV: 7,
  readiness: "Flight Proven",
  liftoffG: () => {
    try {
      
    } catch (error) {
      return error;
    }
  }
}

module.exports = solidFuel;