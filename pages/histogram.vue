<template>
  <div>
    <h1>Histogram</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { json } from 'd3-fetch';
import { createDimensions } from '~/assets/lib/utils';

export default Vue.extend({
  data: () => ({
    dataUrl:
      'https://raw.githubusercontent.com/chrisvaillancourt/d3-examples/master/src/data/nyc_weather_data.json',
    chartData: null,
    customDimensions: {
      width: 0,
      height: 0,
      margin: {
        top: 30,
        right: 10,
        bottom: 50,
        left: 50,
      },
    },
  }),
  computed: {
    dimensions() {
      return createDimensions(this.customDimensions);
    },
  },
  mounted() {
    this.calcCustomDimensions();
    window.addEventListener('resize', this.handleResize);
    this.fetchData().catch(console.error);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    async fetchData(): Promise<void> {
      const data = await json(this.dataUrl);
      this.chartData = data;
    },
    calcCustomDimensions(): void {
      const width = window.innerWidth < 600 ? window.innerWidth : 600;
      this.customDimensions.width = width;
      this.customDimensions.height = width * 0.6;
    },
    handleResize(): void {
      this.calcCustomDimensions();
    },
  },
});
</script>
