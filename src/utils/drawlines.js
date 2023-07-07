/* eslint-disable */
import * as d3 from "d3";

export function drawLines(sourceid, targetid, locationTransform, body_num_source, body_num_target, color) {
    console.log("sourceid, ", sourceid);
    console.log("targetid, ", targetid);
    console.log("locationTransform, ", locationTransform);
    console.log("body_num_source, ", body_num_source);
    console.log("body_num_target, ", body_num_target);
    console.log("color, ", color);
  
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
  
export function updateLines(sourceid, targetid, locationTransform, body_num_source, body_num_target, color, lineID) {
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