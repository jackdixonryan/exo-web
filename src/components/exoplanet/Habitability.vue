<template>
  <div>

  </div>
</template>

<script>
  export default {
    props: ["planet"],
    computed: {
      habitableZone() { 
        // calculated as the distance around a star where liquid water may exist;

        // the equation for energy flux is F = sSB * T^4;
        // where sSB is the Stefan Boltzmann constant, 
        // T is the the effective temperature
        // and F is Flux

        // with a star, the equation is F = L/(4|pi|r^2)
        // where L is Luminosity of the star,
        // pi is pi, obv,
        // and r is the star's radius. 

        // so, the effective temperature at a given radius can be expressed by 
        // sSBT^4 = F = L/(4[pi]r^2)
        // so to say, we need the Luminosity and the distance of the planet from the star + the star's radius to take a stab at the effective surface temperature of the planet.

        // stefan boltzmann constantm, in SI, at 10-8W * m^-2 * K^-4 is ....
        const stefanBoltzmannConstant = 5.67e-8;
        // in Kelvin
        const stellarEffectiveTemperature = planet.st_teff;
        // now, stellar radius in sol radii;
        const stellarSolRadii = planet.st_rad;
        const solRadiusInMeters = 6.96e8;
        const stellarRadiiInMeters = stellarSolRadii * solRadiusInMeters;
      
        const auToMeters = 1.46e11;
        // this is the maximum; in order to ascertain the entire range you'll have to use the eccentricity field to determine orb_min under the assumption that it's possible for a planet to be intolerable to unassisted earth life when at perihelion while it's habitable at its aphelion.
        const planetaryDistanceFromStarInMeters = planet.pl_orbsmax;
        const radiusForCalculation = stellarRadiiInMeters + 
      }, 
      habitableGravity() {

      }, 
      habitableComposition() {

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>