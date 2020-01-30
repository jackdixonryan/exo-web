<template>
  <div v-if="comparisonReady" class="size-comparison">
    <div class="planetary-box">
      <div class="atmos">
        <div :style="exoDiv" class="planet"></div>
      </div>
    </div>
    <!-- PLACEHOLDER elements ensure layout does not change on selection -->
    <div class="planet-selector">
      <div class="placeholder" v-show="!selecting"></div>
      <button
        @click="rerender('mercury')"
        class="planet-selection animated fadeIn"
        id="mercury"
        v-if="selecting"
      >
        ☿
      </button>
      <div class="placeholder" v-show="!selecting"></div>
      <button
        @click="rerender('venus')"
        class="planet-selection animated fadeIn"
        id="venus"
        v-show="selecting"
      >
        ♀
      </button>
      <div class="placeholder" v-show="!selecting"></div>
      <button
        @click="rerender('earth')"
        class="planet-selection animated fadeIn"
        id="earth"
        v-show="selecting"
      >
        ♁
      </button>
      <div class="placeholder" v-show="!selecting"></div>
      <button
        @click="rerender('mars')"
        class="planet-selection animated fadeIn"
        id="mars"
        v-show="selecting"
      >
        ♂
      </button>
      <button class="planet-selection" id="none" @click="openSelectionMenu">
        <span v-if="selecting">&Chi;</span>
        <span v-else>&#9776;</span>
      </button>
      <div class="placeholder" v-show="!selecting"></div>
      <button
        @click="rerender('jupiter')"
        class="planet-selection animated fadeIn"
        id="jupiter"
        v-show="selecting"
      >
        ♃
      </button>
      <div class="placeholder" v-show="!selecting"></div>
      <button
        @click="rerender('saturn')"
        class="planet-selection animated fadeIn"
        id="saturn"
        v-show="selecting"
      >
        ♄
      </button>
      <div class="placeholder" v-show="!selecting"></div>
      <button
        @click="rerender('uranus')"
        class="planet-selection animated fadeIn"
        id="uranus"
        v-show="selecting"
      >
        ⛢
      </button>
      <div class="placeholder" v-show="!selecting"></div>
      <button
        @click="rerender('neptune')"
        class="planet-selection animated fadeIn"
        id="neptune"
        v-show="selecting"
      >
        ♆
      </button>
    </div>
    <div class="planetary-box">
      <div class="atmos">
        <div :style="comparatorDiv" class="planet" id="comparator"></div>
      </div>
    </div>
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
      comparator: null,
      selecting: false,
      planetaryInfo: {
        mercury: {
          radius: 2440,
          image:
            "https://stevealbers.net/albers/sos/venus/venus4/venus4_rgb_cyl_www.jpg"
        },
        venus: {
          radius: 6052,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/1/19/Cylindrical_Map_of_Venus.jpg"
        },
        earth: {
          radius: 6378,
          image:
            "https://www.worldmapsonline.com/images/murals/satellite_image/physical_earth_satellite_image_mural_lg.jpg"
        },
        mars: {
          radius: 3396,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/e/ea/Mars_%284997052786%29.jpg"
        },
        jupiter: {
          radius: 71492,
          image:
            "https://www.jpl.nasa.gov/spaceimages/images/largesize/PIA19643_hires.jpg"
        },
        saturn: {
          radius: 60264,
          image:
            "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5938ae9e-47de-424a-8836-f98e6658d37b/dcmx1je-b18f08d6-0632-43da-8152-95348db00c29.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5MzhhZTllLTQ3ZGUtNDI0YS04ODM2LWY5OGU2NjU4ZDM3YlwvZGNteDFqZS1iMThmMDhkNi0wNjMyLTQzZGEtODE1Mi05NTM0OGRiMDBjMjkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.rKv3xScOkdAlHgPGF_vWpPFlTzsGGsWjQ23YS-gma6s"
        },
        uranus: {
          radius: 25559,
          image:
            "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1912b050-3675-4394-a3d1-d0b4cb43ae0a/dc18wwb-e195cd81-efbd-480a-9f51-5100a530683d.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE5MTJiMDUwLTM2NzUtNDM5NC1hM2QxLWQwYjRjYjQzYWUwYVwvZGMxOHd3Yi1lMTk1Y2Q4MS1lZmJkLTQ4MGEtOWY1MS01MTAwYTUzMDY4M2QuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.SL33h8GpzTu_M-WWzxQjyw0osVvDZ-NlEKmLkRLzZA8"
        },
        neptune: {
          radius: 24764,
          image:
            "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5938ae9e-47de-424a-8836-f98e6658d37b/dcq2elx-fb271377-3761-47b9-8a83-3d937f4742f2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU5MzhhZTllLTQ3ZGUtNDI0YS04ODM2LWY5OGU2NjU4ZDM3YlwvZGNxMmVseC1mYjI3MTM3Ny0zNzYxLTQ3YjktOGE4My0zZDkzN2Y0NzQyZjIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.doS0-VBiW1h6idhJNPcrMPzg7Haji3_q3ZEzbcbxdvE"
        }
      }
    };
  },
  mounted() {
    this.calculateSizeComparison(this.planet);
    this.render();
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
    createDisplayStyle(planet, comparatorPlanetRadius) {
      // what we need is a more sophisticated check on planet
      // starting with a predestined max width of 800px...

      // if the planets jupiter radii is >1, it's the larger planet and needs to be the basis for the comparison.
      const maxWidth = 200;
      const jupiterRadii = planet.pl_radj;
      const jupiterRadiusInKM = 71492;
      const exoplanetRadius = jupiterRadiusInKM * jupiterRadii;
      console.log(exoplanetRadius);
      if (exoplanetRadius > comparatorPlanetRadius) {
        // just do this.
        const exoplanetDisplay = maxWidth;
        const comparatorDisplay = Math.floor(
          (maxWidth * comparatorPlanetRadius) / exoplanetRadius
        );
        this.comparatorDiv = {
          width: `${comparatorDisplay}px`,
          height: `${comparatorDisplay}px`,
          borderRadius: "50%",
          backgroundSize: "cover"
        };
        this.exoDiv = {
          width: `${exoplanetDisplay}px`,
          height: `${exoplanetDisplay}px`,
          borderRadius: "50%"
        };
      } else {
        // just do this.
        const comparatorLargerDisplay = maxWidth;
        const exoplanetSmallerDisplay = Math.floor(
          (maxWidth * exoplanetRadius) / comparatorPlanetRadius
        );

        this.comparatorDiv = {
          width: `${comparatorLargerDisplay}px`,
          height: `${comparatorLargerDisplay}px`,
          borderRadius: "50%",
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
    },
    openSelectionMenu() {
      if (this.selecting) {
        this.selecting = false;
      } else {
        this.selecting = true;
      }
    },
    render() {
      this.createDisplayStyle(
        this.planet,
        this.planetaryInfo[this.comparator].radius
      );

      this.$set(
        this.comparatorDiv,
        "backgroundImage",
        `url(${this.planetaryInfo[this.comparator].image})`
      );
      console.log(this.comparator);
    },
    rerender(planet) {
      this.comparisonReady = false;
      this.comparatorDiv = {};
      this.exoDiv = {};
      this.comparator = planet;
      this.render();

      const buttons = document.getElementsByClassName("planet-selection")
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "#182b27";
        buttons[i].style.color="white";
      }

      const button = document.getElementById(planet);
      button.style.backgroundColor = "#21ce99";
      button.style.color = "#303032";

    },
  }
};
</script>

<style lang="scss" scoped>
.size-comparison {
  width: 90%;
  margin: 0 auto;
  display: grid;
  grid-template-areas: "exoplanet buttons comparator";
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
  padding: 2em;
}

.planet-selector {
  display: grid;
  grid-template-areas:
    "mercury venus earth"
    "mars none jupiter"
    "saturn uranus neptune";
  height: 200px;
  width: 200px;
  margin: 1.5em;
}

.planet-selection {
  display: inline-block;
  border-radius: 50%;
  background-color: #182b27;
  color: white;
  font-size: 1.8em;
  height: 1.9em;
  width: 1.9em;
  &:hover {
    background-color: #21ce99;
    color: #303032;
  }
}

.placeholder {
  height: 1.9em;
  width: 1.9em;
  font-size: 1.8em;
  border-radius: 50%;
  display: inline-block;
}

#venus {
  animation-delay: 0.1s;
}

#earth {
  animation-delay: 0.2s;
}

#mars {
  animation-delay: 0.7s;
}

#jupiter {
  animation-delay: 0.3s;
}

#saturn {
  animation-delay: 0.6s;
}

#uranus {
  animation-delay: 0.5s;
}

#neptune {
  animation-delay: 0.4s;
}
</style>
