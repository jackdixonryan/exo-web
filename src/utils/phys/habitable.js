// this technically works, might as well keep it even though habitable does not need it.
function getLuminosity(stellarTemperature, stellarRadius) {

  const solRadius = 695700;
  const solTemperature = 5778;

  const radius = Math.pow((stellarRadius / solRadius), 2);
  const temp = Math.pow((stellarTemperature / solTemperature), 4)
  const solarLumens = radius * temp;
  return solarLumens
}

// where mass is in solMass, distance in AUs, albedo (we will return to that), and greenhouse effect in Earth GE

// i'll be honest, I stole this. Come after me if you must. 
function habitable(stellarMass, stellarDistance, bondAlbedo, greenHouseEffect) {

  const mass = stellarMass;
  const distance = stellarDistance;
  const albedo = bondAlbedo;
  const greenhouse = greenHouseEffect;

  const pi = Math.PI;
  const sigma = 5.6703 * Math.pow(10, -5);
  const L = 3.846 * Math.pow(10, 33) * Math.pow(mass, 3);
  const D = distance * 1.496 * Math.pow(10, 13);
  const A = albedo / 100;
  const T = greenhouse * 0.5841;
  const X = Math.sqrt((1 - A) * L / (16 * pi * sigma));
  const T_eff = Math.sqrt(X) * (1 / Math.sqrt(D));
  const T_eq = (Math.pow(T_eff, 4)) * (1 + (3 * T / 4));
  const T_sur = T_eq / 0.9;
  let T_kel = Math.sqrt(Math.sqrt(T_sur));
  T_kel = Math.round(T_kel);
  const celsius = T_kel - 273;
  let fh = ((9 * (T_kel - 273)) / 5) + 32;
  fh = Math.round(fh);
  let years = Math.round(Math.pow(10, 10) * (1 / (Math.pow(mass, 2))));

  function sigFigs(n, sig) {
    var mult = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
    return Math.round(n * mult) / mult;
  }
  years = sigFigs(years, 2);

  function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  years = addCommas(years);
  const notes = []
  if (celsius <= 0) {

    if (celsius <= 0) {
      notes.push("planet is too cold to support water.")
    }

    if (celsius <= -18) {
      notes.push("planet is too cold to support saltwater")
    }

    if (celsius <= -79) {
      notes.push("planet is too cold to support atmospheric carbon dioxide.")
    }

    if (celsius <= -210) {
      notes.push("planet is too cold to support atmospheric nitrogen");
    }

    if (celsius <= -219) {
      notes.push("planet is too cold to support atmospheric oxygen");
    }

  } else if (celsius >= 100) {

    if (celsius >= 100) {
      notes.push("planet is hot enough to boil water.")
    }

    if (celsius >= 107) {
      notes.push("planet heat would boil off oceans.")
    }

    if (celsius >= 282) {
      notes.push("any plant life would burn away.")
    }

    if (celsius >= 328) {
      notes.push("planet is hot enough to melt lead.")
    }

    if (celsius >= 1100) {
      notes.push("planet is hot enough to melt rocky crust.")
    }

  } else {
    notes.push("planet is within acceptable bounds to support liquid water.");
  }
  return notes;
};

module.exports = habitable;
				
