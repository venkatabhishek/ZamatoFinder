<template>
  <div class="sidebar">
    <div class="head">
      <div class="input-wrapper">
        <input
          v-model="q"
          v-on:input="search"
          v-on:focus="toggle(true)"
          class="search"
          type="text"
          placeholder="Washington DC, New York City, ..."
        />
        <button @click="locateMe" class="locate-btn">Locate Me</button>
        <div class="results" v-if="showResults">
          <div
            class="result"
            v-for="(result, index) of results"
            @click="update(index)"
            v-bind:key="index"
          >{{ result.display_name }}</div>
        </div>
      </div>
    </div>

    <div class="options">
      <div class="loader" v-if="optionsLoader">Loading...</div>
      <div class="options-body" v-if="optionsBody">
        <div class="select-wrapper">
          <select v-model="selectedCollections">
            <option disabled value>Select a collection</option>
            <option
              v-for="(c, index) in collections"
              v-bind:key="index"
              v-bind:value="c.collection"
            >{{ c.collection.title }}</option>
          </select>
          <select v-model="selectedCuisines" multiple>
            <option disabled value>Select cuisines</option>
            <option
              v-for="(c, index) in cuisines"
              v-bind:key="index"
              v-bind:value="c"
            >{{ c.cuisine.cuisine_name }}</option>
          </select>
          <select v-model="selectedEstablishments">
            <option disabled value>Select an establishment</option>
            <option
              v-for="(c, index) in establishments"
              v-bind:key="index"
              v-bind:value="c.establishment"
            >{{ c.establishment.name }}</option>
          </select>
        </div>
        <input type="text" v-model="keywords" class="keywords" placeholder="Pizza, tacos, ..." />
        <button @click="zamato" class="go-btn">GO</button>
      </div>
    </div>

    <div class="rests">
      <div class="loader" v-if="finalLoader">Loading...</div>
      <div class="final-body" v-if="finalBody">
        <div v-for="(r, index) in rests" v-bind:key="index" class="r-box">
          <h3>{{ r.restaurant.name }}</h3>
          <p>{{ r.restaurant.location.address }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      q: "",
      location: {},
      results: [],
      showResults: false,
      optionsLoader: false,
      optionsBody: false,
      finalLoader: false,
      finalBody: false,
      cuisines: [],
      collections: [],
      establishments: [],
      selectedCuisines: [],
      selectedCollections: "",
      selectedEstablishments: "",
      keywords: "",
      rests: []
    };
  },
  methods: {
    search: function(event) {
      let v = this.q.trim();
      if (v.length != 0) {
        let _this = this;

        // autocomplete request
        axios
          .get(`/location`, {
            params: {
              q: v
            },
            crossDomain: true
          })
          .then(function(response) {
            _this.results = response.data;
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          })
          .finally(function() {
            _this.toggle(true);
          });
      } else {
        this.showResults = false;
      }
    },
    update: function(idx) {
      let opt = this.results[idx];
      this.q = opt.display_name;
      this.options(opt.lat, opt.lon);
      this.toggle(false);
    },
    toggle: function(state) {
      if ((this.results.length != 0 && state) || !state) {
        this.showResults = state;
      }
    },
    options: function(lat, lon) {
      this.optionsLoader = true;
      this.optionsBody = false;

      let _this = this;

      _this.location = { lat, lon };
      _this.$emit("center", { latitude: lat, longitude: lon });
      axios
        .get(`/options`, {
          params: {
            lat,
            lon
          },
          crossDomain: true
        })
        .then(function(response) {
          let { data } = response;

          _this.collections = data.collections;
          _this.establishments = data.establishments;
          _this.cuisines = data.cuisines;
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        })
        .finally(function() {
          _this.optionsLoader = false;
          _this.optionsBody = true;
        });
    },
    locateMe: function() {
      let _this = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          _this.q = "My location"; // replace with locationiq call
          _this.options(position.coords.latitude, position.coords.longitude);
          _this.toggle(false);
        });
      } else {
        _this.q = "Geolocation is not supported.";
      }
    },
    zamato: function() {
      this.finalLoader = true;
      this.finalBody = false;

      let {
        location,
        selectedCuisines,
        selectedCollections,
        selectedEstablishments,
        keywords
      } = this;

      let raw = {
        ...location,
        cuisines: selectedCuisines.map(c => c.cuisine.cuisine_id).join(","),
        collection_id: selectedCollections.collection_id,
        establishment_type: selectedEstablishments.establishment_id,
        q: keywords
      };

      // sanitizing params
      let params = {};
      Object.keys(raw).forEach(prop => {
        if (raw[prop]) {
          params[prop] = raw[prop];
        }
      });

      let _this = this;

      axios
        .get(`/search`, {
          params,
          crossDomain: true
        })
        .then(function(response) {
          let { data } = response;
          _this.rests = data.restaurants;
          _this.$emit("rests", data.restaurants);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        })
        .finally(function() {
          _this.finalLoader = false;
          _this.finalBody = true;
        });
    }
  }
};
</script>

<style>
.sidebar {
  height: 100%;
  width: 35%;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  padding-top: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.head {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-wrapper {
  width: 80%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search {
  width: 100%;
  height: 50px;
  padding: 10px 20px;
  outline: none;
  border-radius: 8px;
  border: 1px solid #dadce0;
  font-size: 18px;
}

.search:focus {
  border: none;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #dadce0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02);
}

.results {
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.result {
  margin: 5px;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  font-size: 18px;
}

.result:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.options {
  margin-top: 50px;
  width: 100%;
}

.options-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.final-body {
  margin-bottom: 80px;
}

.select-wrapper {
  display: flex;
  flex-direction: column;
  width: 50%;
}

select {
  margin: 10px;
  border: none;
  background: #ececec;
  padding: 10px 40px;
  font-family: "Varela Round", sans-serif;
  font-size: 16px;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
}

option {
  padding: 10px 0px;
}

.keywords {
  width: 60%;
  height: 40px;
  padding: 10px 20px;
  outline: none;
  border-radius: 8px;
  border: 1px solid #dadce0;
  font-size: 18px;
  margin: auto;
  margin-top: 20px;
}

.keywords:focus {
  border: none;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #dadce0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02);
}

.go-btn {
  outline: none;
  border: none;
  margin-top: 20px;
  width: 40%;
  padding: 20px;
  font-family: "Varela Round", sans-serif;
  background: #db4437;
  color: white;
  cursor: pointer;
}

.go-btn:hover {
  background: #af362c;
}

.locate-btn {
  outline: none;
  border: none;
  margin-top: 20px;
  width: 40%;
  padding: 20px;
  font-family: "Varela Round", sans-serif;
  background: #db4437;
  color: white;
  cursor: pointer;
}

.locate-btn:hover {
  background: #af362c;
}

.loader {
  text-align: center;
}
</style>
