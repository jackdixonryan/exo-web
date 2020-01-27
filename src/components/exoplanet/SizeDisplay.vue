<template>
  <div v-if="comparisonReady" class="display">
    <div class="planetary-box">
      <div class="atmos">
        <div :style="exoDiv" class="planet"></div>
      </div>
    </div>
    <div class="planetary-box">
      <div class="atmos">
        <div :style="comparatorDiv" class="planet" id="comparator"></div>
      </div>
    </div>
    <jupiter-icon />
  </div>
</template>

<script>
// file needs rework in order to create more dynamic web solution. Passed a planet, we want do more than just shit it onto the website. We want to:
// 1. Calc comparison to planet system
// 2. Have planetary options across the board
// 3. If no radius is passed, a max-sized globe will appear with no comparator options
// if radius is passed, 
  // we'll run the closest; 
  // destructure the jupiter code to be:
   // 1. move radius of exoplanetKM to computed. 
   // 2. save KM radii of planets as data array
   // 3. Refactor display code into a (switch display) method based on planetary button clicks.
import JupiterIcon from "../../assets/planetarySymbols/Jupiter_symbol.svg";
export default {
  props: ["planet"],
  components: {
    JupiterIcon
  },
  data() {
    return {
      comparisonReady: false,
      comparatorDiv: {},
      exoDiv: {},
      comparator: null
    };
  },
  mounted() {
    this.calculateSizeComparison(this.planet);
    this.createDisplayStyle(this.planet);
    console.log(this.comparator);
  },
  methods: {
    calculateSizeComparison(planet) {
      // take the mass of the exoplanet and compare it with familiar orbitals (our planets)

      // first we get the comparison to JUPITER's radius.
      const jupiterRadii = planet.pl_radj;
      if (!jupiterRadii) {
        this.tooltip =
          "There is insufficient data about the radius of this planet to make a projection. Check back later!";
        this.comparator = null;
      } else {
        this.tooltip = null;
        const jupiterRadiusInKM = 71492;
        const exoplanetRadius = jupiterRadiusInKM * jupiterRadii;

        // array of planetary radii in order of distance from the sun.
        const planetaryRadii = [
          2440,
          6052,
          6378,
          3396,
          71492,
          60264,
          25559,
          24764
        ];

        let closestSizeComparison;
        let lowestDiff = 10000000000;
        for (let i = 0; i < planetaryRadii.length; i++) {
          const radiusDifference = Math.abs(
            exoplanetRadius - planetaryRadii[i]
          );
          if (radiusDifference < lowestDiff) {
            lowestDiff = radiusDifference;
            closestSizeComparison = i;
          }
        }

        const comparator = this.closestPlanet(closestSizeComparison);

        this.comparator = comparator;
      }
    },
    createDisplayStyle(planet) {
      // what we need is a more sophisticated check on planet
      // starting with a predestined max width of 800px...

      // if the planets jupiter radii is >1, it's the larger planet and needs to be the basis for the comparison.
      const maxWidth = 200;
      const jupiterRadii = planet.pl_radj;
      const jupiterRadiusInKM = 71492;
      const exoplanetRadius = jupiterRadiusInKM * jupiterRadii;
      if (planet.pl_radj > 1) {
        // just do this.
        const exoplanetDisplay = maxWidth;
        const jupiterDisplay = Math.floor(
          (maxWidth * jupiterRadiusInKM) / exoplanetRadius
        );
        this.comparatorDiv = {
          width: `${jupiterDisplay}px`,
          height: `${jupiterDisplay}px`,
          borderRadius: "50%",
          backgroundImage:
            "url('https://www.jpl.nasa.gov/spaceimages/images/largesize/PIA19643_hires.jpg')",
          backgroundSize: "cover"
        };
        this.exoDiv = {
          width: `${exoplanetDisplay}px`,
          height: `${exoplanetDisplay}px`,
          borderRadius: "50%"
        };
      } else {
        // just do this.
        const jupiterLargerDisplay = maxWidth;
        const exoplanetSmallerDisplay = Math.floor(
          (maxWidth * exoplanetRadius) / jupiterRadiusInKM
        );

        this.comparatorDiv = {
          width: `${jupiterLargerDisplay}px`,
          height: `${jupiterLargerDisplay}px`,
          borderRadius: "50%",
          backgroundImage:
            "url('https://www.jpl.nasa.gov/spaceimages/images/largesize/PIA19643_hires.jpg')",
          backgroundSize: "cover"
        };

        this.exoDiv = {
          width: `${exoplanetSmallerDisplay}px`,
          height: `${exoplanetSmallerDisplay}px`,
          borderRadius: "50%"
        };
      }

      this.comparisonReady = true;
    },
    closestPlanet(closest) {
      switch (closest) {
        case 0:
          return "mercury";
        case 1:
          return "venus";
        case 2:
          return "earth";
        case 3:
          return "mars";
        case 4:
          return "jupiter";
        case 5:
          return "saturn";
        case 6:
          return "uranus";
        case 7:
          return "neptune";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.planet {
  background: white;
  background-size: cover;
  box-shadow: inset 7px 0 20px 0px rgba(0, 0, 0, 1);
  transform-style: preserve-3d;
  background-image: -webkit-linear-gradient(
    -45deg,
    rgba(255, 255, 220, 0.3) 0%,
    transparent 100%
  );
  background-image: -moz-linear-gradient(
    -45deg,
    rgba(255, 255, 220, 0.3) 0%,
    transparent 100%
  );
  background-image: -o-linear-gradient(
    -45deg,
    rgba(255, 255, 220, 0.3) 0%,
    transparent 100%
  );
  background-image: -ms-linear-gradient(
    -45deg,
    rgba(255, 255, 220, 0.3) 0%,
    transparent 100%
  );
}

.atmos {
  display: inline-block;
  border-radius: 50%;
  box-shadow: 0 0 15px 7.5px #95c6fea1;
}

.planetary-box {
  display: inline-block;
  width: 200px;
  height: 200px;
  border: 1px black solid;
  padding: 2em;
}
</style>