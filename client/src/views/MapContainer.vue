<template>
  <div class="full" >
    <Sidebar @rests="onRests" @center="onLocation"/>
    <Map v-bind:rests="rests" v-bind:center="center"/>
  </div>
</template>

<script>
import Map from '../components/Map.vue';
import Sidebar from '../components/Sidebar.vue';

export default {
  components: {
    Map,
    Sidebar
  },
  data () {
    return {
      rests: [],
      center: {
        latitude: 38.9072,
        longitude: -77.0369
      }
    }
  },
  methods: {
    onRests: function(rs){
      this.rests = rs.map(r => r.restaurant);
    },
    onLocation: function(loc){
      this.center.latitude = loc.latitude;
      this.center.longitude = loc.longitude;
    }

  }
};
</script>

