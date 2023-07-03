/* eslint-disable */
import { drawBox } from "./drawBox";
import { getBoxLayout, getTreeLayout } from "./layout";
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
  const spaceX = 20;
  const spaceY = 80;
  const padding = 80;
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
    treeLayout[d.data.oName] = [d.x, d.y, d.data.size[1], d.data.size[0] * 0];
  });
  const nodeNames = Object.keys(treeLayout);
  const locationDrift = {};
  const nodesCoLevel = findChildrenAtSameLevel(nodeNames);
  if (nodesCoLevel.length !== 0) {
      nodesCoLevel.forEach(d => {
        d.forEach(d2 => {
          locationDrift[d2] = d.length;
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
      
      // drawLines(a01, a02, a03, a04, a05, a06);
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

function loopOverHierarchy(d, callback) {
    callback(d);
    if (d.children) d.children.forEach(c => loopOverHierarchy(c, callback));
    if (d._children) d._children.forEach(c => loopOverHierarchy(c, callback));
  }

function getChildren(hierarchies, childrens) {
  var children = hierarchies;
  var zoomin = 2;
  childrens.forEach(function(element){
  element.path.forEach(function(node){
    if (Number(node) !== 0) {
        if (node !== element.path[element.path.length - 1] && zoomin === element.path.length - 1) {
            const filterChild = children.children.filter(function(item){
                return Number(item.name) === Number(node);
            })[0]
            zoomin += 1
            children = filterChild;
        }
        else if (node === element.path[element.path.length - 1]) {
            if (children.hasOwnProperty("children")) {
                children.children.push(element);
                sortByOName(children.children);
            } else {
                children.children = [ element ];
            }
        }
    }
  })
})
}

function findChildrenAtSameLevel(arr) {
  const paths = {};

  for (let i = 0; i < arr.length; i++) {
    const path = arr[i];
    const lastIndex = path.lastIndexOf('-');

    if (lastIndex !== -1) {
      const parentPath = path.slice(0, lastIndex);

      if (!paths[parentPath]) {
        paths[parentPath] = [];
      }

      paths[parentPath].push(path);
    }
  }

  const similarPaths = Object.values(paths).filter(pathGroup => pathGroup.length > 1);

  return similarPaths;
}

function drawLines(sourceid, targetid, locationTransform, body_num_source, body_num_target, color) {
  // console.log("sourceid, ", sourceid);
  // console.log("targetid, ", targetid);
  // console.log("locationTransform, ", locationTransform);
  // console.log("body_num_source, ", body_num_source);
  // console.log("body_num_target, ", body_num_target);
  // console.log("color, ", color);


  const sourceX = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('x')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('width'));
  const sourceY = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('y')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('height')) / 2;
  const targetX1 = Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
  const targetX2= Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
  const targetY1 = Number(d3.select("#" + targetid).attr('y')) + locationTransform[1];
  const targetY2 = Number(d3.select("#" + targetid).attr('y')) + Number(d3.select("#" + targetid).attr('height')) + locationTransform[1];
  const dx1 = targetX1 - sourceX;
  const dy1 = targetY1 - sourceY;
  const dx2 = targetX2 - sourceX;
  const dy2 = targetY2 - sourceY;
  const controlPoint11 = {};
  const controlPoint12 = {};
  const controlPoint21 = {};
  const controlPoint22 = {};
  controlPoint11.x = sourceX + 0.25 * 1.5 * dx1;
  controlPoint11.y = sourceY + 0.25 * 1.2 * dy1;
  controlPoint12.x = sourceX + 0.75 * 0.8 * dx1;
  controlPoint12.y = sourceY + 0.75 * 1.0 * dy1;
  controlPoint21.x = sourceX + 0.25 * 1.5 * dx2;
  controlPoint21.y = sourceY + 0.25 * 1.2 * dy2;
  controlPoint22.x = sourceX + 0.75 * 0.8 * dx2;
  controlPoint22.y = sourceY + 0.75 * 1.0 * dy2;

  const g = d3.select('svg').append("g").attr('id', 'line' + String(body_num_source) + '_' + String(body_num_target));

  g.attr("sourceid", sourceid)
    .attr("targetid", targetid)
    .attr("locationTransform", locationTransform)
    .attr("body_num_source", body_num_source)
    .attr("body_num_target", body_num_target)
    .attr("color", color);


  let area = d3.area()
  .x(function(d) { return d.x; })
  .y0(function(d) { return d.y - 0.03 * d.x;;})
  .y1(function(d) { return d.y  + 0.03 * d.x; })
  .curve(d3.curveBasis);

  const paddingL = 10;
    // .x0(function(d) { return d.x; })
  // .y0(function(d) { return d.y; })
  // .x1(function(d) { return d.x; })
  // .y1(function(d) { return d.y + d.height; })

  let path1 = g.append("path")
  .datum([
    {x: sourceX, y: sourceY},
    {x: controlPoint11.x, y: controlPoint11.y},
    {x: controlPoint12.x, y: controlPoint12.y},
    {x: targetX1, y: targetY1 + paddingL}
  ])
  .attr("d", area)
  .attr('id', 'path1')
  .attr("fill", color);

  let path2 = g.append("path")
  .datum([
    {x: sourceX, y: sourceY},
    {x: controlPoint21.x, y: controlPoint21.y},
    {x: controlPoint22.x, y: controlPoint22.y},
    {x: targetX2, y: targetY2 - paddingL}
  ])
  .attr("d", area)
  .attr('id', 'path2')
  .attr("fill", color);
}

function updateLines(sourceid, targetid, locationTransform, body_num_source, body_num_target, color, lineID) {
  // console.log("sourceid, ", sourceid);
  // console.log("targetid, ", targetid);
  // console.log("locationTransform, ", locationTransform);
  // console.log("body_num_source, ", body_num_source);
  // console.log("body_num_target, ", body_num_target);
  // console.log("color, ", color);

  const sourceX = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('x')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('width'));
  const sourceY = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('y')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('height')) / 2;
  const targetX1 = Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
  const targetX2= Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
  const targetY1 = Number(d3.select("#" + targetid).attr('y')) + locationTransform[1];
  const targetY2 = Number(d3.select("#" + targetid).attr('y')) + Number(d3.select("#" + targetid).attr('height')) + locationTransform[1];
  const dx1 = targetX1 - sourceX;
  const dy1 = targetY1 - sourceY;
  const dx2 = targetX2 - sourceX;
  const dy2 = targetY2 - sourceY;
  const controlPoint11 = {};
  const controlPoint12 = {};
  const controlPoint21 = {};
  const controlPoint22 = {};
  controlPoint11.x = sourceX + 0.25 * 1.5 * dx1;
  controlPoint11.y = sourceY + 0.25 * 1.2 * dy1;
  controlPoint12.x = sourceX + 0.75 * 0.8 * dx1;
  controlPoint12.y = sourceY + 0.75 * 1.0 * dy1;
  controlPoint21.x = sourceX + 0.25 * 1.5 * dx2;
  controlPoint21.y = sourceY + 0.25 * 1.2 * dy2;
  controlPoint22.x = sourceX + 0.75 * 0.8 * dx2;
  controlPoint22.y = sourceY + 0.75 * 1.0 * dy2;

  const g = d3.select('#' + lineID);

  g.attr("sourceid", sourceid)
    .attr("targetid", targetid)
    .attr("locationTransform", locationTransform)
    .attr("body_num_source", body_num_source)
    .attr("body_num_target", body_num_target)
    .attr("color", color);


  let area = d3.area()
  .x(function(d) { return d.x; })
  .y0(function(d) { return d.y - 0.03 * d.x;;})
  .y1(function(d) { return d.y  + 0.03 * d.x; })
  .curve(d3.curveBasis);

  const paddingL = 10;

  const datumForPath1 = [
    {x: sourceX, y: sourceY},
    {x: controlPoint11.x, y: controlPoint11.y},
    {x: controlPoint12.x, y: controlPoint12.y},
    {x: targetX1, y: targetY1 + paddingL}
  ];

  const datumForPath2 = [
    {x: sourceX, y: sourceY},
    {x: controlPoint21.x, y: controlPoint21.y},
    {x: controlPoint22.x, y: controlPoint22.y},
    {x: targetX2, y: targetY2 - paddingL}
  ];

  let path1 = g.select("#path1")
  .datum(datumForPath1)
  .transition()
  .duration(720)
  .attr("d", area)
  .attr("fill", color);

  let path2 = g.select("#path2")
  .datum(datumForPath2)
  .transition()
  .duration(720)
  .attr("d", area)
  .attr("fill", color);
}

function arraysAreEqual(array1, array2) {

  if (array1.length !== array2.length) {
      return false;
  }

  for (var i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
          return false;
      }
  }

  return true;
}

function sortByOName(arr) {
  return arr.sort((a, b) => {
      const aNums = a.oName.split('-').map(Number);
      const bNums = b.oName.split('-').map(Number);

      // 根据数字依次进行比较
      for(let i = 0; i < aNums.length; i++) {
          if (aNums[i] < bNums[i]) {
              return -1;
          } else if (aNums[i] > bNums[i]) {
              return 1;
          }
          // 如果相等，继续比较下一个数字
      }

      // 如果所有数字都相等，返回0表示不需要改变顺序
      return 0;
  });
}

  // const curvePath = d3.path();
  // curvePath.moveTo(sourceX, sourceY);
  // curvePath.bezierCurveTo(
  //   sourceX + dx1 / 2, sourceY + dy1 / 2,
  //   targetX1 - dx1 / 2, targetY1 - dy1 /2,
  //   targetX1, targetY1
  // );
  // curvePath.moveTo(sourceX, sourceY);
  // curvePath.bezierCurveTo(
  //   sourceX + dx2 / 2, sourceY + dy2 / 2,
  //   targetX2 - dx2 / 2, targetY2 - dy2 / 2,
  //   targetX2, targetY2
  // );

    // const curve = g.append("path")
  // .attr("d", curvePath.toString())
  // .style("fill", "none")
  // .style("stroke", "url(#curve-gradient)");