/* eslint-disable */
import * as d3 from "d3";
import { handleClick } from "./click";
import { handleClickCond, handleClickLoop } from "./clickCond";
import { computeBoundingRectangle, getOuterBox } from "./utilities"
import { getGromet } from './global.js';

export function drawBox(layout, fnS, body_num, directionO = "right") {
  // console.log(this.$gromet)
    // 创建SVG元素
    // debugger
    const svg = d3.select("#mainsvg").select("#sumGroup");
    const g = svg.append("g").attr('id', "boxid" + String(body_num)).attr("class", "drawer").attr("direction", directionO);
    const ranksep = 37;
    const padding = 22.5; // 设置padding的大小

    // 绘制节点
    const nodes = layout.nodes;
    console.log(layout)
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
    // console.log(nodes);
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
      nodes[key].x = nodes[key].x - minXofAllNodes;
      nodes[key].y -= minYofAllNodes;
    }
    const bbox = computeBoundingRectangle(nodes);
    const realOuterBox = getOuterBox(bbox, padding, ranksep, nodes);
    // console.log(bbox,"bbox");
    // console.log(nodes);
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
      const bboxO = bbox;
      if (isBfNode) {
        if (node.fullBox){
            if (node.type == "FUNCTION") {
              drawBFs_full(node, nodeId, g, "green", ranksep, fnS, body_num, realOuterBox);
            } else if (node.type == "EXPRESSION") {
              drawBFs_full(node, nodeId, g, "purple", ranksep, fnS, body_num, realOuterBox);
            } else if (node.type == "LITERAL") {
              drawLiteral_full(node, nodeId, g, "red", ranksep);
            } else if (node.type == "LANGUAGE_PRIMITIVE") {
              drawLPrimitive_full(node, nodeId, g, "red", ranksep);
            } else if (node.type == "ABSTRACT") {
              drawBFs_full(node, nodeId, g, "yellow", ranksep);
            } else if (node.type == "IMPORTED") {
              const imported = true;
              drawBFs_full(node, nodeId, g, "gray", ranksep, fnS, body_num, realOuterBox, imported);
            } else if (node.type == "IMPORTED_METHOD") {
              const imported = true;
              drawBFs_full(node, nodeId, g, "purple", ranksep, fnS, body_num, realOuterBox, imported);
            }
        } else {
          if (node.type == "FUNCTION") {
            drawBFs_nfull(node, nodeId, g, "green", ranksep, fnS, body_num, realOuterBox);
          } else if (node.type == "EXPRESSION") {
            drawBFs_nfull(node, nodeId, g, "purple", ranksep, fnS, body_num, realOuterBox);
          } else if (node.type == "LITERAL") {
            drawLiteral_nfull(node, nodeId, g, "red", ranksep);
          } else if (node.type == "LANGUAGE_PRIMITIVE") {
            drawLPrimitive_nfull(node, nodeId, g, "red", ranksep);
          } else if (node.type == "ABSTRACT") {
            drawBFs_nfull(node, nodeId, g, "yellow", ranksep);
          } else if (node.type == "IMPORTED") {
            const imported = true;
            drawBFs_nfull(node, nodeId, g, "gray", ranksep, fnS, body_num, realOuterBox, imported);
          } else if (node.type == "IMPORTED_METHOD") {
            const imported = true;
            drawBFs_nfull(node, nodeId, g, "purple", ranksep, fnS, body_num, realOuterBox, imported);
          }
        }
      } else if (isBcNode) {
        if (node.fullBox){
          drawBCs_full(node, nodeId, g, "orange", ranksep, fnS, body_num, realOuterBox);
        } else {
          drawBCs_nfull(node, nodeId, g, "orange", ranksep, fnS, body_num, realOuterBox);
        }
      } else if (isBlNode) {
        if (node.fullBox){
          drawBLs_full(node, nodeId, g, "blue", ranksep, fnS, body_num, realOuterBox);
        } else {
          drawBLs_nfull(node, nodeId, g, "blue", ranksep, fnS, body_num, realOuterBox);
        }
      }
      else if (isPofNode || isPifNode || isOpiNode || isOpoNode || isPicNode || isPocNode || isPilNode || isPolNode) {
        if (node.label==="err") {
          drawPorts(node, nodeId, g, "red", "red");
        } else {
          drawPorts(node, nodeId, g, "black");
        }
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

    const width = bbox.width + padding * 4;
    const height = bbox.height + padding * 4;

    if ('opo-0' in nodes && 'opi-0' in nodes){
      if (layout.meta.type === "MODULE"){
        drawOuterBoxFull(g, bbox, width, height, padding, ranksep, "gray", body_num, false, layout);
      } else if (layout.meta.type === "EXPRESSION") {
        drawOuterBoxFull(g, bbox, width, height, padding, ranksep, "purple", body_num, false, layout);
      } else if (layout.meta.type === "FUNCTION") {
        drawOuterBoxFull(g, bbox, width, height, padding, ranksep, "green", body_num, false, layout);
      } else if (layout.meta.type === "PREDICATE") {
        drawOuterBoxFull(g, bbox, width, height, padding, ranksep, "Magenta", body_num, false, layout);
      } else if (layout.meta.type == "ABSTRACT") {
        drawOuterBoxFull(g, bbox, width, height, padding, ranksep, "yellow", body_num, false, layout);
      } else if (layout.meta.type === "IMPORTED") {
        const imported = true;
        drawOuterBoxFull(g, bbox, width, height, padding, ranksep, "gray", body_num, imported, layout);
      } else if (layout.meta.type === "IMPORTED_METHOD") {
        const imported = true;
        drawOuterBoxFull(g, bbox, width, height, padding, ranksep, "purple", body_num, imported, layout);
      }
    } else if ('opo-0' in nodes && !('opi-0' in nodes)) {
      if (layout.meta.type === "MODULE"){
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "gray", body_num, false, layout);
      } else if (layout.meta.type === "EXPRESSION") {
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "purple", body_num, false, layout);
      } else if (layout.meta.type === "FUNCTION") {
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "green", body_num, false, layout);
      } else if (layout.meta.type === "PREDICATE") {
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "Magenta", body_num, false, layout);
      } else if (layout.meta.type == "ABSTRACT") {
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "yellow", body_num, false, layout);
      } else if (layout.meta.type === "IMPORTED") {
        const imported = true;
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "gray", body_num, imported, layout);
      } else if (layout.meta.type === "IMPORTED_METHOD") {
        const imported = true;
        drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, "purple", body_num, imported, layout);
      }
    } else if (!('opo-0' in nodes) && 'opi-0' in nodes) {
      if (layout.meta.type === "MODULE"){
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "gray", body_num, false, layout);
      } else if (layout.meta.type === "EXPRESSION") {
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "purple", body_num, false, layout);
      } else if (layout.meta.type === "FUNCTION") {
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "green", body_num, false, layout);
      } else if (layout.meta.type === "PREDICATE") {
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "Magenta", body_num, false, layout);
      } else if (layout.meta.type == "ABSTRACT") {
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "yellow", body_num, false, layout);
      } else if (layout.meta.type === "IMPORTED") {
        const imported = true;
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "gray", body_num, imported, layout);
      } else if (layout.meta.type === "IMPORTED_METHOD") {
        const imported = true;
        drawOuterBoxTop(g, bbox, width, height, padding, ranksep, "purple", body_num, imported, layout);
      }
    } else {
      if (layout.meta.type === "MODULE"){
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "gray", body_num, false, layout);
      } else if (layout.meta.type === "EXPRESSION") {
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "purple", body_num, false, layout);
      } else if (layout.meta.type === "FUNCTION") {
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "green", body_num, false, layout);
      } else if (layout.meta.type === "PREDICATE") {
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "Magenta", body_num, false, layout);
      } else if (layout.meta.type == "ABSTRACT") {
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "yellow", body_num, false, layout);
      } else if (layout.meta.type === "IMPORTED") {
        const imported = true;
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "gray", body_num, imported, layout);
      } else if (layout.meta.type === "IMPORTED_METHOD") {
        const imported = true;
        drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, "purple", body_num, imported, layout);
      }
    }
    g.attr("width", g.node().getBBox().width)
      .attr("height", g.node().getBBox().height)
    if (body_num === 0){
      g.attr("transform", `translate(${padding * 4},${padding * 30 - g.node().getBBox().height / 2 * 1})`);
    }
  }

function drawBFs_full(node, nodeId, g, color, ranksep, fnS, body_num, bbox="right", imported=false) {
  let clicked = false;
  let node_body = null;
  if (node.body !== undefined) {
    node_body = node.body;
  }
  const outerRight = bbox.x + bbox.width;
  const outerBottom = bbox.y + bbox.height;
  const innerRight = node.x + node.width / 2;
  const innerBottom = node.y + node.height / 2 - ranksep;
  // console.log(outerRight, "outerRight");
  // console.log(outerBottom, "outerBottom");
  // console.log(innerBottom, "innerBottom");
  // console.log(innerRight, "innerRight");
  let direction = "right";
  if ( (outerRight - innerRight) > (outerBottom - innerBottom) + 120) {
    direction = "down";
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
  .attr("data-clicked", "false")
  .style("fill", "rgba(0, 0, 255, 0)")
  .style("stroke", color)
  .style("cursor", "pointer")
  .style("stroke-width", 5);
  if (imported) {
    selection.style("stroke-dasharray", "10, 5");
  }
  if (node.label !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "12px")
    .text(node.label);
  }
  var tooltip = d3.select("#tooltip");
  const gromet = getGromet();
  const metadata_collection = gromet.metadata_collection;
  if (node.metadata !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x + node.width / 2 - 17)
    .attr("y", node.y - node.height / 2 + ranksep + 17 )
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "15px")
    .text(node.metadata)
    .on("mouseover", function(d) {
      var formattedJson = JSON.stringify(metadata_collection[node.metadata-1], null, 2);
      tooltip.style("opacity", 0.9)
            .html("<pre>" + formattedJson + "</pre>")
            .style("left", "0px") // 在text宽度的基础上加上一些偏移
            .style("top", "70px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });
  }
  if (node.body !== undefined) {
    selection.on("click", function(){
      handleClick(fnS, node.body, body_num, nodeId, color, clicked, direction);
      clicked = !clicked;
      this.setAttribute("data-clicked", clicked.toString());
    });
  }
}

function drawBFs_nfull(node, nodeId, g, color, ranksep, fnS, body_num, bbox = "right", imported = false) {
  let node_body = null;
  if (node.body !== undefined) {
    node_body = node.body;
  }
  if (imported===true) {
    console.log(node);
    console.log(node.body);
  }
  let clicked = false;
  const outerRight = bbox.x + bbox.width;
  const outerBottom = bbox.y + bbox.height;
  const innerRight = node.x + node.width / 2;
  const innerBottom = node.y + node.height / 2 - ranksep;
  let direction = "right";
  if ( (outerRight - innerRight) > (outerBottom - innerBottom) + 120) {
    direction = "down";
  }
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
  .attr("data-clicked", "false")
  .style("fill", "rgba(0, 0, 255, 0)")
  .style("cursor", "pointer")
  .style("stroke", color)
  .style("stroke-width", 5);
  if (imported) {
    selection.style("stroke-dasharray", "10, 5");
  }
  if (node.label !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x)
    .attr("y", node.y - node.height / 4 - ranksep / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "12px")
    .text(node.label);
  }
  var tooltip = d3.select("#tooltip");
  const gromet = getGromet();
  const metadata_collection = gromet.metadata_collection;
  if (node.metadata !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x + node.width / 2 - 17)
    .attr("y", node.y - node.height / 2 - ranksep + 17 )
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "15px")
    .text(node.metadata)
    .on("mouseover", function(d) {
      var formattedJson = JSON.stringify(metadata_collection[node.metadata-1], null, 2);
      tooltip.style("opacity", 0.9)
            .html("<pre>" + formattedJson + "</pre>")
            .style("left", "0px") // 在text宽度的基础上加上一些偏移
            .style("top", "70px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });
  }
  if (node.body !== undefined) {
    selection.on("click", function(){
      handleClick(fnS, node.body, body_num, nodeId, color, clicked, direction);
      clicked = !clicked;
      this.setAttribute("data-clicked", clicked.toString());
    });
  }
}

function drawBCs_full(node, nodeId, g, color, ranksep, fnS, body_num, bbox) {
  let clicked = false;
  let node_body_cond = null;
  if (node.condition !== undefined) {
    node_body_cond = node.condition;
  }
  const outerRight = bbox.x + bbox.width;
  const outerBottom = bbox.y + bbox.height;
  const innerRight = node.x + node.width / 2;
  const innerBottom = node.y + node.height / 2 - ranksep;
  let direction = "right";
  if ( (outerRight - innerRight) > (outerBottom - innerBottom) + 120) {
    direction = "down";
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
  .attr("data-clicked", "false")
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
  var tooltip = d3.select("#tooltip");
  const gromet = getGromet();
  const metadata_collection = gromet.metadata_collection;
  if (node.metadata !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x + node.width / 2 - 17)
    .attr("y", node.y - node.height / 2 + ranksep + 17 )
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "15px")
    .text(node.metadata)
    .on("mouseover", function(d) {
      var formattedJson = JSON.stringify(metadata_collection[node.metadata-1], null, 2);
      tooltip.style("opacity", 0.9)
            .html("<pre>" + formattedJson + "</pre>")
            .style("left", "0px") // 在text宽度的基础上加上一些偏移
            .style("top", "70px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });;
  }
  if (node.condition !== undefined) {
    selection.on("click", function(){
      handleClickCond(fnS, node.condition, node.body_if, node.body_else, body_num, nodeId, color, clicked, direction);
      clicked = !clicked;
      this.setAttribute("data-clicked", clicked.toString());
    });
  }
}

function drawBCs_nfull(node, nodeId, g, color, ranksep, fnS, body_num, bbox) {
  let node_body = null;
  if (node.body !== undefined) {
    node_body = node.body;
  }
  let clicked = false;
  const outerRight = bbox.x + bbox.width;
  const outerBottom = bbox.y + bbox.height;
  const innerRight = node.x + node.width / 2;
  const innerBottom = node.y + node.height / 2 - ranksep;
  let direction = "right";
  if ( (outerRight - innerRight) > (outerBottom - innerBottom) + 120) {
    direction = "down";
  }
  const selection = g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 - ranksep)
  .attr("width", node.width)
  .attr("height", node.height)
  .attr("rx", 15)
  .attr("ry", 15)
  .attr("data-body", node_body)
  .attr("data-clicked", "false")
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
  var tooltip = d3.select("#tooltip");
  const gromet = getGromet();
  const metadata_collection = gromet.metadata_collection;
  if (node.metadata !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x + node.width / 2 - 17)
    .attr("y", node.y - node.height / 2 - ranksep + 17 )
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "15px")
    .text(node.metadata)
    .on("mouseover", function(d) {
      var formattedJson = JSON.stringify(metadata_collection[node.metadata-1], null, 2);
      tooltip.style("opacity", 0.9)
            .html("<pre>" + formattedJson + "</pre>")
            .style("left", "0px") // 在text宽度的基础上加上一些偏移
            .style("top", "70px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });;
  }
  if (node.body !== undefined) {
    selection.on("click", function(){
      handleClickCond(fnS, node.condition, node.body_if, node.body_else, body_num, nodeId, color, clicked, direction);
      clicked = !clicked;
      this.setAttribute("data-clicked", clicked.toString());
    });
  }
}

function drawBLs_full(node, nodeId, g, color, ranksep, fnS, body_num, bbox) {
  let clicked = false;
  let node_body_cond = null;
  if (node.condition !== undefined) {
    node_body_cond = node.condition;
  }
  const outerRight = bbox.x + bbox.width;
  const outerBottom = bbox.y + bbox.height;
  const innerRight = node.x + node.width / 2;
  const innerBottom = node.y + node.height / 2 - ranksep;
  let direction = "right";
  if ( (outerRight - innerRight) > (outerBottom - innerBottom) + 120) {
    direction = "down";
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
  .attr("data-clicked", "false")
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
  var tooltip = d3.select("#tooltip");
  const gromet = getGromet();
  const metadata_collection = gromet.metadata_collection;
  if (node.metadata !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x + node.width / 2 - 17)
    .attr("y", node.y - node.height / 2 + ranksep + 17 )
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "15px")
    .text(node.metadata)
    .on("mouseover", function(d) {
      var formattedJson = JSON.stringify(metadata_collection[node.metadata-1], null, 2);
      tooltip.style("opacity", 0.9)
            .html("<pre>" + formattedJson + "</pre>")
            .style("left", "0px") // 在text宽度的基础上加上一些偏移
            .style("top", "70px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });;
  }
  if (node.condition !== undefined) {
    selection.on("click", function(){
      handleClickLoop(fnS, node.condition, node.pre, node.body, node.post, body_num, nodeId, color, clicked, direction);
      clicked = !clicked;
      this.setAttribute("data-clicked", clicked.toString());
    });
  }
}

function drawBLs_nfull(node, nodeId, g, color, ranksep, fnS, body_num, bbox) {
  let node_body = null;
  if (node.body !== undefined) {
    node_body = node.body;
  }
  let clicked = false;
  const outerRight = bbox.x + bbox.width;
  const outerBottom = bbox.y + bbox.height;
  const innerRight = node.x + node.width / 2;
  const innerBottom = node.y + node.height / 2 - ranksep;
  let direction = "right";
  if ( (outerRight - innerRight) > (outerBottom - innerBottom) + 120) {
    direction = "down";
  }
  const selection = g.append("rect")
  .attr("id", nodeId)
  .attr("x", node.x - node.width / 2)
  .attr("y", node.y - node.height / 2 - ranksep)
  .attr("width", node.width)
  .attr("height", node.height)
  .attr("rx", 15)
  .attr("ry", 15)
  .attr("data-body", node_body)
  .attr("data-clicked", "false")
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
  var tooltip = d3.select("#tooltip");
  const gromet = getGromet();
  const metadata_collection = gromet.metadata_collection;
  if (node.metadata !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x + node.width / 2 - 17)
    .attr("y", node.y - node.height / 2 - ranksep + 17 )
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "15px")
    .text(node.metadata).on("mouseover", function(d) {
      var formattedJson = JSON.stringify(metadata_collection[node.metadata-1], null, 2);
      tooltip.style("opacity", 0.9)
            .html("<pre>" + formattedJson + "</pre>")
            .style("left", "0px") // 在text宽度的基础上加上一些偏移
            .style("top", "70px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });;
  }
  if (node.body !== undefined) {
    selection.on("click", function(){
      handleClickLoop(fnS, node.body, body_num, nodeId, color, clicked, direction);
      clicked = !clicked;
      this.setAttribute("data-clicked", clicked.toString());
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
  var tooltip = d3.select("#tooltip");
  const gromet = getGromet();
  const metadata_collection = gromet.metadata_collection;
  if (node.metadata !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x + node.width / 2 - 17)
    .attr("y", node.y - node.height / 2 + ranksep + 17 )
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "15px")
    .text(node.metadata).on("mouseover", function(d) {
      var formattedJson = JSON.stringify(metadata_collection[node.metadata-1], null, 2);
      tooltip.style("opacity", 0.9)
            .html("<pre>" + formattedJson + "</pre>")
            .style("left", "0px") // 在text宽度的基础上加上一些偏移
            .style("top", "70px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });;
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
  var tooltip = d3.select("#tooltip");
  const gromet = getGromet();
  const metadata_collection = gromet.metadata_collection;
  if (node.metadata !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x + node.width / 2 - 17)
    .attr("y", node.y - node.height / 2 + ranksep + 17 )
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "15px")
    .text(node.metadata).on("mouseover", function(d) {
      var formattedJson = JSON.stringify(metadata_collection[node.metadata-1], null, 2);
      tooltip.style("opacity", 0.9)
            .html("<pre>" + formattedJson + "</pre>")
            .style("left", "0px") // 在text宽度的基础上加上一些偏移
            .style("top", "70px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });;
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
  var tooltip = d3.select("#tooltip");
  const gromet = getGromet();
  const metadata_collection = gromet.metadata_collection;
  if (node.metadata !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x + node.width / 2 - 17)
    .attr("y", node.y - node.height / 2 - ranksep + 17 )
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "15px")
    .text(node.metadata).on("mouseover", function(d) {
      var formattedJson = JSON.stringify(metadata_collection[node.metadata-1], null, 2);
      tooltip.style("opacity", 0.9)
            .html("<pre>" + formattedJson + "</pre>")
            .style("left", "0px") // 在text宽度的基础上加上一些偏移
            .style("top", "70px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });;
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
  var tooltip = d3.select("#tooltip");
  const gromet = getGromet();
  const metadata_collection = gromet.metadata_collection;
  if (node.metadata !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", node.x + node.width / 2 - 27)
    .attr("y", node.y - node.height / 2 - ranksep + 17 )
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "15px")
    .text(node.metadata).on("mouseover", function(d) {
      var formattedJson = JSON.stringify(metadata_collection[node.metadata-1], null, 2);
      tooltip.style("opacity", 0.9)
            .html("<pre>" + formattedJson + "</pre>")
            .style("left", "0px") // 在text宽度的基础上加上一些偏移
            .style("top", "70px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });;
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

function drawPorts(node, nodeId, g, color, fill="white") {
  g.append("rect")
    .attr("id", nodeId)
    .attr("x", node.x - node.width / 2)
    .attr("y", node.y - node.height / 2)
    .attr("width", node.width)
    .attr("height", node.height)
    .style("fill", fill)
    .style("stroke", color)
    .style("stroke-width", 2);
    var tooltip = d3.select("#tooltip");
    const gromet = getGromet();
    const metadata_collection = gromet.metadata_collection;
    if (node.metadata !== undefined){
      g.append("text") // 添加节点的label
      .attr("x", node.x + node.width / 2 - 12)
      .attr("y", node.y - node.height / 2 + 12 )
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "15px")
      .text(node.metadata).on("mouseover", function(d) {
        var formattedJson = JSON.stringify(metadata_collection[node.metadata-1], null, 2);
        tooltip.style("opacity", 0.9)
              .html("<pre>" + formattedJson + "</pre>")
              .style("left", "0px") // 在text宽度的基础上加上一些偏移
              .style("top", "70px");
      })
      .on("mouseout", function(d) {
        tooltip.style("opacity", 0);
      });;
    }
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

function drawOuterBoxFull(g, bbox, width, height, padding, ranksep, color, body_num, imported=false, layout) {
  // 绘制外框
  const selection = g.insert("rect", ":first-child")
  .attr("id", "frame" + body_num)
  .attr("x", bbox.x - padding)
  .attr("y", bbox.y - padding + ranksep)
  .attr("rx", 15)
  .attr("ry", 15)
  .attr("width", width - padding * 2)
  .attr("height", height - padding * 2 - ranksep * 2)
  .style("fill", "transparent")
  .style("stroke", color)
  .style("stroke-width", 5)
  .lower();
  if (imported) {
    selection.style("stroke-dasharray", "10,5");
  }
  var tooltip = d3.select("#tooltip");
  const gromet = getGromet();
  const metadata_collection = gromet.metadata_collection;
  if (layout.meta.metadata !== undefined){
    g.append("text") // 添加节点的label
    .attr("x", bbox.x - padding + (width - 2*padding) - 17)
    .attr("y", bbox.y - padding + ranksep  + 17 )
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "17px")
    .text(layout.meta.metadata).on("mouseover", function(d) {
      var formattedJson = JSON.stringify(metadata_collection[layout.meta.metadata-1], null, 2);
      tooltip.style("opacity", 0.9)
            .html("<pre>" + formattedJson + "</pre>")
            .style("left", "0px") // 在text宽度的基础上加上一些偏移
            .style("top", "70px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });;
  }
}

function drawOuterBoxBottom(g, bbox, width, height, padding, ranksep, color, body_num, imported=false, layout) {
  // 绘制外框
  const selection = g.insert("rect", ":first-child")
    .attr("id", "frame" + body_num)
    .attr("x", bbox.x - padding)
    .attr("y", bbox.y - padding - ranksep / 10)
    .attr("rx", 15)
    .attr("ry", 15)
    .attr("width", width - padding * 2)
    .attr("height", height - padding * 2 - ranksep)
    .style("fill", "transparent")
    .style("stroke", color)
    .style("stroke-width", 5)
    .lower();
    var tooltip = d3.select("#tooltip");
    const gromet = getGromet();
    const metadata_collection = gromet.metadata_collection;
    if (layout.meta.metadata !== undefined){
      g.append("text") // 添加节点的label
      .attr("x", bbox.x - padding + (width - 2*padding) - 17)
      .attr("y", bbox.y - padding - ranksep / 10  + 17 )
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "17px")
      .text(layout.meta.metadata).on("mouseover", function(d) {
        var formattedJson = JSON.stringify(metadata_collection[layout.meta.metadata-1], null, 2);
        tooltip.style("opacity", 0.9)
              .html("<pre>" + formattedJson + "</pre>")
              .style("left", "0px") // 在text宽度的基础上加上一些偏移
              .style("top", "70px");
      })
      .on("mouseout", function(d) {
        tooltip.style("opacity", 0);
      });;
    }
    if (imported) {
      selection.style("stroke-dasharray", "10,5");
    }
}

function drawOuterBoxTop(g, bbox, width, height, padding, ranksep, color, body_num, imported=false, layout) {
  // 绘制外框
  const selection = g.insert("rect", ":first-child")
    .attr("id", "frame" + body_num)
    .attr("x", bbox.x - padding)
    .attr("y", bbox.y - padding + ranksep * 2)
    .attr("rx", 15)
    .attr("ry", 15)
    .attr("width", width - padding * 2)
    .attr("height", height - padding * 2 - ranksep)
    .style("fill", "transparent")
    .style("stroke", color)
    .style("stroke-width", 5)
    .lower();
    var tooltip = d3.select("#tooltip");
    const gromet = getGromet();
    const metadata_collection = gromet.metadata_collection;
    if (layout.meta.metadata !== undefined){
      g.append("text") // 添加节点的label
      .attr("x", bbox.x - padding + (width - 2*padding) - 17)
      .attr("y", bbox.y - padding + ranksep * 10  + 17 )
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "17px")
      .text(layout.meta.metadata).on("mouseover", function(d) {
        var formattedJson = JSON.stringify(metadata_collection[layout.meta.metadata-1], null, 2);
        tooltip.style("opacity", 0.9)
              .html("<pre>" + formattedJson + "</pre>")
              .style("left", "0px") // 在text宽度的基础上加上一些偏移
              .style("top", "70px");
      })
      .on("mouseout", function(d) {
        tooltip.style("opacity", 0);
      });;
    }
    if (imported) {
      selection.style("stroke-dasharray", "10,5");
    }
}

function drawOuterBoxEmpty(g, bbox, width, height, padding, ranksep, color, body_num, imported=false, layout) {
  // 绘制外框
  if (bbox.x===Infinity || bbox.x === -Infinity){
    bbox.x = 100;
    bbox.y = 100;
    width = 200;
    height = 200;
  }
  const selection = g.insert("rect", ":first-child")
    .attr("id", "frame" + body_num)
    .attr("x", bbox.x - padding)
    .attr("y", bbox.y - padding)
    .attr("rx", 15)
    .attr("ry", 15)
    .attr("width", width - padding * 2)
    .attr("height", height - padding * 2)
    .style("fill", "transparent")
    .style("stroke", color)
    .style("stroke-width", 5)
    .lower();
    var tooltip = d3.select("#tooltip");
    const gromet = getGromet();
    const metadata_collection = gromet.metadata_collection;
    if (layout.meta.metadata !== undefined){
      g.append("text") // 添加节点的label
      .attr("x", bbox.x - padding + (width - 2*padding) - 17)
      .attr("y", bbox.y - padding  + 17 )
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "17px")
      .text(layout.meta.metadata).on("mouseover", function(d) {
        var formattedJson = JSON.stringify(metadata_collection[layout.meta.metadata-1], null, 2);
        tooltip.style("opacity", 0.9)
              .html("<pre>" + formattedJson + "</pre>")
              .style("left", "0px") // 在text宽度的基础上加上一些偏移
              .style("top", "70px");
      })
      .on("mouseout", function(d) {
        tooltip.style("opacity", 0);
      });;
    }
    if (imported) {
      selection.style("stroke-dasharray", "10,5");
    }
}
  