<template>
  <div class="card" v-if="planet.st_mass && planet.pl_orbsmax">
    <h1>Habitability</h1>
    <p v-for="note in habitabilityNotes">{{ note }}</p>
    <input type="range" min="0" max="400" v-model="atmosphere" />
    <button @click="atmosphere = 10e-14">☿</button>
    <button @click="atmosphere = 90">♀</button>
    <button @click="atmosphere = 1">♁</button>
    <button @click="atmosphere = 0.006">♂</button>
    <button @click="atmosphere = 1000">♃</button>
    <button @click="atmosphere = 1000">♄</button>
    <button @click="atmosphere = 1000">⛢</button>
    <button @click="atmosphere = 1000">♆</button>
  </div>
  <div v-else>
    Insufficient Data
  </div>
</template>

<script>
import habitable from "../../utils/phys/habitable";
export default {
  props: ["planet"],
  data() {
    return {
      habitabilityNotes: null,
      atmosphere: 0
    };
  },
  watch: {
    atmosphere(val) {
      this.habitabilityNotes = [];
      this.habitabilityNotes = habitable(
        this.planet.st_mass,
        this.planet.pl_orbsmax,
        27,
        parseInt(val)
      );
    },
    habitabilityNotes(val) {}
  },
  mounted() {
    // passing it no greenhouse (eg, no atmosphere)
    // same albedo as earth
    console.log('mounted')
    try {
      this.habitabilityNotes = habitable(
        this.planet.st_mass,
        this.planet.pl_orbsmax,
        27,
        0
      );
      console.log(this.habitabilityNotes);
    } catch (error) {
      return error;
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  width: 90%;
  -webkit-box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.01),
    0 3px 24px rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.01), 0 3px 24px rgba(0, 0, 0, 0.6);
  margin: 0 auto;
  padding: 1em;
}
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #4caf50;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #4caf50;
  cursor: pointer;
}
</style>