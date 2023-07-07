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
  
    const paddingL = 17;

    g.attr("sourceid", sourceid)
      .attr("targetid", targetid)
      .attr("locationTransform", locationTransform)
      .attr("body_num_source", body_num_source)
      .attr("body_num_target", body_num_target)
      .attr("color", color);

    let data1 = [
      {x: sourceX, y: sourceY},
      {x: controlPoint11.x, y: controlPoint11.y},
      {x: controlPoint12.x, y: controlPoint12.y},
      {x: targetX1, y: targetY1 + paddingL}
    ];

    let data2 = [
      {x: sourceX, y: sourceY},
      {x: controlPoint21.x, y: controlPoint21.y},
      {x: controlPoint22.x, y: controlPoint22.y},
      {x: targetX2, y: targetY2 - paddingL}
    ];

    let lineGenerator = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .curve(d3.curveBasis);
  
    let pathString1 = lineGenerator(data1);
    let pathElement1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement1.setAttribute('d', pathString1);

    let pathString2 = lineGenerator(data2);
    let pathElement2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement2.setAttribute('d', pathString2);
    
    let totalLength1 = pathElement1.getTotalLength();
    let totalLength2 = pathElement2.getTotalLength();

    const numPoints = 500;

    let points1 = [];
    for (let i = 0; i < numPoints; i++) {
        let point = pathElement1.getPointAtLength(i * totalLength1 / (numPoints - 1));
        points1.push({x: point.x, y: point.y});
    }

    let points2 = [];
    for (let i = 0; i < numPoints; i++) {
        let point = pathElement2.getPointAtLength(i * totalLength2 / (numPoints - 1));
        points2.push({x: point.x, y: point.y});
    }

    // 创建一个线性比例尺来对应x值
    let xScale1 = d3.scaleLinear()
    .domain(d3.extent(data1, function(d) { return d.x; }))
    .range([0, dx1]); // 假设width是你的SVG宽度

    // 根据x值找到相应的数据点
    let bisect1 = d3.bisector(function(d) { return d.x; }).left;

    // 创建一个线性比例尺来对应x值
    let xScale2 = d3.scaleLinear()
    .domain(d3.extent(data2, function(d) { return d.x; }))
    .range([0, dx1]); // 假设width是你的SVG宽度

    // 根据x值找到相应的数据点
    let bisect2 = d3.bisector(function(d) { return d.x; }).left;

    let area1 = d3.area()
      .x(function(d) { return d.x; })
      .y0( d => {
        const xValue = d.x;
        let indexOfNode = bisect1(points1, xScale1.invert(xValue));
        if(indexOfNode >= points1.length - 1) indexOfNode = points1.length - 2;
        if(indexOfNode < 1) indexOfNode = 1;
        let pointBefore = points1[indexOfNode - 1];
        let pointAfter = points1[indexOfNode + 1];
        let slope = Math.abs((pointAfter.y - pointBefore.y) / (pointAfter.x - pointBefore.x));
        let linewidth = 6 * Math.pow(((d.x - sourceX + 2) / dx1), 0.38);
        return d.y - Math.sqrt(1+slope**2) * linewidth;
      })
      .y1( d => {
        const xValue = d.x;
        let indexOfNode = bisect1(points1, xScale1.invert(xValue));
        if(indexOfNode >= points1.length - 1) indexOfNode = points1.length - 2;
        if(indexOfNode < 1) indexOfNode = 1;
        let pointBefore = points1[indexOfNode - 1];
        let pointAfter = points1[indexOfNode + 1];
        let slope = Math.abs((pointAfter.y - pointBefore.y) / (pointAfter.x - pointBefore.x));
        let linewidth = 6 * Math.pow(((d.x - sourceX + 2) / dx1), 0.38);
        return d.y + Math.sqrt(1+slope**2) * linewidth;
      })
      .curve(d3.curveBasis);

    let area2 = d3.area()
      .x(function(d) { return d.x; })
      .y0( d => {
        const xValue = d.x;
        let indexOfNode = bisect2(points2, xScale2.invert(xValue));
        if(indexOfNode >= points2.length - 1) indexOfNode = points2.length - 2;
        if(indexOfNode < 1) indexOfNode = 1;
        let pointBefore = points2[indexOfNode - 1];
        let pointAfter = points2[indexOfNode + 1];
        let slope = Math.abs((pointAfter.y - pointBefore.y) / (pointAfter.x - pointBefore.x));
        let linewidth = 6 * Math.pow(((d.x - sourceX + 2) / dx1), 0.38);
        return d.y - Math.sqrt(1+slope**2) * linewidth;
      })
      .y1(d => {
        const xValue = d.x;
        let indexOfNode = bisect2(points2, xScale2.invert(xValue));
        if(indexOfNode >= points2.length - 1) indexOfNode = points2.length - 2;
        if(indexOfNode < 1) indexOfNode = 1;
        let pointBefore = points2[indexOfNode - 1];
        let pointAfter = points2[indexOfNode + 1];
        let slope = Math.abs((pointAfter.y - pointBefore.y) / (pointAfter.x - pointBefore.x));
        let linewidth = 6 * Math.pow(((d.x - sourceX + 2) / dx1), 0.38);
        return d.y + Math.sqrt(1+slope**2) * linewidth;
      })
      .curve(d3.curveBasis);

    let path1 = g.append("path")
    .datum(data1)
    .attr("d", area1)
    .attr('id', 'path1')
    .attr("fill", color);
  
    let path2 = g.append("path")
    .datum(data2)
    .attr("d", area2)
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

    const paddingL = 17;

    g.attr("sourceid", sourceid)
        .attr("targetid", targetid)
        .attr("locationTransform", locationTransform)
        .attr("body_num_source", body_num_source)
        .attr("body_num_target", body_num_target)
        .attr("color", color);


    let data1 = [
      {x: sourceX, y: sourceY},
      {x: controlPoint11.x, y: controlPoint11.y},
      {x: controlPoint12.x, y: controlPoint12.y},
      {x: targetX1, y: targetY1 + paddingL}
    ];

    let data2 = [
      {x: sourceX, y: sourceY},
      {x: controlPoint21.x, y: controlPoint21.y},
      {x: controlPoint22.x, y: controlPoint22.y},
      {x: targetX2, y: targetY2 - paddingL}
    ];

    let lineGenerator = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .curve(d3.curveBasis);
  
    let pathString1 = lineGenerator(data1);
    let pathElement1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement1.setAttribute('d', pathString1);

    let pathString2 = lineGenerator(data2);
    let pathElement2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement2.setAttribute('d', pathString2);
    
    let totalLength1 = pathElement1.getTotalLength();
    let totalLength2 = pathElement2.getTotalLength();

    const numPoints = 500;

    let points1 = [];
    for (let i = 0; i < numPoints; i++) {
        let point = pathElement1.getPointAtLength(i * totalLength1 / (numPoints - 1));
        points1.push({x: point.x, y: point.y});
    }

    let points2 = [];
    for (let i = 0; i < numPoints; i++) {
        let point = pathElement2.getPointAtLength(i * totalLength2 / (numPoints - 1));
        points2.push({x: point.x, y: point.y});
    }

    // 创建一个线性比例尺来对应x值
    let xScale1 = d3.scaleLinear()
    .domain(d3.extent(data1, function(d) { return d.x; }))
    .range([0, dx1]); // 假设width是你的SVG宽度

    // 根据x值找到相应的数据点
    let bisect1 = d3.bisector(function(d) { return d.x; }).left;

    // 创建一个线性比例尺来对应x值
    let xScale2 = d3.scaleLinear()
    .domain(d3.extent(data2, function(d) { return d.x; }))
    .range([0, dx1]); // 假设width是你的SVG宽度

    // 根据x值找到相应的数据点
    let bisect2 = d3.bisector(function(d) { return d.x; }).left;

    let area1 = d3.area()
      .x(function(d) { return d.x; })
      .y0( d => {
        const xValue = d.x;
        let indexOfNode = bisect1(points1, xScale1.invert(xValue));
        if(indexOfNode >= points1.length - 1) indexOfNode = points1.length - 2;
        if(indexOfNode < 1) indexOfNode = 1;
        let pointBefore = points1[indexOfNode - 1];
        let pointAfter = points1[indexOfNode + 1];
        let slope = Math.abs((pointAfter.y - pointBefore.y) / (pointAfter.x - pointBefore.x));
        let linewidth = 6 * Math.pow(((d.x - sourceX + 2) / dx1), 0.38);
        return d.y - Math.sqrt(1+slope**2) * linewidth;
      })
      .y1( d => {
        const xValue = d.x;
        let indexOfNode = bisect1(points1, xScale1.invert(xValue));
        if(indexOfNode >= points1.length - 1) indexOfNode = points1.length - 2;
        if(indexOfNode < 1) indexOfNode = 1;
        let pointBefore = points1[indexOfNode - 1];
        let pointAfter = points1[indexOfNode + 1];
        let slope = Math.abs((pointAfter.y - pointBefore.y) / (pointAfter.x - pointBefore.x));
        let linewidth = 6 * Math.pow(((d.x - sourceX + 2) / dx1), 0.38);
        return d.y + Math.sqrt(1+slope**2) * linewidth;
      })
      .curve(d3.curveBasis);

    let area2 = d3.area()
      .x(function(d) { return d.x; })
      .y0( d => {
        const xValue = d.x;
        let indexOfNode = bisect2(points2, xScale2.invert(xValue));
        if(indexOfNode >= points2.length - 1) indexOfNode = points2.length - 2;
        if(indexOfNode < 1) indexOfNode = 1;
        let pointBefore = points2[indexOfNode - 1];
        let pointAfter = points2[indexOfNode + 1];
        let slope = Math.abs((pointAfter.y - pointBefore.y) / (pointAfter.x - pointBefore.x));
        let linewidth = 6 * Math.pow(((d.x - sourceX + 2) / dx1), 0.38);
        return d.y - Math.sqrt(1+slope**2) * linewidth;
      })
      .y1(d => {
        const xValue = d.x;
        let indexOfNode = bisect2(points2, xScale2.invert(xValue));
        if(indexOfNode >= points2.length - 1) indexOfNode = points2.length - 2;
        if(indexOfNode < 1) indexOfNode = 1;
        let pointBefore = points2[indexOfNode - 1];
        let pointAfter = points2[indexOfNode + 1];
        let slope = Math.abs((pointAfter.y - pointBefore.y) / (pointAfter.x - pointBefore.x));
        let linewidth = 6 * Math.pow(((d.x - sourceX + 2) / dx1), 0.38);
        return d.y + Math.sqrt(1+slope**2) * linewidth;
      })
      .curve(d3.curveBasis);

    let path1 = g.select("#path1")
    .datum(data1)
    .transition()
    .duration(720)
    .attr("d", area1)
    .attr("fill", color);

    let path2 = g.select("#path2")
    .datum(data2)
    .transition()
    .duration(720)
    .attr("d", area2)
    .attr("fill", color);
}