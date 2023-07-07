/* eslint-disable */
import { drawBox } from "./drawBox";
import { drawLines, updateLines } from "./drawlines";
import { getBoxLayout, getTreeLayout } from "./layout";
import { arraysAreEqual, loopOverHierarchy, getChildren, findChildrenAtSameLevel } from "./utilities";
import * as flextree from "d3-flextree"
import * as d3 from "d3";

export function handleClick(fnS, body, body_num, sourceid, color, clicked) {
  const transitionTime1 = 920;
  const transitionTime2 = 720;
  const transitionTime3 = 720;
  if (clicked) {
    d3.selectAll('g').each(function(d,i){
      let GID = d3.select(this).attr('id').replace('line', '').replace('boxid', '');
      const deleteLabel = String(body_num) + '-' + String(body);
      const deleteParts = deleteLabel.split('-');
      // delete edges
      if (GID.split('_').length === 2){
        let deleteFlag = false;
        const node1 = GID.split('_')[0];
        const node2 = GID.split('_')[1];
        const node1Parts = node1.split('-');
        const node2Parts = node2.split('-');
        if (arraysAreEqual(node1Parts, deleteParts)) {
          d3.select(this)
            .transition()        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
          deleteFlag = true;
        } else if (node1Parts.length > deleteParts.length) {
          const firstNParts = node1Parts.slice(0, deleteParts.length);
          if (JSON.stringify(firstNParts) === JSON.stringify(deleteParts)) {
            d3.select(this)
            .transition()        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
            deleteFlag = true;
          }
        }
        if (!deleteFlag) {
          if (arraysAreEqual(node2Parts, deleteParts)) {
            d3.select(this)
            .transition()        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
          } else if (node2Parts.length > deleteParts.length) {
            const firstNParts = node2Parts.slice(0, deleteParts.length);
            if (JSON.stringify(firstNParts) === JSON.stringify(deleteParts)) {
              d3.select(this)
            .transition()        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
            }
          }
        }
      } else { // delete nodes
        const GIDParts = GID.split('-');
        if (arraysAreEqual(GIDParts, deleteParts)) {
          d3.select(this)
            .transition()        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
        } else if (GIDParts.length > deleteParts.length) {
          const firstNParts = GIDParts.slice(0, deleteParts.length);
          if (JSON.stringify(firstNParts) === JSON.stringify(deleteParts)) {
            d3.select(this)
            .transition()        // 开始一个过渡
            .duration(transitionTime3)      // 设置过渡的持续时间
            .style('opacity', 0) // 逐渐变透明
            .end()
            .then(() => {
              d3.select(this).remove();
            });
          }
        }
      }
      // console.log(GID);
    })
    return;
  }
  body_num = String(body_num);
  const layout = getBoxLayout(fnS[body-1]);
  const spaceX = 80;
  const spaceY = 85;
  const padding = 90;
  const newLabel = String(body_num) + '-' + String(body); // new body_num
  drawBox(layout, fnS, newLabel);
  var hierarchies = {};
  const childrens = [];
  const gs = d3.selectAll('g').each(function(d, i){
    const nodeID = d3.select(this).attr('id').replace("boxid", "");
    if (nodeID.split('_').length !== 2) {
      const routes = nodeID.split("-");
      const currentID = routes[routes.length - 1];
      if (currentID==='0') {
          hierarchies.name = Number(currentID);
          hierarchies.oName = nodeID;
          hierarchies.path = routes;
          hierarchies.size = [Number(d3.select(this).attr('width')) + spaceY, Number(d3.select(this).attr('height'))];
      } else {
          const temp = {}
          temp.name = Number(currentID);
          temp.size = [Number(d3.select(this).attr('width')) + spaceY, Number(d3.select(this).attr('height'))];
          temp.path = routes;
          temp.oName = nodeID;
          childrens.push(temp);
      }
    }
  })
  childrens.sort(function(a,b){
    return a.path.length - b.path.length;
  })
  getChildren(hierarchies, childrens);
  loopOverHierarchy(hierarchies, d => {
    if (Array.isArray(d.size)) {
      if (!d._size) d._size = d.size.slice();
      d.size = d._size.slice().reverse();
    }
  });
  const flexLayout = flextree.flextree({ spacing: spaceX });
  console.log(hierarchies);
  const tree = flexLayout.hierarchy(hierarchies);
  var treeData = flexLayout(tree);
  treeData.each(d => {
    const x = d.x;
    d.x = d.y;
    d.y = x;
  });
  var treeLayout = {};
  treeData.each(d => {
    treeLayout[d.data.oName] = [d.x, d.y, d.data.size[1], d.data.size[0] * 1];
  });
  const nodeNames = Object.keys(treeLayout);
  const locationDrift = {};
  const nodesCoLevel = findChildrenAtSameLevel(nodeNames);
  if (nodesCoLevel.length !== 0) {
      nodesCoLevel.forEach(d => {
        d.forEach(d2 => {
          locationDrift[d2] = 1;
        })
      });
  }
  console.log(treeLayout);
  console.log(locationDrift);
  console.log()
  let differenceX = treeLayout[newLabel][0] - treeLayout[body_num][0];
  let differenceY = treeLayout[newLabel][1] - treeLayout[newLabel][3] / 2 - (treeLayout[body_num][1] - treeLayout[body_num][3] / 2);
  if (JSON.stringify(locationDrift) === '{}' || (!body_num in locationDrift && !newLabel in locationDrift)){
  } else if (body_num in locationDrift && newLabel in locationDrift) {
    differenceY = differenceY + (locationDrift[newLabel] - 1) * 5 * spaceX - (locationDrift[body_num] - 1) * 5 * spaceX;
  } else if (body_num in locationDrift && !(newLabel in locationDrift)) {
    differenceY = differenceY - (locationDrift[body_num] - 1) * 5 * spaceX;
  } else if (!(body_num in locationDrift) && newLabel in locationDrift){
    differenceY = differenceY + (locationDrift[newLabel] - 1) * 5 * spaceX;
  }
  
  const locationTransform = [differenceX, differenceY];
  drawLines(sourceid, "frame" + newLabel, locationTransform, body_num, newLabel, color);
  // console.log(locationTransform);
  d3.selectAll('g').each(function(d, i){
    let nodeID = d3.select(this).attr('id').replace("boxid", "");
    if (nodeID.split('_').length === 2){
      const lineID = nodeID;
      const sourceGID = nodeID.replace("line", "").split('_')[0];
      const targetGID = nodeID.replace("line", "").split('_')[1];
      const sourceTransString = d3.select("#boxid" + sourceGID).attr('transform');
      const targetTransString = d3.select("#boxid" + targetGID).attr('transform');
      if (sourceTransString!==null && sourceGID != newLabel){
        const translatePart = sourceTransString.slice(10, -1);
        const translateValues = translatePart.split(",");
        const transformArray = translateValues.map(Number);
        let newTransArray = [];
        if (JSON.stringify(locationDrift) === '{}' || !(sourceGID in locationDrift)) {
          newTransArray = [treeLayout[sourceGID][0] + padding, treeLayout[sourceGID][1] + padding *7.5 - treeLayout[sourceGID][3] / 2];
        } else {
          const yDrift = locationDrift[sourceGID] - 1;
          newTransArray = [treeLayout[sourceGID][0] + padding, treeLayout[sourceGID][1] + padding *7.5 - treeLayout[sourceGID][3] / 2 + yDrift * spaceX * 5];
        }
        // console.log(sourceGID);
        // console.log(transformArray);
        // console.log("----------");
        // console.log(newTransArray);
        if (transformArray[1]!==newTransArray[1] || transformArray[0]!==newTransArray[0]) {
          const a01 = d3.select(this).attr('sourceid');
          const a02 = d3.select(this).attr('targetid');
          let a03 = d3.select(this).attr('locationTransform').split(',');
          const a04 = d3.select(this).attr('body_num_source');
          const a05 = d3.select(this).attr('body_num_target');
          const a06 = d3.select(this).attr('color');
          const new03 = [Number(a03[0]) + newTransArray[0] - transformArray[0], Number(a03[1]) + newTransArray[1] - transformArray[1]];
          d3.select("#" + lineID).selectAll('path').remove();
          updateLines(a01, a02, new03, a04, a05, a06, lineID);
        }
      }
      if (targetTransString!==null && targetGID != newLabel){
        const translatePart = targetTransString.slice(10, -1);
        const translateValues = translatePart.split(",");
        const transformArray = translateValues.map(Number);
        let newTransArray = [];
        if (JSON.stringify(locationDrift) === '{}' || !(targetGID in locationDrift)) {
          newTransArray = [treeLayout[targetGID][0] + padding, treeLayout[targetGID][1] + padding *7.5 - treeLayout[targetGID][3] / 2];
        } else {
          const yDrift = locationDrift[targetGID] - 1;
          newTransArray = [treeLayout[targetGID][0] + padding, treeLayout[targetGID][1] + padding *7.5 - treeLayout[targetGID][3] / 2 + yDrift * spaceX * 5];
        }

        if (transformArray[1]!==newTransArray[1] || transformArray[0]!==newTransArray[0]) {
          const a01 = d3.select(this).attr('sourceid');
          const a02 = d3.select(this).attr('targetid');
          let a03 = d3.select(this).attr('locationTransform').split(',');
          const a04 = d3.select(this).attr('body_num_source');
          const a05 = d3.select(this).attr('body_num_target');
          const a06 = d3.select(this).attr('color');
          const new03 = [Number(a03[0]) + newTransArray[0] - transformArray[0], Number(a03[1]) + newTransArray[1] - transformArray[1]];
          updateLines(a01, a02, new03, a04, a05, a06, lineID);
        }
      }
      
      nodeID = nodeID.replace("line", "");
      nodeID = nodeID.split('_')[0];
      if (JSON.stringify(locationDrift) === '{}' || !(nodeID in locationDrift)) {
        d3.select(this)
          .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5 - treeLayout[nodeID][3] / 2})`)
          .style("opacity", 0.7);
      } else {
        const yDrift = locationDrift[nodeID] - 1;
        d3.select(this)
        .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5 - treeLayout[nodeID][3] / 2 + yDrift * spaceX * 5})`)
        .style("opacity", 0.7);
      }
    } else {
      if (nodeID === newLabel) {
        if (JSON.stringify(locationDrift) === '{}' || !(nodeID in locationDrift)) {
          d3.select(this)
            .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5 - treeLayout[nodeID][3] / 2})`)
            .attr("opacity", 0);
          d3.select(this)
            .transition()
            .duration(transitionTime1)
            .style("opacity", 1);
        } else {
          const yDrift = locationDrift[nodeID] - 1;
          d3.select(this)
          .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5 - treeLayout[nodeID][3] / 2 + yDrift * spaceX * 5})`)
          .attr("opacity", 0);
          d3.select(this)
            .transition()
            .duration(transitionTime1)
            .style("opacity", 1);
        }
      } else {
        if (JSON.stringify(locationDrift) === '{}' || !(nodeID in locationDrift)) {
          d3.select(this)
            .transition()
            .duration(transitionTime2)
            .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5 - treeLayout[nodeID][3] / 2})`);
        } else {
          const yDrift = locationDrift[nodeID] - 1;
          d3.select(this)
            .transition()
            .duration(transitionTime2)
            .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5 - treeLayout[nodeID][3] / 2 + yDrift * spaceX * 5})`);
        }
      }
    }
  }
  )
}