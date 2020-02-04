<template>
  <div id="main">
    <h1 v-if="loading">Loading...</h1>
    <div v-else>
      <!-- <div class="buttons">
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
      </div>-->
      <div id="main-info-box">
        <h1>{{exoplanet.pl_name}}</h1>
        <div id="information">
          <p class="information-bit">
            Size:
            <span class="green" v-if="exoplanet.pl_radj">{{exoplanet.pl_radj}} Jupiter Radii</span>
            <span class="green" v-else>Unknown</span>
          </p>
          <p class="information-bit">
            Distance:
            <span class="green">{{exoplanet.st_dist}} Parsecs</span>
          </p>
          <p class="information-bit">
            Planets In System:
            <span class="green">
              {{exoplanet.pl_pnum}}
              <span v-if="exoplanet.pl_num === 1">Planet</span>
              <span v-else>Planets</span>
            </span>
          </p>
          <p class="information-bit">
            Mass:
            <span
              class="green"
              v-if="exoplanet.pl_bmassj"
            >{{exoplanet.pl_bmassj}} Jupiter Masses</span>
            <span class="green" v-else>Unknown</span>
          </p>
          <p class="information-bit">
            <span class="green" v-if="earthGs">{{earthGs}}</span>
            <span class="green" v-else>Unknown</span> Earth Gravity
          </p>
          <p class="information-bit">
            Habitable:
            <span class="green">{{habitable}}</span>
          </p>
        </div>
      </div>
      {{ tooltip }}
      <size-display :planet="exoplanet" v-if="exoplanet && exoplanet.pl_radj" />
    </div>
    <habitability :planet="exoplanet" v-if="exoplanet"/>
  </div>
</template>

<script>
import axios from "axios";
import ships from "../utils/ships";
import gravity from "../utils/phys/gravity";
import SizeDisplay from "../components/exoplanet/SizeDisplay";
import Habitability from "../components/exoplanet/Habitability";
export default {
  components: {
    SizeDisplay,
    Habitability,
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
    await this.getPlanet();
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
    },
    earthGs() {
      if (this.exoplanet && this.exoplanetMeterRadius && this.exoplanetMassKG) {
        const earthGravity = gravity.calculateGravity(5.972e24, 6.371e6);
        const exoplanetGravity = gravity.calculateGravity(
          this.exoplanetMassKG,
          this.exoplanetMeterRadius
        );
        const earthG = gravity.compareGravity(earthGravity, exoplanetGravity);
        if (earthG > 1) {
          return `${earthG.toFixed(2)} X`;
        }
        return `${(earthG * 100).toFixed(2)}%`;
      }
    },
    exoplanetMeterRadius() {
      if (this.exoplanet) {
        const jupiterRadiusInM = 6.6854e7;
        const exoplanetRadius = jupiterRadiusInM * this.exoplanet.pl_radj;
        return exoplanetRadius;
      }
    },
    exoplanetMassKG() {
      if (this.exoplanet) {
        const jupiterMassInKG = 1.898e27;
        const exoplanetMass = jupiterMassInKG * this.exoplanet.pl_bmassj;
        return exoplanetMass;
      }
    },
    habitable() {
      const earthGravity = gravity.calculateGravity(5.972e24, 6.371e6);
      const exoplanetGravity = gravity.calculateGravity(
        this.exoplanetMassKG,
        this.exoplanetMeterRadius
      );
      const earthG = gravity.compareGravity(earthGravity, exoplanetGravity);
      let isHabitable = false;
      let caveat;
      if (earthG < 4) {
        isHabitable = true;
      }

      if (this.terrain === "Gas") {
        caveat = "(Likely Gas Planet)"
      } 
      if (isHabitable === true) {
        return `Possibly ` + caveat;
      } else {
        return `No`;
      }
    }
  },
  methods: {
    async getPlanet() {
      console.log(this.$route.params);
      const planetName = this.$route.params.exoplanet;
      const url = "http://localhost:9090";
      const query = `
      {
        exoplanet(name: "${planetName}") { 
          pl_name
          st_dist
          pl_radj
          pl_pnum
          pl_bmassj
          pl_orbsmax
          st_teff
          st_rad
          st_mass
        }
      }
      `;
      console.log(query);
      const request = await axios.post(url, { query: query });
      const exoplanet = request.data.data.exoplanet;
      this.exoplanet = exoplanet;
      this.loading = false;
    },
    calculateDistanceComparsion(planet) {},
    calculateGravityComparison() {},
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
        this.dataEnrichment = error.stack;
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
#main-info-box {
  height: 200px;
  width: 90%;
  -webkit-box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.01),
    0 3px 24px rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.01), 0 3px 24px rgba(0, 0, 0, 0.6);
  margin: 0 auto;
  padding: 1em;
}

#information {
  display: flex;
  flex-wrap: wrap;
}

#information p {
  flex: 1 0 26%; /* explanation below */
}

.green {
  color: #21ce99;
}
</style>
