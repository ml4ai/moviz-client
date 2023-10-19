<template>
  <div id="app">
    <div class="menu">
      Current Supported Skema Version:
      <span style="white-space:pre; color: tomato; font-weight: bold;">0.1.7         </span>
      <select v-model="selectedOption" @change="fetchData" class="my-select" placeholder="Select">
        <option v-for="option in options" :value="option.value" :key="option.value">
          {{ option.text }}
        </option>
      </select>
      <input type="text" v-model="url" class="url-input"
      placeholder="Input URL of JSON file here."/>
      <!-- <button @click="changeSvgContent">Draw</button> -->
      <button @click="submitUrl">Submit</button>
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        style="display: none;"
      />
      <button
      :style="{ margin: '0 30px', backgroundColor: 'tomato', color: 'white', border: 'none' }"
      class="btn btn-primary" @click="triggerFileInput">
          Choose File
      </button>
    </div>
    <div class="content">
      <div class="editor-box">
        <!-- <textarea v-model="inputText" placeholder="Input Gromet JSON here..."
        @input="validateJson">
        </textarea> -->
        <!-- <p v-if="!isValidJson" class="error">Invalid JSON format!</p> -->
        <!-- <pre contenteditable="true"
        v-html="highlightedJson" ref="jsonEditor"></pre> -->
        <label for="deep-select">Select Display Depth: </label>
        <select id="deep-select" v-model="selectedDeep">
          <option v-for="num in possibleDepths" :key="num" :value="num">
            {{ num }}
          </option>
        </select>
        <vue-json-pretty
          :data="highlightedJson"
          :editable="true"
          :highlight-array="highlightNode"
          :deep="selectedDeep">
        </vue-json-pretty>
      </div>
      <div class="svg-container">
        <!-- <svg width="100" height="100">
          <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" :fill="svgColor"/>
        </svg> -->
        <svg id="mainsvg" width="1200" height="1000" overflow="visible" ref="svgMoviz">
          <g id="sumGroup"></g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';
import VueJsonPretty from 'vue-json-pretty-highlight-row';
import 'vue-json-pretty-highlight-row/lib/styles.css';
import { getBoxLayout } from './utils/layout';
import { drawBox } from './utils/drawBox';

export default {
  name: 'App',
  components: {
    VueJsonPretty,
  },
  data() {
    return {
      skemaVersion: '',
      url: '',
      selectedDeep: 2,
      possibleDepths: [1, 2, 3, 4, 5, 6, 7],
      blockStyle: {
        backgroundColor: 'rgba(255, 255, 120, 0)',
        height: '90vh',
        width: '100%',
      },
      selectedFile: null,
      selectedOption: null,
      gromet: null,
      path: 'res',
      highlightedJson: null,
      selectedNode: null,
      highlightNode: null,
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
  mounted() {
    this.$refs.svgMoviz.addEventListener('mouseover', this.handleMouseOverDelegate);
  },
  beforeDestroy() {
    this.$refs.svgMoviz.removeEventListener('mouseover', this.handleMouseOverDelegate);
  },
  methods: {
    drawMoviz() {
      d3.selectAll('g').remove();
      function handleZoom(e) {
        d3.select('svg g')
          .attr('transform', e.transform);
      }
      const svg = d3.select('svg');
      svg.append('g').attr('id', 'sumGroup');
      const zoom = d3.zoom()
        .on('zoom', handleZoom);
      svg.call(zoom);
      const graphData = this.gromet.modules[0];
      const fn0 = graphData.fn;
      const fnS = graphData.fn_array;
      const layout = getBoxLayout(fn0);
      drawBox(layout, fnS, 0);
    },
    async fetchData() {
      try {
        const response = await axios.get(this.selectedOption);
        this.gromet = response.data;
        this.skemaVersion = this.gromet.schema_version;
        this.highlightedJson = this.gromet.modules[0];
        delete this.highlightedJson.metadata_collection;
        delete this.highlightedJson.metadata;
        this.drawMoviz();
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];

      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            this.gromet = JSON.parse(e.target.result);
            this.skemaVersion = this.gromet.schema_version;
            this.highlightedJson = this.gromet.modules[0];
            delete this.highlightedJson.metadata_collection;
            delete this.highlightedJson.metadata;
            this.drawMoviz();
          } catch (error) {
            // eslint-disable-next-line
            console.error('Error parsing JSON:', error);
          }
        };
        reader.readAsText(this.selectedFile); // 读取文件内容为文本
      }
    },
    handleMouseOver(event) {
      if (event.target.tagName === 'g' && event.target.id.startsWith('boxid')) {
        const parts = event.target.id.split('-');
        const lastPart = parts.pop();
        const numberMatch = lastPart.match(/\d+$/); // Matches the last number in a string
        if (numberMatch) {
          this.selectedNode = numberMatch[0];
        } else {
          this.selectedNode = null;
        }
      }
      // eslint-disable-next-line
      console.log(this.selectedNode);
    },
    handleMouseOverDelegate(event) {
      const target = event.target;
      if (target.id && target.id.startsWith('frame')) {
        const parts = target.id.split('-');
        const lastPart = parts.pop();
        const numberMatch = lastPart.match(/\d+$/);
        if (numberMatch) {
          this.selectedNode = numberMatch[0];
        } else {
          this.selectedNode = null;
        }
        // eslint-disable-next-line
        console.log(this.selectedNode);
        if (this.selectedNode === 0 || this.selectedNode === '0') {
          this.highlightNode = ['res.fn'];
        } else {
          this.highlightNode = [`res.fn_array[${this.selectedNode - 1}]`];
        }
      }
    },
    downloadSVG() {
      const svgElement = document.getElementById('mainsvg');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'mainsvg.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
    async submitUrl() {
      try {
        const response = await axios.get(this.url);
        this.gromet = response.data;
        this.skemaVersion = this.gromet.schema_version;
        this.highlightedJson = this.gromet.modules[0];
        delete this.highlightedJson.metadata_collection;
        delete this.highlightedJson.metadata;
        this.drawMoviz();
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .menu {
    margin-bottom: 20px;
  }
  .content {
    display: flex;
    justify-content: space-around;
    height: 90vh;
  }
  .editor-box {
    border: 5px solid #4b4a4a;
    padding: 20px;
    margin: 10px;
    width: 35%;
    border-radius: 10px;
    height: 80vh;
    /* overflow: hidden; */
    overflow: auto;
  }
  .svg-container {
    border: 5px solid #4b4a4a;
    padding: 20px;
    margin: 10px;
    width: 60%;
    border-radius: 10px;
    height: 80vh;
    overflow: hidden;
  }
  .error {
    color: red;
    margin-top: 10px;
  }

  .my-select {
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-right: 20px;
}

.url-input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    width: 400px;
    overflow-x: auto;
    margin-left: 20px;
}

pre {
    overflow-x: auto;
    overflow-y: auto;
    height: 100%;
    width: 100%;
    white-space: nowrap;
}

span {
    text-align: left !important;
}
</style>
