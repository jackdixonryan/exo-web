<template>
  <div id="main">
    <h1 v-if="loading">Loading...</h1>
    <div v-else>
      <div class="buttons">
        <button
          @click="
            exoplanet = null;
            exoDiv = null;
            loading = true;
            getRandomPlanet();
          "
        >
          Get Next World
        </button>
      </div>
      <h1>{{ exoplanet.pl_name }}</h1>
      <p>{{ exoplanet.pl_radj }}</p>
      <p>{{ exoplanet.st_dist }} parsecs away</p>
      {{ tooltip }}
      <size-display :planet="exoplanet" v-if="exoplanet"/>      
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ships from "../utils/ships";
import SizeDisplay from "../components/exoplanet/SizeDisplay";

export default {
  components: {
    SizeDisplay
  },
  data() {
    return {
      exoplanet: null,
      loading: true,
      comparisonReady: false,
      exoDiv: null,
      comparatorDiv: null,
      shipVoyages: null,
      tooltip: null
    };
  },
  async mounted() {
    await this.getRandomPlanet();
    this.travelTimes();
    // await this.getDataEnrichment();
    // console.log(this.dataEnrichment);
  },
  computed: {
    terrain() {
      if (this.exoplanet) {
        const jupiterRadiusInKM = 71492;
        const planetRadj = this.exoplanet.pl_radj;
        const exoplanetKMRadius = jupiterRadiusInKM * planetRadj;
        // Kepler 138d is the smallest gaseous exoplanet.
        const smallestGaseousPlanetRadiusKM = 10703.28;
        // while Gliese 436 c is likely the largest rocky planet
        const largestRockyPlanetRadiusKM = 9556.5;
        if (exoplanetKMRadius <= largestRockyPlanetRadiusKM) {
          return `Rocky`;
        } else if (exoplanetKMRadius >= smallestGaseousPlanetRadiusKM) {
          return `Gas`;
        } else {
          return `Unknown`;
        }
      }
    }
  },
  methods: {
    async getRandomPlanet() {
      const url = "http://localhost:9090";
      const query = `
      {
        randomExoplanet { 
          pl_name,
          st_dist,
          pl_radj
        }
      }
      `
      const request = await axios.post(url, { "query": query });
      const exoplanet = request.data.data.randomExoplanet;
      this.exoplanet = exoplanet;
      this.loading = false;
    },
    calculateDistanceComparsion(planet) {},
    calculateGravityComparison() {},
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
    },
    async getDataEnrichment() {
      try {
        if (this.exoplanet) {
          const req = await axios.get(
            `http://localhost:9090/expolanets/${this.exoplanet.pl_name}/enrichment`
          );
          this.dataEnrichment = req.data;
        }
      } catch (error) {
        this.dataEnrichment = error.stack
        return error;
      }
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
</style>
