<template>
  <div>
    <h1>Histogram</h1>
    <svg :viewBox="`0 0 ${dimensions.width} ${dimensions.height}`">
      <g
        class="bounds"
        :style="`transform: translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`"
      >
        <g class="bins">
          <g v-for="(bin, i) in bins" :key="i" class="bin">
            <rect
              class="rect"
              :x="xScale(bin.x0) + barPadding"
              :y="yScale(yAccessor(bin))"
              :height="dimensions.boundedHeight - yScale(yAccessor(bin))"
              :width="getRectWidth(bin)"
            ></rect>
            <text></text>
          </g>
        </g>
        <line class="mean"></line>
        <g
          class="x-axis"
          :style="`transform: translateY(${dimensions.boundedHeight})`"
        >
          <text class="x-axis-label"></text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { json } from 'd3-fetch';
import { scaleLinear } from 'd3-scale';
import { extent, max, histogram, mean } from 'd3-array';
import { createDimensions } from '~/assets/lib/utils';

export default Vue.extend({
  data: () => ({
    dataUrl:
      'https://raw.githubusercontent.com/chrisvaillancourt/d3-examples/master/src/data/nyc_weather_data.json',
    dataset: [],
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
    barPadding: 1,
  }),
  computed: {
    dimensions() {
      return createDimensions(this.customDimensions);
    },
    xScale() {
      return scaleLinear()
        .domain(extent(this.dataset, this.metricAccessor))
        .range([0, this.dimensions.boundedWidth])
        .nice();
    },
    yScale() {
      return scaleLinear()
        .domain([0, max(this.bins, this.yAccessor)])
        .range([this.dimensions.boundedHeight, 0])
        .nice();
    },
    binsGenerator() {
      return histogram()
        .domain(this.xScale.domain())
        .value(this.metricAccessor)
        .thresholds(12);
    },
    bins() {
      return this.binsGenerator(this.dataset);
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
      this.dataset = data;
    },
    calcCustomDimensions(): void {
      const width = window.innerWidth < 600 ? window.innerWidth : 600;
      this.customDimensions.width = width;
      this.customDimensions.height = width * 0.6;
    },
    handleResize(): void {
      this.calcCustomDimensions();
    },
    metricAccessor(d) {
      return d.humidity;
    },
    yAccessor(d) {
      return d.length;
    },
    getRectWidth(bin) {
      return max([
        0,
        this.xScale(bin.x1) - this.xScale(bin.x0) - this.barPadding,
      ]);
    },
  },
});
</script>
<style scoped>
.rect {
  fill: cornflowerblue;
}
</style>
