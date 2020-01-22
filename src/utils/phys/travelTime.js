// where d = distance in parsec, v = velocity in m/s
// returns travel time in years, y 
// corroborated by reversing the equ, is correct.
function calcTravelTime(d, v) {
  try {
    // conversion to m
    const dM = d * 3.086e16;
    // t = d / v
    // t = km / km/s 
    const travelTime = dM / v;
    // ergo travelTime is expressed in seconds, convert to years.
    const y = travelTime / 60 / 60 / 24 / 365;
    return y;
    
  } catch (error) {
    return error;
  }
}

// const oneParsecTravel = calcTravelTime(1, 11176);
// console.log(oneParsecTravel)
module.exports = calcTravelTime;