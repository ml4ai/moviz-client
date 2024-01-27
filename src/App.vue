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
      <button class="btn btn-primary download-button" @click="downloadSVG" >downloadSVG</button>
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
        <!-- &nbsp;&nbsp;&nbsp;&nbsp; -->
        <!-- <button @click="isExpandClicked = !isExpandClicked">Select Node to View</button> -->
        <vue-json-pretty
          :data="highlightedJson"
          :editable="true"
          :highlight-array="highlightNode"
          :deep="selectedDeep"
          @click.native="jsonClick">
        </vue-json-pretty>
      </div>
      <div class="svg-container">
        <div id="tooltip" class="tooltip" style="opacity: 0;"></div>
        <!-- <svg width="100" height="100">
          <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" :fill="svgColor"/>
        </svg> -->
        <label for="startingFN">Initial #(Entry): </label>
        <input v-model="startingFN" @keyup.enter="drawMoviz">
        <svg id="mainsvg" width="1200" height="1000" overflow="visible" ref="svgMoviz">
          <g id="sumGroup"></g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3';
import axios from 'axios';
import VueJsonPretty from 'vue-json-pretty-highlight-row';
import 'vue-json-pretty-highlight-row/lib/styles.css';
import { getBoxLayout } from './utils/layout';
import { drawBox } from './utils/drawBox';
import { setGromet } from './utils/global.js';
// import Vue from 'vue';
// Vue.prototype.$gromet = { data: null };
export default {
  name: 'App',
  components: {
    VueJsonPretty,
  },
  data() {
    return {
      skemaVersion: '',
      url: '',
      selectedDeep: 3,
      possibleDepths: [1, 2, 3, 4, 5, 6, 7],
      startingFN: 0,
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
      routePair: {0:"0"},
      routePairC: {0:"0"},
      boxTypePair: {},
      options: [
        { text: 'Clay1', value: 'https://raw.githubusercontent.com/hconhisway/webcrawler/master/get_beta--Gromet-FN-auto2.json' },
        { text: 'core_dynamics', value: 'https://raw.githubusercontent.com/hconhisway/webcrawler/master/core_dynamics_pack2.json' },
        { text: 'while1', value: 'https://raw.githubusercontent.com/ml4ai/skema/adarshp/nom_error_handling/data/gromet/python/while1/FN_0.1.6/while1--Gromet-FN-auto.json' },
        { text: 'cond1', value: 'https://raw.githubusercontent.com/ml4ai/skema/adarshp/nom_error_handling/data/gromet/python/cond1/FN_0.1.6/cond1--Gromet-FN-auto.json' },
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
  async created() {
      const grometUrl = this.$route.query.gromet_url;
      if (grometUrl) {
        try {
          const response = await axios.get(grometUrl);
          this.gromet = response.data;
          this.skemaVersion = this.gromet.schema_version;
          this.processJson();
          this.drawMoviz();
        } catch (error) {
          console.error(error);
        }
      }
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
      setGromet(graphData);
      const fn0 = graphData.fn;
      const fnS = graphData.fn_array;
      let currentFN = fn0;
      if (this.startingFN !== 0){
        currentFN = fnS[this.startingFN-1];
      }
      // console.log(graphData)
      const layout = getBoxLayout(currentFN);
      drawBox(layout, fnS, 0);
      // test
      // drawBox(getBoxLayout(fnS[104]), fnS, 0);
      // console.log(fnS[104]);
    },
    processJson() {
      this.highlightedJson = this.gromet.modules[0];
      this.highlightedJson.fn = {
        hi_there: "--- Click <HERE> to visualize this FN ---  0",
        ...this.highlightedJson.fn
      };
      this.getAllChildBody(this.highlightedJson.fn, "0", "0");
      for (let i=0; i<this.highlightedJson.metadata_collection.length;i++) {
        const currentNum = i+1;
        this.highlightedJson.metadata_collection[i] = {
          num: "#" + currentNum,
          ...this.highlightedJson.metadata_collection[i]
        };
      }
      // delete this.highlightedJson.metadata_collection;
      // delete this.highlightedJson.metadata;
      for (let i=0; i<this.highlightedJson.fn_array.length;i++) {
        const currentEntry = i+1;
        this.highlightedJson.fn_array[i] = {
          body_num: currentEntry,
          ...this.highlightedJson.fn_array[i]
        };
      }
    },
    getAllChildBody(objJson, currentRoute, altRoute) {
      if ("bf" in objJson) {
        for (let i=0; i<objJson.bf.length; i++) {
          if ("body" in objJson.bf[i]) {
            let currentNodeNum = objJson.bf[i].body - 1;
            let newRoute = currentRoute + `-${currentNodeNum + 1}`;
            let newAltRoute = altRoute + `-${i}`
            const clickPrompt = "--- Click <HERE> to visualize this FN ---  " + newAltRoute;
            this.routePair[newAltRoute] = newRoute;
            this.highlightedJson.fn_array[currentNodeNum] = {
              hi_there: clickPrompt,
              ...this.highlightedJson.fn_array[currentNodeNum]
            };
            this.getAllChildBody(this.highlightedJson.fn_array[currentNodeNum], newRoute, newAltRoute);
          }
        }
      }
      // if ("bc" in objJson) {
      //   for (let i=0; i<objJson.bc.length; i++) {
      //     if ("body_if" in objJson.bc[i]) {
      //       let currentNodeNum = objJson.bc[i].body_if - 1;
      //       let newRoute = currentRoute + `-${currentNodeNum + 1}`;
      //       let newAltRoute = altRoute + `-${i}`;
      //       console.log(newAltRoute);
      //       const clickPrompt = "--- Click <HERE> to visualize this FN ---  " + newAltRoute;
      //       // this.routePairC[newAltRoute] = newRoute;
      //       this.highlightedJson.fn_array[currentNodeNum] = {
      //         hi_there: clickPrompt,
      //         ...this.highlightedJson.fn_array[currentNodeNum]
      //       };
      //       this.getAllChildBody(this.highlightedJson.fn_array[currentNodeNum], newRoute, newAltRoute);
      //     }
      //     if ("body_else" in objJson.bc[i]) {
      //       let currentNodeNum = objJson.bc[i].body_else - 1;
      //       let newRoute = currentRoute + `-${currentNodeNum + 1}`;
      //       let newAltRoute = altRoute + `-${i}`;
      //       const clickPrompt = "--- Click <HERE> to visualize this FN ---  " + newAltRoute;
      //       // this.routePairC[newAltRoute] = newRoute;
      //       this.highlightedJson.fn_array[currentNodeNum] = {
      //         hi_there: clickPrompt,
      //         ...this.highlightedJson.fn_array[currentNodeNum]
      //       };
      //       this.getAllChildBody(this.highlightedJson.fn_array[currentNodeNum], newRoute, newAltRoute);
      //     }
      //     if ("condition" in objJson.bc[i]) {
      //       let currentNodeNum = objJson.bc[i].condition - 1;
      //       let newRoute = currentRoute + `-${currentNodeNum + 1}`;
      //       let newAltRoute = altRoute + `-${i}`;
      //       const clickPrompt = "--- Click <HERE> to visualize this FN ---  " + newAltRoute;
      //       this.routePairC[newAltRoute] = newRoute;
      //       this.highlightedJson.fn_array[currentNodeNum] = {
      //         hi_there: clickPrompt,
      //         ...this.highlightedJson.fn_array[currentNodeNum]
      //       };
      //       this.getAllChildBody(this.highlightedJson.fn_array[currentNodeNum], newRoute, newAltRoute);
      //     }
      //   }
      // }
    },
    async fetchData() {
      try {
        const response = await axios.get(this.selectedOption);
        this.gromet = response.data;
        this.skemaVersion = this.gromet.schema_version;
        this.processJson();
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
            this.processJson();
            this.drawMoviz();
          } catch (error) {
            // eslint-disable-next-line
            console.error('Error parsing JSON:', error);
          }
        };
        reader.readAsText(this.selectedFile); // 读取文件内容为文本
      }
    },
    // handleMouseOver(event) {
    //   if (event.target.tagName === 'g' && event.target.id.startsWith('boxid')) {
    //     const parts = event.target.id.split('-');
    //     const lastPart = parts.pop();
    //     const numberMatch = lastPart.match(/\d+$/); // Matches the last number in a string
    //     if (numberMatch) {
    //       this.selectedNode = numberMatch[0];
    //     } else {
    //       this.selectedNode = null;
    //     }
    //   }
    // },
    handleMouseOverDelegate(event) {
      const target = event.target;
      if (target.id && target.id.startsWith('frame')) {
        const parts = target.id.split('-');
        const lastPart = parts.pop();
        const numberMatch = lastPart.match(/\d+$/);
        const svgContainer = d3.select('#mainsvg');
        svgContainer.selectAll("#highlightRect").remove();
        if (numberMatch) {
          this.selectedNode = numberMatch[0];
        } else {
          this.selectedNode = null;
        }
        if (this.selectedNode === 0 || this.selectedNode === '0') {
          this.highlightNode = ['res.fn'];
        } else {
          this.highlightNode = [`res.fn_array[${this.selectedNode - 1}]`];
        }
        if (this.selectedNode !== null) {
          const increasedWidth = target.width.baseVal.value + 7;
          const increasedHeight = target.height.baseVal.value + 7;

          const parentD3Selection = d3.select(target.parentNode);
          const rectSelection = parentD3Selection.append('rect');
          rectSelection
            .attr('id', 'highlightRect')
            .attr('x', target.x.baseVal.value - 3.5)
            .attr('y', target.y.baseVal.value - 3.5)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('width', increasedWidth)
            .attr('height', increasedHeight)
            .style("fill", "none")
            .style("stroke", "red")
            .style("stroke-width", 38)
            .style("stroke-opacity", 0.2);

          // Add event listener to remove the rectangle on mouseout using D3
          // d3.select(target).on('mouseout', () => {
          //   parentD3Selection.select('#highlightRect').remove();
          // });
        }
      }
    },
    jsonClick() {
      let spanText = event.target.textContent;
      let prefix = "--- Click <HERE> to visualize this FN ---  ";
      if (spanText.startsWith('\"--- Click <HERE> to visualize this FN ---')) {
        if (Object.keys(this.routePair).length>1){
          let numbersString = spanText.replace(prefix, "").trim();
          let trimmedNum = numbersString.replace(/^['"]+|['"]+$/g, '');
          let routeNumbers = trimmedNum.split('-').map(Number);
          let altRouteNumbers = this.routePair[trimmedNum].split('-').map(Number);
          let currentBox = "0";
          for (let i=0;i<routeNumbers.length;i++) {
            if (i===0) {
              continue;
            } else {
              let boxId = "boxid" + currentBox;
              const nodeId = "bf-" + String(routeNumbers[i]);
              this.triggerClickEvent(boxId, nodeId);
              currentBox = currentBox + "-" + String(altRouteNumbers[i]);
            }
          }
          const target = d3.select('#mainsvg').select("#sumGroup").select("#boxid"+currentBox).select("#frame"+currentBox);
          const svgContainer = d3.select('#mainsvg');
          svgContainer.selectAll("#highlightRect").remove();
          this.selectedNode = altRouteNumbers[altRouteNumbers.length - 1];
          if (this.selectedNode === 0 || this.selectedNode === '0') {
            this.highlightNode = ['res.fn'];
          } else {
            this.highlightNode = [`res.fn_array[${this.selectedNode - 1}]`];
          }
          if (this.selectedNode !== null) {
            const increasedWidth = Number(target.attr("width")) + 7;
            const increasedHeight = Number(target.attr("height")) + 7;

            const parentD3Selection = d3.select('#mainsvg').select("#boxid"+currentBox);
            const rectSelection = parentD3Selection.append('rect');
            rectSelection
              .attr('id', 'highlightRect')
              .attr('x', Number(target.attr("x")) - 3.5)
              .attr('y', Number(target.attr("y")) - 3.5)
              .attr('rx', 5)
              .attr('ry', 5)
              .attr('width', increasedWidth)
              .attr('height', increasedHeight)
              .style("fill", "none")
              .style("stroke", "red")
              .style("stroke-width", 38)
              .style("stroke-opacity", 0.2);

            // Add event listener to remove the rectangle on mouseout using D3
            // d3.select(target).on('mouseout', () => {
            //   parentD3Selection.select('#highlightRect').remove();
            // });
          }
        }
        // if (Object.keys(this.routePair).length>1) {
        //   let numbersString = spanText.replace(prefix, "").trim();
        //   let trimmedNum = numbersString.replace(/^['"]+|['"]+$/g, '');
        //   let routeNumbers = trimmedNum.split('-').map(Number);
        //   let altRouteNumbers = this.routePairC[trimmedNum].split('-').map(Number);
        //   let currentBox = "0";
        //   for (let i=0;i<routeNumbers.length;i++) {
        //     if (i===0) {
        //       continue;
        //     } else {
        //       let boxId = "boxid" + currentBox;
        //       const nodeId = "bc-" + String(routeNumbers[i]);
        //       this.triggerClickEvent(boxId, nodeId);
        //       currentBox = currentBox + "-" + String(altRouteNumbers[i]);
        //     }
        //   }
        //   const target = d3.select('#mainsvg').select("#sumGroup").select("#boxid"+currentBox).select("#frame"+currentBox);
        //   const svgContainer = d3.select('#mainsvg');
        //   svgContainer.selectAll("#highlightRect").remove();
        //   this.selectedNode = altRouteNumbers[altRouteNumbers.length - 1];
        //   if (this.selectedNode === 0 || this.selectedNode === '0') {
        //     this.highlightNode = ['res.fn'];
        //   } else {
        //     this.highlightNode = [`res.fn_array[${this.selectedNode - 1}]`];
        //   }
        //   if (this.selectedNode !== null) {
        //     const increasedWidth = Number(target.attr("width")) + 7;
        //     const increasedHeight = Number(target.attr("height")) + 7;

        //     const parentD3Selection = d3.select('#mainsvg').select("#boxid"+currentBox);
        //     const rectSelection = parentD3Selection.append('rect');
        //     rectSelection
        //       .attr('id', 'highlightRect')
        //       .attr('x', Number(target.attr("x")) - 3.5)
        //       .attr('y', Number(target.attr("y")) - 3.5)
        //       .attr('rx', 5)
        //       .attr('ry', 5)
        //       .attr('width', increasedWidth)
        //       .attr('height', increasedHeight)
        //       .style("fill", "none")
        //       .style("stroke", "red")
        //       .style("stroke-width", 38)
        //       .style("stroke-opacity", 0.2);
        //   }
        // }
      }
    },
    triggerClickEvent(boxId, nodeId) {
      const element = d3.select("#sumGroup").select("#" + boxId).select("#" + nodeId);
      if (element && element.attr("data-clicked") === "false") {
        element.dispatch('click');
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
        this.processJson();
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
    position: relative;
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

.svg-container input {
  position: absolute; /* input使用绝对定位 */
    top: 10px; /* 定位到顶部 */
    left: 140px; /* 定位到左侧 */
}

.svg-container label {
  font-weight: bold;
  position: absolute; /* input使用绝对定位 */
    top: 14px; /* 定位到顶部 */
    left: 20px; /* 定位到左侧 */
}

span {
    text-align: left !important;
}

.tooltip {
  position: absolute;
  text-align: left;
  width: auto;
  height: auto;
  padding: 5px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none; /* 确保用户可以与下面的元素交互 */
}

</style>
