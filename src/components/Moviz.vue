<template>
  <div class="container">
  <div class="d-flex justify-content-start">
    <!-- <button class="btn btn-primary" @click="fetchData">upload</button> -->
    <div class="button-spacing"></div> <!-- 添加间距 -->
    <select v-model="selectedOption" @change="fetchData" class="my-select">
      <option v-for="option in options" :value="option.value" :key="option.value">
        {{ option.text }}
      </option>
    </select>
    <button class="btn btn-primary" @click="downloadSVG" >download</button>
  </div>
    <div class="row">
      <div id="svg-container" :style="blockStyle">
        <!-- <div class="svg-container" v-if="svgData" v-html="svgData"></div> -->
        <svg id="mainsvg" width="2000" height="2000"></svg>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';
import { getBoxLayout } from '../utils/layout';
import { drawBox } from '../utils/drawBox';

export default {
  data() {
    return {
      blockStyle: {
        backgroundColor: 'rgba(255, 255, 120, 0.5)',
        height: '90vh',
        width: '100%',
      },
      selectedOption: null,
      options: [
        { text: 'fun1', value: 'https://raw.githubusercontent.com/ml4ai/skema/main/data/gromet/python/fun1/FN_0.1.6/fun1--Gromet-FN-auto.json' },
        { text: 'fun4', value: 'https://raw.githubusercontent.com/ml4ai/skema/main/data/gromet/python/fun4/FN_0.1.6/fun4--Gromet-FN-auto.json' },
        { text: 'exp1', value: 'https://raw.githubusercontent.com/ml4ai/skema/main/data/gromet/python/exp1/FN_0.1.6/exp1--Gromet-FN-auto.json' },
        { text: 'exp2', value: 'https://raw.githubusercontent.com/ml4ai/skema/main/data/gromet/python/exp2/FN_0.1.6/exp2--Gromet-FN-auto.json' },
        { text: 'exp3', value: 'https://raw.githubusercontent.com/ml4ai/skema/main/data/gromet/python/exp3/FN_0.1.6/exp3--Gromet-FN-auto.json' },
        { text: 'assign_operator1', value: 'https://raw.githubusercontent.com/ml4ai/skema/main/data/gromet/python/assign_operator1/FN_0.1.6/assign_operator1--Gromet-FN-auto.json' },
      ],
    };
  },
  methods: {
    fetchData() {
      d3.selectAll('g').remove();
      axios.get(this.selectedOption)
        .then((response) => {
          // const svgContainer = d3.select('#svg-container');
          // const containerWidth = parseInt(svgContainer.style('width'), 1000);
          // const containerHeight = parseInt(svgContainer.style('height'), 1000);
          // const svg = d3.select('svg');
          // svg.attr('width', containerWidth);
          // svg.attr('height', containerHeight);
          const jsonData = response.data;
          const graphData = jsonData.modules[0];
          const fn0 = graphData.fn;
          const fnS = graphData.fn_array;
          // eslint-disable-next-line
          console.log(fn0);
          // eslint-disable-next-line
          console.log(fnS);
          const layout = getBoxLayout(fn0);
          drawBox(layout, fnS, 0);
          // const G = getLayout();
          // eslint-disable-next-line
          // console.log(layout);
          // const svgString = response.data;
          // getLayout(svgString);
          // this.svgData = svgString;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    downloadSVG() {
      // 获取 SVG 元素
      const svgElement = document.getElementById('mainsvg');
      // 获取 SVG 的内容
      const svgData = new XMLSerializer().serializeToString(svgElement);
      // 创建一个 Blob 对象
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      // 创建一个指向 Blob 的 URL
      const svgUrl = URL.createObjectURL(svgBlob);
      // 创建一个链接并通过该链接下载 SVG 文件
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'mainsvg.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
  },
};
</script>

<style scoped>
.svg-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.my-select {
    /* 下拉框的样式 */
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-right: 20px; /* 这将在下拉框和其他元素之间添加一些间距 */
}
</style>
