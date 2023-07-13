/* eslint-disable */
import * as d3 from "d3";
import { handleClick } from "./click";
import { handleClickCond, handleClickLoop } from "./clickCond";

export function drawBox(layout, fnS, body_num) {
    // 创建SVG元素
    const svg = d3.select("#mainsvg");
    const g = svg.append("g").attr('id', "boxid" + String(body_num)).attr("class", "drawer");
    const ranksep = 37;
    // 绘制节点
    const nodes = layout.nodes;
    let opoNodeFlag = false;
    let opiNodeFlag = false;
    const minValue = Math.min(...Object.values(layout.nodes).map(obj => obj.y));
    const maxValue = Math.max(...Object.values(layout.nodes).map(obj => obj.y));
    for (const nodeId in nodes) {
      const node = nodes[nodeId];
      const [type, index] = nodeId.split("-");
      const isOpoNode = (type === 'opo');
      const isOpiNode = (type === 'opi');
      if (isOpiNode) {
        if (node.y === minValue){
          // node.y = minValue - 50 - ranksep;
          opiNodeFlag = true;
        }
      }

      if (isOpoNode) {
        if (node.y === maxValue){
          // node.y = maxValue + 50 + ranksep;
          opoNodeFlag = true;
        }
      }
    }
    console.log(nodes);
    for (const nodeId in nodes) {
      // const node = nodes[nodeId];
      const [type, index] = nodeId.split("-");
      const isOpoNode = (type === 'opo');
      const isOpiNode = (type === 'opi');
      
      if (isOpiNode) {
        // debugger
        if (opiNodeFlag){
          nodes[nodeId].y = minValue;
        } else {
          nodes[nodeId].y = minValue - 50 - ranksep;
        }
      }
      if (isOpoNode) {
        if (opoNodeFlag){
          nodes[nodeId].y = maxValue;
        } else {
          nodes[nodeId].y = maxValue + 50 + ranksep;
        }
      }
    }
    console.log(nodes);

    // 获取 x 和 y 的最小值
    let minXofAllNodes = Infinity;
    let minYofAllNodes = Infinity;
    for (const key in nodes) {
      const [type, index] = key.split("-");
      const isAuxNode = (type === "aux");
      // if (!isAuxNode) {
        if (nodes[key].x < minXofAllNodes) {
          minXofAllNodes = nodes[key].x;
        }
        if (nodes[key].y < minYofAllNodes) {
          minYofAllNodes = nodes[key].y;
        }
      // }
    }

    // 更新每一个子对象的 x 和 y 属性
    for (const key in nodes) {
      nodes[key].x = nodes[key].x - minXofAllNodes + 50;
      nodes[key].y -= minYofAllNodes;
    }
    console.log(nodes);
    for (const nodeId in nodes) {
      const node = nodes[nodeId];
      const [type, index] = nodeId.split("-");
      const isBfNode = (type === "bf");
      const isPofNode = (type === "pof");
      const isPifNode = (type === "pif");
      const isAuxNode = (type === "aux");
      const isOpoNode = (type === 'opo');
      const isOpiNode = (type === 'opi');
      const isBcNode = (type === "bc");
      const isPocNode = (type === "poc");
      const isPicNode = (type === "pic");
      const isBlNode = (type === "bl");
      const isPolNode = (type === "pol");
      const isPilNode = (type === "pil");
  
      if (isAuxNode) {
        continue; // 不绘制aux前缀的节点
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
      } else if (isBcNode) {
        if (node.fullBox){
          drawBCs_full(node, nodeId, g, "orange", ranksep, fnS, body_num);
        } else {
          drawBCs_nfull(node, nodeId, g, "orange", ranksep, fnS, body_num);
        }
      } else if (isBlNode) {
        if (node.fullBox){
          drawBLs_full(node, nodeId, g, "blue", ranksep, fnS, body_num);
        } else {
          drawBLs_nfull(node, nodeId, g, "blue", ranksep, fnS, body_num);
        }
      }
      else if (isPofNode || isPifNode || isOpiNode || isOpoNode || isPicNode || isPocNode || isPilNode || isPolNode) {
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
    const padding = 22.5; // 设置padding的大小

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
      } else if (layout.meta.type === "PREDICATE") {
        drawOuterBoxFull(g, bbox, width, height, padding, ranksep, "Magenta", body_num);
      }
    } else if ('opo-0' in nodes && !('opi-0' in nodes)) {
      if (layout.meta.type === "MODULE"){
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "gray", body_num);
      } else if (layout.meta.type === "EXPRESSION") {
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "purple", body_num);
      } else if (layout.meta.type === "FUNCTION") {
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "green", body_num);
      } else if (layout.meta.type === "PREDICATE") {
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "Magenta", body_num);
      }
    } else if (!('opo-0' in nodes) && 'opi-0' in nodes) {
      if (layout.meta.type === "MODULE"){
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "gray", body_num);
      } else if (layout.meta.type === "EXPRESSION") {
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "purple", body_num);
      } else if (layout.meta.type === "FUNCTION") {
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "green", body_num);
      } else if (layout.meta.type === "PREDICATE") {
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "Magenta", body_num);
      }
    } else {
      if (layout.meta.type === "MODULE"){
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "gray", body_num);
      } else if (layout.meta.type === "EXPRESSION") {
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "purple", body_num);
      } else if (layout.meta.type === "FUNCTION") {
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "green", body_num);
      } else if (layout.meta.type === "PREDICATE") {
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "Magenta", body_num);
      }
    }
    g.attr("width", g.node().getBBox().width)
      .attr("height", g.node().getBBox().height)
    if (body_num === 0){
      g.attr("transform", `translate(${padding * 4},${padding * 30 - g.node().getBBox().height / 2 * 1})`);
    }
  }

function drawBFs_full(node, nodeId, g, color, ranksep, fnS, body_num) {
  let clicked = false;
  let node_body = null;
  if (node.body !== undefined) {
    node_body = node.body;
  }
  const selection = g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 + ranksep)
  .attr("width", node.width)
  .attr("height", node.height - ranksep * 2)
  .attr("rx", 15)
  .attr("ry", 15)
  .attr("data-body", node_body)
  .attr("data-opened", "neo")
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
  let node_body = null;
  if (node.body !== undefined) {
    node_body = node.body;
  }
  let clicked = false;
  const selection = g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 - ranksep)
  .attr("width", node.width)
  .attr("height", node.height)
  .attr("rx", 15)
  .attr("ry", 15)
  .attr("data-body", node_body)
  .attr("data-opened", "neo")
  .style("fill", "rgba(0, 0, 255, 0)")
  .style("cursor", "pointer")
  .style("stroke", color)
  .style("stroke-width", 5);
  if (node.label !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y - node.height / 4 - ranksep / 2)
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

function drawBCs_full(node, nodeId, g, color, ranksep, fnS, body_num) {
  let clicked = false;
  let node_body_cond = null;
  if (node.condition !== undefined) {
    node_body_cond = node.condition;
  }
  const selection = g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 + ranksep)
  .attr("width", node.width)
  .attr("height", node.height - ranksep * 2)
  .attr("rx", 15)
  .attr("ry", 15)
  .attr("data-body", node_body_cond)
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
  if (node.condition !== undefined) {
    selection.on("click", function(){
      handleClickCond(fnS, node.condition, node.body_if, node.body_else, body_num, nodeId, color, clicked);
      clicked = !clicked;
    });
  }
}

function drawBCs_nfull(node, nodeId, g, color, ranksep, fnS, body_num) {
  let node_body = null;
  if (node.body !== undefined) {
    node_body = node.body;
  }
  let clicked = false;
  const selection = g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 - ranksep)
  .attr("width", node.width)
  .attr("height", node.height)
  .attr("rx", 15)
  .attr("ry", 15)
  .attr("data-body", node_body)
  .style("fill", "rgba(0, 0, 255, 0)")
  .style("cursor", "pointer")
  .style("stroke", color)
  .style("stroke-width", 5);
  if (node.label !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y - node.height / 4 - ranksep / 2)
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

function drawBLs_full(node, nodeId, g, color, ranksep, fnS, body_num) {
  let clicked = false;
  let node_body_cond = null;
  if (node.condition !== undefined) {
    node_body_cond = node.condition;
  }
  const selection = g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 + ranksep)
  .attr("width", node.width)
  .attr("height", node.height - ranksep * 2)
  .attr("rx", 15)
  .attr("ry", 15)
  .attr("data-body", node_body_cond)
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
  if (node.condition !== undefined) {
    selection.on("click", function(){
      handleClickLoop(fnS, node.condition, node.pre, node.body, node.post, body_num, nodeId, color, clicked);
      clicked = !clicked;
    });
  }
}

function drawBLs_nfull(node, nodeId, g, color, ranksep, fnS, body_num) {
  let node_body = null;
  if (node.body !== undefined) {
    node_body = node.body;
  }
  let clicked = false;
  const selection = g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 - ranksep)
  .attr("width", node.width)
  .attr("height", node.height)
  .attr("rx", 15)
  .attr("ry", 15)
  .attr("data-body", node_body)
  .style("fill", "rgba(0, 0, 255, 0)")
  .style("cursor", "pointer")
  .style("stroke", color)
  .style("stroke-width", 5);
  if (node.label !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y - node.height / 4 - ranksep / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "12px")
    .text(node.label);
  }
  if (node.body !== undefined) {
    selection.on("click", function(){
      handleClickLoop(fnS, node.body, body_num, nodeId, color, clicked);
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
  