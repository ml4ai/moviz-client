<template>
  <div class="container">
  <div class="d-flex justify-content-start">
    <!-- <button class="btn btn-primary" @click="fetchData">upload</button> -->
    <div class="button-spacing"></div> <!-- 添加间距 -->
    <select v-model="selectedOption" @change="fetchData" class="my-select" placeholder="Select">
      <option v-for="option in options" :value="option.value" :key="option.value">
        {{ option.text }}
      </option>
    </select>
    <div><p> Or </p></div>
    <input type="text" v-model="url" class="url-input" placeholder="Input URL of JSON file here."/>
    <input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      style="display: none;"
    />
    <button class="btn btn-primary" @click="submitUrl">Submit</button>
    <button @click="triggerFileInput">
      Choose File
    </button>
    <button class="btn btn-primary download-button" @click="downloadSVG" >downloadSVG</button>
  </div>
    <div class="row">
      <div id="svg-container" :style="blockStyle">
        <div class="version-text">
          Current Supported Skema Version:
          <span class="highlight">0.1.7</span>
        </div>
        <div class="version-text">
          Current File Version:
          <span class="highlight">{{ skemaVersion }}</span>
        </div>
        <svg id="mainsvg" width="1200" height="1000" overflow="visible">
          <g id="sumGroup"></g>
        </svg>
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
      skemaVersion: '',
      url: '',
      blockStyle: {
        backgroundColor: 'rgba(255, 255, 120, 0)',
        height: '90vh',
        width: '100%',
      },
      selectedFile: null,
      selectedOption: null,
      options: [
        { text: 'Clay1', value: 'https://raw.githubusercontent.com/hconhisway/webcrawler/master/get_beta--Gromet-FN-auto2.json' },
        { text: 'core_dynamics', value: 'https://raw.githubusercontent.com/hconhisway/webcrawler/master/core_dynamics_pack2.json' },
        { text: 'while1', value: 'https://raw.githubusercontent.com/ml4ai/skema/main/data/gromet/python/while1/FN_0.1.6/while1--Gromet-FN-auto.json' },
        { text: 'cond1', value: 'https://raw.githubusercontent.com/hconhisway/webcrawler/master/cond1--Gromet-FN-auto.json' },
        { text: 'fun1', value: 'https://raw.githubusercontent.com/ml4ai/skema/main/data/gromet/python/fun1/FN_0.1.6/fun1--Gromet-FN-auto.json' },
        { text: 'fun4', value: 'https://raw.githubusercontent.com/ml4ai/skema/adarshp/nom_error_handling/data/gromet/python/fun4/FN_0.1.6/fun4--Gromet-FN-auto.json' },
        { text: 'exp1', value: 'https://raw.githubusercontent.com/ml4ai/skema/main/data/gromet/python/exp1/FN_0.1.6/exp1--Gromet-FN-auto.json' },
        { text: 'exp2', value: 'https://gist.githubusercontent.com/jastier/76f7566ac44265707d892a252d8f85ab/raw/2be498c5fb369635725e9e6b493732a5c181ac65/first_matlab.json' },
        { text: 'exp3', value: 'https://raw.githubusercontent.com/ml4ai/skema/main/data/gromet/python/exp3/FN_0.1.6/exp3--Gromet-FN-auto.json' },
        { text: 'fun_default1', value: 'https://raw.githubusercontent.com/ml4ai/skema/adarshp/nom_error_handling/data/gromet/python/fun_default1/FN_0.1.6/fun_default1--Gromet-FN-auto.json' },
        { text: 'assign_operator1', value: 'https://raw.githubusercontent.com/ml4ai/skema/main/data/gromet/python/assign_operator1/FN_0.1.6/assign_operator1--Gromet-FN-auto.json' },
      ],
    };
  },
  methods: {
    fetchData() {
      d3.selectAll('g').remove();
      axios.get(this.selectedOption)
        .then((response) => {
          function handleZoom(e) {
            d3.select('svg g')
              .attr('transform', e.transform);
          }
          const svg = d3.select('svg');
          svg.append('g').attr('id', 'sumGroup');
          const zoom = d3.zoom()
            .on('zoom', handleZoom);
          svg.call(zoom);
          const jsonData = response.data;
          this.skemaVersion = jsonData.schema_version;
          const graphData = jsonData.modules[0];
          const fn0 = graphData.fn;
          const fnS = graphData.fn_array;
          const layout = getBoxLayout(fn0);
          drawBox(layout, fnS, 0);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];

      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          function handleZoom(zoomasd) {
            d3.select('svg g')
              .attr('transform', zoomasd.transform);
          }
          try {
            const jsonData = JSON.parse(e.target.result);
            const svg = d3.select('svg');
            svg.append('g').attr('id', 'sumGroup');
            const zoom = d3.zoom()
              .on('zoom', handleZoom);
            svg.call(zoom);
            this.skemaVersion = jsonData.schema_version;
            const graphData = jsonData.modules[0];
            const fn0 = graphData.fn;
            const fnS = graphData.fn_array;
            const layout = getBoxLayout(fn0);
            drawBox(layout, fnS, 0);
          } catch (error) {
            // eslint-disable-next-line
            console.error('Error parsing JSON:', error);
          }
        };

        reader.readAsText(this.selectedFile); // 读取文件内容为文本
      }
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
    submitUrl() {
      this.excuteFunction(this.url);
    },
    excuteFunction(url) {
      d3.selectAll('g').remove();
      axios.get(url)
        .then((response) => {
          const jsonData = response.data;
          this.skemaVersion = jsonData.schema_version;
          const graphData = jsonData.modules[0];
          const fn0 = graphData.fn;
          const fnS = graphData.fn_array;
          const layout = getBoxLayout(fn0);
          drawBox(layout, fnS, 0);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
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

.url-input {
    /* 输入框的样式 */
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    width: 400px;
    overflow-x: auto;
    margin-left: 20px; /* 这将在下拉框和其他元素之间添加一些间距 */
}

p {
  margin-bottom: -10px;
  font-size: 27px;
  font-family: Arial, sans-serif;
}

.download-button {
  margin-left: 300px;
}

.version-text {
  font-size: 27px;
  font-family: Arial, sans-serif;
}

.highlight {
  color: red;
}
</style>
