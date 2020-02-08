<template>
  <div class="card" v-if="planet.st_mass && planet.pl_orbsmax">
    <h1 id="title">Habitability</h1>
    <div class="notes">
      <p v-for="note in habitabilityNotes">{{ note }}</p>
    </div>
    <input type="range" min="0" max="400" v-model="atmosphere" class="slider" />
    <div class="slider-buttons">
      <button @click="atmosphere = 10e-14">☿</button>
      <button @click="atmosphere = 90">♀</button>
      <button @click="atmosphere = 1">♁</button>
      <button @click="atmosphere = 0.006">♂</button>
      <button @click="atmosphere = 1000">♃</button>
      <button @click="atmosphere = 1000">♄</button>
      <button @click="atmosphere = 1000">⛢</button>
      <button @click="atmosphere = 1000">♆</button>
    </div>
    <div
      class="atmos"
      :style="`display: inline-block;border-radius: 50%;box-shadow: 0 0 ${min}px ${atmosphere / 20}px #95c6fea1;height: 5em;width: 5em;`"
    >
      <div class="planet" id="habitability-display"></div>
    </div>
  </div>
  <div v-else>Insufficient Data</div>
</template>

<script>
import habitable from "../../utils/phys/habitable";
export default {
  props: ["planet"],
  data() {
    return {
      habitabilityNotes: null,
      atmosphere: 0,
      temp: null,
      color: null,
      min: 0
    };
  },
  watch: {
    atmosphere(val) {
      if (val === 0) {
        this.min = 0;
      } else {
        this.min = 20;
      }
      this.habitabilityNotes = [];
      const habitability = habitable(
        this.planet.st_mass,
        this.planet.pl_orbsmax,
        27,
        parseInt(val)
      );
      this.habitabilityNotes = habitability.notes;
      this.temp = habitability.temp;
    },
    temp(val) {
      const planet = document.getElementById("habitability-display");
      switch (val) {
        case "cold":
          planet.style.backgroundColor = "#a5f2f3";
          break;
        case "temperate":
          planet.style.backgroundColor = "#21ce99";
          break;
        case "hot":
          planet.style.backgroundColor = "#f45531";
          break;
      }
    },
    habitabilityNotes(val) {}
  },
  mounted() {
    // passing it no greenhouse (eg, no atmosphere)
    // same albedo as earth
    try {
      const habitability = habitable(
        this.planet.st_mass,
        this.planet.pl_orbsmax,
        27,
        parseInt(val)
      );
      this.habitabilityNotes = habitability.notes;
      this.temp = habitability.temp;
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
  padding: 1em;
  display: grid;
  grid-template-areas:
    "title . ."
    "notes slider slider-buttons"
    "notes . planet";
}

.notes {
  grid-area: notes;
  height: 156px;
  width: 250px;
}

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
  height: 100%;
  width: 100%;
  border-radius: 50%;
  transition: background-color 2s ease;
}

.atmos {
  grid-area: planet;
  display: inline-block;
  border-radius: 50%;
  /* box-shadow: 0 0 15px 7.5px #95c6fea1; */
  height: 5em;
  width: 5em;
  transition: box-shadow 2s ease;
  margin: 2em;
}
</style>