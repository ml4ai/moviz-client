/* eslint-disable */
import * as d3 from "d3";
import { handleClick } from "./click";

export function drawBox(layout, fnS, body_num) {
    // 创建SVG元素
    const svg = d3.select("#mainsvg")
    const g = svg.append("g").attr('id', "boxid" + String(body_num));
    const ranksep = 37;
    // 绘制节点
    const nodes = layout.nodes;
    for (const nodeId in nodes) {
      const node = nodes[nodeId];
      const [type, index] = nodeId.split("-");
      const isBfNode = (type === "bf");
      const isPofNode = (type === "pof");
      const isPifNode = (type === "pif");
      const isAuxNode = (type === "aux");
      const isOpoNode = (type === 'opo');
      const isOpiNode = (type === 'opi');
  
      if (isAuxNode) {
        continue; // 不绘制aux前缀的节点
      }
  
      if (isOpiNode) {
        const minValue = Math.min(...Object.values(layout.nodes).map(obj => obj.y));
        if (node.y !== minValue){
          node.y = minValue - 50 - ranksep;
        }
      }

      if (isOpoNode) {
        const maxValue = Math.max(...Object.values(layout.nodes).map(obj => obj.y));
        if (node.y !== maxValue){
          node.y = maxValue + 50 + ranksep;
        }
      }

      if (isBfNode) {
        if (node.fullBox){
            if (node.type == "FUNCTION") {
              drawBFs_full(node, nodeId, g, "green", ranksep, fnS, body_num);
            } else if (node.type == "EXPRESSION") {
              drawBFs_full(node, nodeId, g, "purple", ranksep, fnS, body_num);
            } else if (node.type == "LITERAL") {
              drawLiteral_full(node, nodeId, g, "red", ranksep);
            } else if (node.type == "LANGUAGE_PRIMITIVE") {
              drawLPrimitive_full(node, nodeId, g, "red", ranksep);
            }
        } else {
          if (node.type == "FUNCTION") {
            drawBFs_nfull(node, nodeId, g, "green", ranksep, fnS, body_num);
          } else if (node.type == "EXPRESSION") {
            drawBFs_nfull(node, nodeId, g, "purple", ranksep, fnS, body_num);
          } else if (node.type == "LITERAL") {
            drawLiteral_nfull(node, nodeId, g, "red", ranksep);
          } else if (node.type == "LANGUAGE_PRIMITIVE") {
            drawLPrimitive_nfull(node, nodeId, g, "red", ranksep);
          }
        }
      } else if (isPofNode || isPifNode || isOpiNode || isOpoNode) {
        drawPorts(node, nodeId, g, "black");
      }
    }
  
    // 绘制箭头
    g.append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("markerWidth", 10)
      .attr("markerHeight", 7)
      .attr("refX", 10)
      .attr("refY", 3.5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,0 L10,3.5 L0,7 Z")
      .style("fill", "gray");
  
    // 绘制边
    const edges = layout.edges;
    edges.forEach((edge) => {
      const sourceNode = nodes[edge.source];
      const targetNode = nodes[edge.target];
      const sourceType = edge.source.split("-")[0];
      const targetType = edge.target.split("-")[0];
      const isAuxEdge = (sourceType === "aux" || targetType === "aux");

      if (!isAuxEdge) {
        g.append("line")
          .attr("x1", sourceNode.x)
          .attr("y1", sourceNode.y - sourceNode.height / 2)
          .attr("x2", targetNode.x)
          .attr("y2", targetNode.y + targetNode.height / 2)
          .style("stroke", "gray")
          .style("stroke-width", 2.2)
          .attr("marker-end", "url(#arrowhead)");
      }
    });

    // 调整SVG大小
    const padding = 20; // 设置padding的大小

    // const svgElement = document.querySelector("svg");
    const bbox = g.node().getBBox();
    const width = bbox.width + padding * 4;
    const height = bbox.height + padding * 4;

    if ('opo-0' in nodes && 'opi-0' in nodes){
      if (layout.meta.type === "MODULE"){
        drawOuterBoxFull(g, bbox, width, height, padding, ranksep, "gray", body_num);
      } else if (layout.meta.type === "EXPRESSION") {
        drawOuterBoxFull(g, bbox, width, height, padding, ranksep, "purple", body_num);
      } else if (layout.meta.type === "FUNCTION") {
        drawOuterBoxFull(g, bbox, width, height, padding, ranksep, "green", body_num);
      }
    } else if ('opo-0' in nodes && !('opi-0' in nodes)) {
      if (layout.meta.type === "MODULE"){
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "gray", body_num);
      } else if (layout.meta.type === "EXPRESSION") {
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "purple", body_num);
      } else if (layout.meta.type === "FUNCTION") {
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "green", body_num);
      }
    } else if (!('opo-0' in nodes) && 'opi-0' in nodes) {
      if (layout.meta.type === "MODULE"){
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "gray", body_num);
      } else if (layout.meta.type === "EXPRESSION") {
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "purple", body_num);
      } else if (layout.meta.type === "FUNCTION") {
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "green", body_num);
      }
    } else {
      if (layout.meta.type === "MODULE"){
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "gray", body_num);
      } else if (layout.meta.type === "EXPRESSION") {
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "purple", body_num);
      } else if (layout.meta.type === "FUNCTION") {
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "green", body_num);
      }
    }
    g.attr("width", width)
      .attr("height", height)
    if (body_num === 0){
      g.attr("transform", `translate(${padding * 4},${padding * 30 - height / 2 * 0})`);
    }
  }

function drawBFs_full(node, nodeId, g, color, ranksep, fnS, body_num) {
  let clicked = false;
  const selection = g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 + ranksep)
  .attr("width", node.width)
  .attr("height", node.height - ranksep * 2)
  .attr("rx", 15)
  .attr("ry", 15)
  .style("fill", "rgba(0, 0, 255, 0)")
  .style("stroke", color)
  .style("cursor", "pointer")
  .style("stroke-width", 5);
  if (node.label !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "12px")
    .text(node.label);
  }
  if (node.body !== undefined) {
    selection.on("click", function(){
      handleClick(fnS, node.body, body_num, nodeId, color, clicked);
      clicked = !clicked;
    });
  }
}

function drawBFs_nfull(node, nodeId, g, color, ranksep, fnS, body_num) {
  let clicked = false;
  const selection = g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 - ranksep)
  .attr("width", node.width)
  .attr("height", node.height)
  .attr("rx", 15)
  .attr("ry", 15)
  .style("fill", "rgba(0, 0, 255, 0)")
  .style("cursor", "pointer")
  .style("stroke", color)
  .style("stroke-width", 5);
  if (node.label !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "12px")
    .text(node.label);
  }
  if (node.body !== undefined) {
    selection.on("click", function(){
      handleClick(fnS, node.body, body_num, nodeId, color, clicked);
      clicked = !clicked;
    });
  }
}

function drawLiteral_full(node, nodeId, g, color, ranksep) {
  g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 + ranksep)
  .attr("width", node.width)
  .attr("height", node.height - ranksep * 2)
  .style("fill", "none")
  .style("stroke", color)
  .style("stroke-width", 2);
  if (node.label !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "12px")
    .text(node.label);
  }
  if (node.value !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "30px")
    .text(node.value.value);
  }
}

function drawLPrimitive_full(node, nodeId, g, color, ranksep) {
  g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 + ranksep)
  .attr("width", node.width)
  .attr("height", node.height - ranksep * 2)
  .style("fill", "none")
  .style("stroke", color)
  .style("stroke-width", 5);
  if (node.label !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "20px")
    .text(node.label);
  }
  if (node.value !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "30px")
    .text(node.value.value);
  }
}

function drawLPrimitive_nfull(node, nodeId, g, color, ranksep) {
  g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 - ranksep)
  .attr("width", node.width)
  .attr("height", node.height)
  .style("fill", "none")
  .style("stroke", color)
  .style("stroke-width", 5);
  if (node.label !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "12px")
    .text(node.label);
  }
  if (node.value !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "30px")
    .text(node.value.value);
  }
}

function drawLiteral_nfull(node, nodeId, g, color, ranksep) {
  g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2 + ranksep / 2)
  .attr("y", node.y - node.height / 2 - ranksep)
  .attr("width", node.width - ranksep)
  .attr("height", node.height)
  .style("fill", "none")
  .style("stroke", color)
  .style("stroke-width", 2);
  if (node.label !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "12px")
    .text(node.label);
  }
  if (node.value !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y - ranksep * 1.2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "30px")
    .text(node.value.value);
  }
}

function drawPorts(node, nodeId, g, color) {
  g.append("rect")
    .attr("id", nodeId)
    .attr("x", node.x - node.width / 2)
    .attr("y", node.y - node.height / 2)
    .attr("width", node.width)
    .attr("height", node.height)
    .style("fill", "white")
    .style("stroke", color)
    .style("stroke-width", 2);
    if (node.label !== undefined){
      g.append("text") // 添加节点的label
      .attr("x", node.x)
      .attr("y", node.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "27px")
      .text(node.label);
    }
}

function drawOuterBoxFull(g, bbox, width, height, padding, ranksep, color, body_num) {
  // 绘制外框
  g.append("rect", ":first-child")
  .attr("id", "frame" + body_num)
  .attr("x", bbox.x - padding)
  .attr("y", bbox.y - padding + ranksep)
  .attr("rx", 15)
  .attr("ry", 15)
  .attr("width", width - padding * 2)
  .attr("height", height - padding * 2 - ranksep * 2)
  .style("fill", "none")
  .style("stroke", color)
  .style("stroke-width", 5)
  .lower();
}

function drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, color, body_num) {
  // 绘制外框
  g.append("rect", ":first-child")
    .attr("id", "frame" + body_num)
    .attr("x", bbox.x - padding)
    .attr("y", bbox.y - padding - ranksep / 10)
    .attr("rx", 15)
    .attr("ry", 15)
    .attr("width", width - padding * 2)
    .attr("height", height - padding * 2 - ranksep)
    .style("fill", "none")
    .style("stroke", color)
    .style("stroke-width", 5)
    .lower();
}

function drawOuterBoxTop(g, bbox, width, height, padding, ranksep, color, body_num) {
  // 绘制外框
  g.append("rect", ":first-child")
    .attr("id", "frame" + body_num)
    .attr("x", bbox.x - padding)
    .attr("y", bbox.y - padding + ranksep * 2)
    .attr("rx", 15)
    .attr("ry", 15)
    .attr("width", width - padding * 2)
    .attr("height", height - padding * 2 - ranksep)
    .style("fill", "none")
    .style("stroke", color)
    .style("stroke-width", 5)
    .lower();
}

function drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, color, body_num) {
  // 绘制外框
  g.append("rect", ":first-child")
    .attr("id", "frame" + body_num)
    .attr("x", bbox.x - padding)
    .attr("y", bbox.y - padding)
    .attr("rx", 15)
    .attr("ry", 15)
    .attr("width", width - padding * 2)
    .attr("height", height - padding * 2)
    .style("fill", "none")
    .style("stroke", color)
    .style("stroke-width", 5)
    .lower();
}
  