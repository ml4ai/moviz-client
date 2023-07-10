/* eslint-disable */
import { drawBox } from "./drawBox";
import { drawLines, updateLines, drawLinesDashArrow, updateLinesDashArrow } from "./drawlines";
import { getBoxLayout, getTreeLayout } from "./layout";
import { arraysAreEqual, loopOverHierarchy, getChildren, findChildrenAtSameLevel } from "./utilities";
import * as flextree from "d3-flextree"
import * as d3 from "d3";

export function handleClickCond(fnS, cond, body_if, body_else, body_num, sourceid, color, clicked) {
  const transitionTime1 = 920;
  const transitionTime2 = 720;
  const transitionTime3 = 200;
  const openFlag = d3.select("#boxid" + String(body_num)).select("#" + String(sourceid));
  if (clicked || openFlag.attr("data-opened") === "true") {
    // openFlag.attr("data-opened", "false");
    d3.select("#boxid" + String(body_num)).selectAll("[data-opened='true']").attr("data-opened", "false");
    d3.selectAll('g').each(function(d,i){
      let GID = d3.select(this).attr('id').replace('line', '').replace('boxid', '');
      const deleteLabel = String(body_num) + '-' + String(cond);
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
  const layoutCond = getBoxLayout(fnS[cond-1]);
  const layoutIf = getBoxLayout(fnS[body_if-1]);
  const layoutElse = getBoxLayout(fnS[body_else-1]);
  const spaceX = 80;
  const spaceY = 100;
  const padding = 90;
  const newLabelCond = String(body_num) + '-' + String(cond); // new body_num for Cond
  const newLabelIf = String(newLabelCond) + '-' + String(body_if); // new body_num for if
  const newLabelElse = String(newLabelCond) + '-' + String(body_else); // new body_num for else
  drawBox(layoutCond, fnS, newLabelCond);
  drawBox(layoutIf, fnS, newLabelIf);
  drawBox(layoutElse, fnS, newLabelElse);
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

  console.log(treeLayout);
  console.log()
  let differenceX = treeLayout[newLabelCond][0] - treeLayout[body_num][0];
  let differenceY = treeLayout[newLabelCond][1] - treeLayout[newLabelCond][3] / 2 - (treeLayout[body_num][1] - treeLayout[body_num][3] / 2);
  
  const locationTransform = [differenceX, differenceY];
  drawLines(sourceid, "frame" + newLabelCond, locationTransform, body_num, newLabelCond, color);
  drawLinesDashArrow(treeLayout, newLabelCond, newLabelIf, "black", "TRUE");
  drawLinesDashArrow(treeLayout, newLabelCond, newLabelElse, "black", "FALSE");

  // console.log(locationTransform);
  d3.selectAll('g').each(function(d, i){
    let nodeID = d3.select(this).attr('id').replace("boxid", "");
    if (nodeID.split('_').length === 2){
      if (d3.select(this).attr("line-type") !== "dashed") {
        const lineID = nodeID;
        const sourceGID = nodeID.replace("line", "").split('_')[0];
        const targetGID = nodeID.replace("line", "").split('_')[1];
        const sourceTransString = d3.select("#boxid" + sourceGID).attr('transform');
        const targetTransString = d3.select("#boxid" + targetGID).attr('transform');
        if (sourceTransString!==null && sourceGID != newLabelCond){
          const translatePart = sourceTransString.slice(10, -1);
          const translateValues = translatePart.split(",");
          const transformArray = translateValues.map(Number);
          let newTransArray = [];
          newTransArray = [treeLayout[sourceGID][0] + padding, treeLayout[sourceGID][1] + padding *7.5 - treeLayout[sourceGID][3] / 2];
          const locationTransformForThis = [treeLayout[targetGID][0] - treeLayout[sourceGID][0], treeLayout[targetGID][1] - treeLayout[targetGID][3] / 2 - (treeLayout[sourceGID][1] - treeLayout[sourceGID][3] / 2)];
          if (transformArray[1]!==newTransArray[1] || transformArray[0]!==newTransArray[0]) {
            const a01 = d3.select(this).attr('sourceid');
            const a02 = d3.select(this).attr('targetid');
            let a03 = d3.select(this).attr('locationTransform').split(',');
            const a04 = d3.select(this).attr('body_num_source');
            const a05 = d3.select(this).attr('body_num_target');
            const a06 = d3.select(this).attr('color');
            // const new03 = [Number(a03[0]) + newTransArray[0] - transformArray[0], Number(a03[1]) + newTransArray[1] - transformArray[1]];
            // d3.select("#" + lineID).selectAll('*').remove();
            updateLines(a01, a02, locationTransformForThis, a04, a05, a06, lineID);
          }
        }
        if (targetTransString!==null && targetGID != newLabelCond){
          const translatePart = targetTransString.slice(10, -1);
          const translateValues = translatePart.split(",");
          const transformArray = translateValues.map(Number);
          let newTransArray = [];
          newTransArray = [treeLayout[targetGID][0] + padding, treeLayout[targetGID][1] + padding *7.5 - treeLayout[targetGID][3] / 2];
          const locationTransformForThis = [treeLayout[targetGID][0] - treeLayout[sourceGID][0], treeLayout[targetGID][1] - treeLayout[targetGID][3] / 2 - (treeLayout[sourceGID][1] - treeLayout[sourceGID][3] / 2)];
          if (transformArray[1]!==newTransArray[1] || transformArray[0]!==newTransArray[0]) {
            const a01 = d3.select(this).attr('sourceid');
            const a02 = d3.select(this).attr('targetid');
            let a03 = d3.select(this).attr('locationTransform').split(',');
            const a04 = d3.select(this).attr('body_num_source');
            const a05 = d3.select(this).attr('body_num_target');
            const a06 = d3.select(this).attr('color');
            // const new03 = [Number(a03[0]) + newTransArray[0] - transformArray[0], Number(a03[1]) + newTransArray[1] - transformArray[1]];
            // d3.select("#" + lineID).selectAll('*').remove();
            updateLines(a01, a02, locationTransformForThis, a04, a05, a06, lineID);
          }
        }
        
        nodeID = nodeID.replace("line", "");
        nodeID = nodeID.split('_')[0];
        d3.select(this)
          .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5 - treeLayout[nodeID][3] / 2})`)
          .style("opacity", 0.38);
      } else {
        const lineID = nodeID;
        const sourceGID = nodeID.replace("line", "").split('_')[0];
        const targetGID = nodeID.replace("line", "").split('_')[1];
        const sourceTransString = d3.select("#boxid" + sourceGID).attr('transform');
        const targetTransString = d3.select("#boxid" + targetGID).attr('transform');
        if (sourceTransString!==null && sourceGID != newLabelCond) {
          const translatePart = sourceTransString.slice(10, -1);
          const translateValues = translatePart.split(",");
          const transformArray = translateValues.map(Number);
          let newTransArray = [];
          newTransArray = [treeLayout[sourceGID][0] + padding, treeLayout[sourceGID][1] + padding *7.5 - treeLayout[sourceGID][3] / 2];
          if (transformArray[1]!==newTransArray[1] || transformArray[0]!==newTransArray[0]) {
            const line_label = d3.select(this).select('text').text();
            updateLinesDashArrow(treeLayout, sourceGID, targetGID, "black", line_label, lineID);
          }
        }
        if (targetTransString!==null && targetGID != newLabelCond){
          const translatePart = targetTransString.slice(10, -1);
          const translateValues = translatePart.split(",");
          const transformArray = translateValues.map(Number);
          let newTransArray = [];
          newTransArray = [treeLayout[targetGID][0] + padding, treeLayout[targetGID][1] + padding *7.5 - treeLayout[targetGID][3] / 2];
          if (transformArray[1]!==newTransArray[1] || transformArray[0]!==newTransArray[0]) {
            const line_label = d3.select(this).select('text').text();
            updateLinesDashArrow(treeLayout, sourceGID, targetGID, "black", line_label, lineID);
          }
        }
        nodeID = nodeID.replace("line", "");
        nodeID = nodeID.split('_')[0];
        d3.select(this)
          // .transition()
          // .duration(720)
          .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5 - treeLayout[nodeID][3] / 2})`);
      }
    } else {
      if (nodeID === newLabelCond || nodeID === newLabelElse || nodeID === newLabelIf) {
        d3.select(this)
          .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5 - treeLayout[nodeID][3] / 2})`)
          .attr("opacity", 0);
        d3.select(this)
          .transition()
          .duration(transitionTime1)
          .style("opacity", 1);
      } else {
        d3.select(this)
          .transition()
          .duration(transitionTime2)
          .attr("transform", `translate(${treeLayout[nodeID][0] + padding},${treeLayout[nodeID][1] + padding *7.5 - treeLayout[nodeID][3] / 2})`);
      }
    }
  }
  )
}