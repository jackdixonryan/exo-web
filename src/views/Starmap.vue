<template>
  <div>
    <div id="selection" @click="goToPlanet">
      <h1>
        Selected:
        <span class="green">{{ selected.pl_name }}</span>
      </h1>
      <ul>
        <li v-if="selected.pl_radj">Radius Known</li>
        <li v-if="selected.pl_bmassj">Mass Known</li>
      </ul>
    </div>
    <div id="map">
      <div id="earth"></div>
      <!-- <div class="planet" :style="calculatePosition(testPlanet)"></div>
    <div class="planet" :style="calculatePosition(secondPlanet)"></div>
      <div class="planet" :style="calculatePosition(thirdPlanet)"></div>-->
      <div
        v-for="planet in planets"
        class="planet"
        :style="`top:${planet.st_dist}px;left:${planet.left}%`"
        :name="planet.pl_name"
        @click="selected=planet"
      ></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  // so, under the assumption that EARTH is center, that declination can serve as a way to position items in VIEW around it, and parsecs to serve as distance, can we do this?
  data() {
    return {
      planets: [],
      selected: ""
    };
  },
  async mounted() {
    await this.getPlanets();
  },
  methods: {
    async getPlanets() {
      try {
        const url = "https://exo-online.herokuapp.com";
        const query = `
        {
          exoplanets { 
            pl_name
            pl_hostname
            pl_radj
            pl_bmassj
            st_dist
            dec
          }
        }
        `;
        const request = await axios.post(url, { query: query });
        const planets = request.data.data.exoplanets;
        const uniqueStarSystems = [];
        const finalPlanets = [];
        for (let i = 0; i < planets.length; i++) {
          if (!uniqueStarSystems.includes(planets[i].pl_hostname)) {
            uniqueStarSystems.push(planets[i].pl_hostname);
            planets[i].left = this.randomLeft();
            finalPlanets.push(planets[i]);
          }
        }
        this.planets = finalPlanets;
      } catch (error) {
        console.log(error);
      }
    },
    randomLeft() {
      const left = [
        0,
        5,
        10,
        15,
        20,
        25,
        30,
        35,
        40,
        45,
        50,
        55,
        60,
        65,
        70,
        75,
        80,
        85,
        90,
        95
      ];
      const random = left[Math.floor(Math.random() * left.length)];
      return random;
    },
    goToPlanet() {
      const name = this.selected.pl_name.split(" ").join("");
      this.$router.push(`/exoplanets/planet/${name}`);
    }
  }
};
</script>

<style lang="scss" scoped>
#earth {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: relative;
  background-color: #21ce99;
  left: 50%;
}
.planet {
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
}
#map {
  padding-top: 5em;
  height: 8500px;
}

#selection {
  position: fixed;
  top: 85vh;
  width: 100%;
  text-align: center;
  margin: 1em;
  -webkit-box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.01),
    0 3px 24px rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.01), 0 3px 24px rgba(0, 0, 0, 0.6);
  margin: 0 auto;
  padding: 1em;
  background: #1b1b1d;
  z-index: 100;
  h1 {
    margin: 0;
  }
  cursor: pointer;
  &:hover {
    background-color: #21ce99;
    color: #1b1b1d;
    .green {
      color: white;
    }
  }
}

.green {
  color: #21ce99;
}
</style>
