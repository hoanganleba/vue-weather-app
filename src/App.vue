<template>
  <div class="flex justify-center mt-12">
    <div class="glass-box">
      <div v-if="gettingLocation">Getting Location...</div>
      <div v-if="weatherData">
        <h1 class="text-4xl text-center font-light">{{ weatherData.name }}</h1>
        <p class="mt-2 text-lg text-center font-light">
          {{
            capitalizeTheFirstLetterOfEachWord(
              weatherData.weather[0].description
            )
          }}
        </p>
        <div
          class="mt-3 text-8xl text-center font-thin"
          @click="isCelsius = !isCelsius"
        >
          {{ tempConverter(weatherData.main.temp) }}<sup class="text-6xl">
            <sup>o</sup>
            <span v-if="isCelsius">C</span>
            <span v-else>F</span>
          </sup>
        </div>
        <div class="font-light mt-6 space-x-6 flex justify-center text-lg">
          <span>Highest: {{tempConverter(weatherData.main.temp_max)}}<sup>o</sup></span>
          <span>Lowest: {{tempConverter(weatherData.main.temp_min)}}<sup>o</sup></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import weatherApi from "./weatherApi";

export default {
  data() {
    return {
      weatherData: null,
      gettingLocation: false,
      isCelsius: true,
    };
  },
  created() {
    this.getWeatherData();
  },
  methods: {
    async getLocation() {
      return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
          reject(new Error("Geolocation is not available."));
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve(pos);
          },
          (err) => {
            reject(err);
          }
        );
      });
    },

    async getWeatherData() {
      this.gettingLocation = true;
      try {
        const location = await this.getLocation();
        const latitude = location.coords.latitude;
        const longtitude = location.coords.longitude;
        const { data } = await weatherApi.getWeatherData(latitude, longtitude);

        this.weatherData = data;
        console.log(this.weatherData);
        this.gettingLocation = false;
      } catch (err) {
        this.gettingLocation = false;
        console.log(err);
      }
    },

    tempConverter(celsius) {
      if (this.isCelsius) {
        return celsius;
      }
      return Math.floor(celsius * 1.8 + 32);
    },

    capitalizeTheFirstLetterOfEachWord(words) {
      const separateWord = words.split(" ");
      for (let i = 0; i < separateWord.length; i++) {
        separateWord[i] =
          separateWord[i].charAt(0).toUpperCase() +
          separateWord[i].substring(1);
      }
      return separateWord.join(" ");
    },
  },
};
</script>

<style lang="postcss">
body {
  @apply bg-no-repeat bg-cover;
  background-image: url("./assets/sunny-day-1.jpg");
}

.glass-box {
  @apply overflow-hidden relative py-12 px-16 bg-white bg-opacity-10 rounded-xl text-white shadow-sm;
  backdrop-filter: blur(5px);
}
</style>