<template>
  <div id="main">
    <h1 v-if="loading">Loading...</h1>
    <div v-else>
      <div class="buttons">
        <button @click="exoplanet=null;loading=true;getRandomPlanet">Get Next World</button>
      </div>
      <h1>{{ exoplanet.pl_name }}</h1>
      <p>{{ exoplanet.pl_radj }}</p>
      <p>{{ exoplanet.st_dist }} parsecs away</p>
      {{ tooltip }}
      <div v-if="comparisonReady" class="display">
        <div class="planetary-box">
          <div :style="exoDiv" class="planet"></div>
        </div>
        <div class="planetary-box">
          <div :style="comparatorDiv" class="planet" id="comparator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ships from "../utils/ships";
export default {
  data() {
    return {
      exoplanet: null,
      loading: true, 
      comparisonReady: false,
      exoDiv: null,
      comparatorDiv: null,
      shipVoyages: null,
      tooltip: null,
    };
  },
  async mounted() {
    await this.getRandomPlanet();
    this.calculateSizeComparison(this.exoplanet);
    this.createDisplayStyle(this.exoplanet);
    this.travelTimes();
  },
  methods: {
    async getRandomPlanet() {
      const url = "http://localhost:9090/exoplanets/random";
      const request = await axios.get(url);
      const exoplanet = request.data.exoplanet;
      this.exoplanet = exoplanet;
      this.loading = false;
    },
    calculateSizeComparison(planet) {
      // take the mass of the exoplanet and compare it with familiar orbitals (our planets)

      // first we get the comparison to JUPITER's radius.
      const jupiterRadii = planet.pl_radj;
      if (!jupiterRadii) {
        this.tooltip="There is insufficient data about the radius of this planet to make a projection. Check back later!";
      }
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
        const radiusDifference = Math.abs(exoplanetRadius - planetaryRadii[i]);
        console.log(
          `exoplanet has radius ${exoplanetRadius} where comparator has radius ${planetaryRadii[i]}`
        );
        if (radiusDifference < lowestDiff) {
          console.log(`This makes ${planetaryRadii[i]} the closest match`);
          lowestDiff = radiusDifference;
          closestSizeComparison = i;
        }
      }
      console.log({ closestSizeComparison });
      const closestPlanet = function(closest) {
        switch (closest) {
          case 0:
            return "MERCURY";
          case 1:
            return "venus";
          case 2:
            return "earth";
          case 3:
            return "mars";
          case 4:
            return "Jupiter";
          case 5:
            return "saturn";
          case 6:
            return "uranus";
          case 7:
            return "Neptune";
        }
      };

      const comparator = closestPlanet(closestSizeComparison);

      console.log(
        `We calculate that the closest sized planet to this exoplanet is ${comparator}, as this exoplanet is ${exoplanetRadius}km in radius and ${comparator} is ${planetaryRadii[closestSizeComparison]}km in radius..`
      );
    },
    calculateDistanceComparsion(planet) {},
    calculateGravityComparison() {},
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
    changeComparator(comparator) {
      if (comparator === "earth") {
        const earthRadiusInKM = 6378;
        const earthDisplay = Math.floor((800 * earthRadiusInKM) / 100000);
        this.comparatorDiv = {
          width: `${earthDisplay}px`,
          height: `${earthDisplay}px`,
          borderRadius: "50%",
          backgroundImage:
            "url('https://www.mapsinternational.com/pub/media/catalog/product/cache/892c3686b2fdb93e5f7202d739a3a7e6/s/a/satellite-map-of-the-world_wm00875.jpg')",
          backgroundSize: "cover"
        };
      } else if (comparator === "jupiter") {
        const jupiterRadiusInKM = 71492;
        const jupiterDisplay = Math.floor((800 * jupiterRadiusInKM) / 100000);
        this.comparatorDiv = {
          width: `${jupiterDisplay}px`,
          height: `${jupiterDisplay}px`,
          borderRadius: "50%",
          backgroundImage:
            "url('https://www.jpl.nasa.gov/spaceimages/images/largesize/PIA19643_hires.jpg')",
          backgroundFill: "cover"
        };
      }
    },
    travelTimes() {
      const vm = this;
      this.shipVoyages = {
        lightSpeed: ships.lightSpeedVoyager.minimumTimeToReach(
          vm.exoplanet.st_dist
        ),
        solidFuelRocket: ships.solidFuelRocket.minimumTimeToReach(
          vm.exoplanet.st_dist
        ),
        ionThruster: ships.ionThruster.minimumTimeToReach(vm.exoplanet.st_dist),
        monopropellantRocket: ships.monopropellantRocket.minimumTimeToReach(
          vm.exoplanet.st_dist
        ),
        hallEffectThruster: ships.hallEffectThruster.minimumTimeToReach(
          vm.exoplanet.st_dist
        ),
        liquidFuelRocket: ships.liquidFuelRocket.minimumTimeToReach(
          vm.exoplanet.st_dist
        )
      };
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  color: #21ce99;
}
p {
  color: white;
}
.display {
  width: 80%;
  margin: 0 auto;
  display: grid;
  grid-template-areas: "planet planet";
}
.planet {
  background: gray;
}

.atmos {
  width: 300px;
  height: 300px;
  position: relative;
  margin: 3em auto;
  border-radius: 50%;
  box-shadow: 0 0 15px 7.5px #95c6fe;
}

.planetary-box {
  display: inline-block;
  width: 200px;
  height: 200px;
  border: 1px black solid;
  padding: 2em;
}
</style>
