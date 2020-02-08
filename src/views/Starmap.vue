<template>
  <div>
    <div id="selection" @click="goToPlanet" v-if="selected">
      <h1>
        Selected:
        <span class="green">{{ selected.pl_name }}</span>
      </h1>
      <ul>
        <li v-if="selected.pl_radj">Radius Known</li>
        <li v-if="selected.pl_bmassj">Mass Known</li>
      </ul>
    </div>
    <div id="scroll-to" style="position: fixed;">
      <button @click="skipToParsec(500)">500</button>
      <button @click="skipToParsec(1000)">1000</button>
      <button @click="skipToParsec(1500)">1500</button>
      <button @click="skipToParsec(2000)">2000</button>
      <button @click="skipToParsec(2500)">2500</button>
      <button @click="skipToParsec(3000)">3000</button>
      <button @click="skipToParsec(3500)">3500</button>
      <button @click="skipToParsec(4000)">4000</button>
      <button @click="skipToParsec(4500)">4500</button>
      <button @click="skipToParsec(5000)">5000</button>
      <button @click="skipToParsec(5500)">5500</button>
      <button @click="skipToParsec(6000)">6000</button>
      <button @click="skipToParsec(6500)">6500</button>
    </div>
    <div id="map">
      <div id="earth"></div>
      <div
        class="planet"
        :name="planet.pl_name"
        :key="planet.pl_name"
        v-for="planet in planets"
        :style="`top:${(planet.st_dist * 20) + 100}px;left:${planet.left}%`"
        @click="selected=planet"
      >
        <p class="planet-info">{{planet.st_dist}}</p>
        <p class="planet-info">{{planet.pl_hostname}}</p>
      </div>
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
      const random = Math.floor(Math.random() * 100);
      return random;
    },
    goToPlanet() {
      const name = this.selected.pl_name.split(" ").join("");
      this.$router.push(`/exoplanets/planet/${name}`);
    },
    skipToParsec(parsecs) {
      try {

        const scrollYAmt = (parsecs * 20) + 150;
      
        window.scroll({
          top: scrollYAmt,
          left: 0,
          behavior: 'smooth'
        });

      } catch (error) {
        console.log(error);
        return error;
      }
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
  width: 5px;
  height: 5px;
  background-color: white;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
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

.planet-info {
  white-space: nowrap;
  font-size: 10px;
  margin: 0px;
  position: relative;
  left: 10px;
  bottom: 10px;
}
</style>
