<template>
  <div class="main" id="map"></div>
</template>

<script>
export default {
  props: ["rests", "center"],
  data() {
    return {
      map: null,
      markerLayer: null
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap: function() {
      this.map = L.map("map").setView(
        [this.center.latitude, this.center.longitude],
        13
      );
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v8",
          accessToken:
            "pk.eyJ1IjoiYXZlbmthNjc5NCIsImEiOiJjamZsMnE3ZXEwZGhlMnhzMnBvcmxlcTFjIn0.LmZIpidxC8vvC7MAiY0g_g"
        }
      ).addTo(this.map);

      this.markerLayer = L.layerGroup().addTo(this.map);
    }
  },
  watch: {
    rests: function(newR, old) {
      this.markerLayer.clearLayers();
      newR.forEach(r => {
        let { latitude, longitude, address } = r.location;
        let m = L.marker([latitude, longitude]).addTo(this.markerLayer);
        m.bindPopup(`<b>${r.name}</b><br/>${address}`);
      });
    },
    center: {
      handler: function(loc, old) {
        this.map.setView([loc.latitude, loc.longitude]);
      },
      deep: true
    }
  }
};
</script>

<style>
.main {
  margin-left: 35%;
  height: 100%;
  padding: 10px;
  background-color: #f0f0f0;
}
</style>