/* eslint-disable */
import * as d3 from "d3";

export function drawLines(sourceid, targetid, locationTransform, body_num_source, body_num_target, color, direction) {
    // console.log("sourceid, ", sourceid);
    // console.log("targetid, ", targetid);
    // console.log("locationTransform, ", locationTransform);
    // console.log("body_num_source, ", body_num_source);
    // console.log("body_num_target, ", body_num_target);
    // console.log("color, ", color);
  
    // d3.select("#boxid" + body_num_source).select("#" + sourceid).attr("data-opened", "true");
    let sourceX = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('x')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('width'));
    let sourceY = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('y')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('height')) / 2;
    let targetX1 = Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
    let targetX2= Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
    let targetY1 = Number(d3.select("#" + targetid).attr('y')) + locationTransform[1];
    let targetY2 = Number(d3.select("#" + targetid).attr('y')) + Number(d3.select("#" + targetid).attr('height')) + locationTransform[1];
    let dx1 = targetX1 - sourceX;
    let dy1 = targetY1 - sourceY;
    let dx2 = targetX2 - sourceX;
    let dy2 = targetY2 - sourceY;
    let controlPoint11 = {};
    let controlPoint12 = {};
    let controlPoint21 = {};
    let controlPoint22 = {};
    controlPoint11.x = sourceX + 0.25 * 1.5 * dx1;
    controlPoint11.y = sourceY + 0.25 * 1.2 * dy1;
    controlPoint12.x = sourceX + 0.75 * 0.8 * dx1;
    controlPoint12.y = sourceY + 0.75 * 1.0 * dy1;
    controlPoint21.x = sourceX + 0.25 * 1.5 * dx2;
    controlPoint21.y = sourceY + 0.25 * 1.2 * dy2;
    controlPoint22.x = sourceX + 0.75 * 0.8 * dx2;
    controlPoint22.y = sourceY + 0.75 * 1.0 * dy2;

    if (direction === "down") {
      sourceX = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('x')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('width')) / 2;
      sourceY = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('y')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('height'));
      targetX1 = Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
      targetX2= Number(d3.select("#" + targetid).attr('x')) + locationTransform[0] + Number(d3.select("#" + targetid).attr('width'));
      targetY1 = Number(d3.select("#" + targetid).attr('y')) + locationTransform[1];
      targetY2 = Number(d3.select("#" + targetid).attr('y')) + locationTransform[1];
      dx1 = targetX1 - sourceX;
      dy1 = targetY1 - sourceY;
      dx2 = targetX2 - sourceX;
      dy2 = targetY2 - sourceY;
      controlPoint11 = {};
      controlPoint12 = {};
      controlPoint21 = {};
      controlPoint22 = {};
      controlPoint11.x = sourceX + 0.25 * 1.5 * dx1;
      controlPoint11.y = sourceY + 0.25 * 1.2 * dy1;
      controlPoint12.x = sourceX + 0.75 * 0.8 * dx1;
      controlPoint12.y = sourceY + 0.75 * 1.0 * dy1;
      controlPoint21.x = sourceX + 0.25 * 1.5 * dx2;
      controlPoint21.y = sourceY + 0.25 * 1.2 * dy2;
      controlPoint22.x = sourceX + 0.75 * 0.8 * dx2;
      controlPoint22.y = sourceY + 0.75 * 1.0 * dy2;
    }
  
    const g = d3.select('svg').select('#sumGroup').append("g").attr('id', 'line' + String(body_num_source) + '_' + String(body_num_target)).attr('class', 'drawer');
  
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

    if (direction==="down") {
      data1 = [
        {x: sourceX, y: sourceY},
        {x: controlPoint11.x, y: controlPoint11.y},
        {x: controlPoint12.x, y: controlPoint12.y},
        {x: targetX1 + paddingL, y: targetY1}
      ];
  
      data2 = [
        {x: sourceX, y: sourceY},
        {x: controlPoint21.x, y: controlPoint21.y},
        {x: controlPoint22.x, y: controlPoint22.y},
        {x: targetX2 - paddingL, y: targetY2}
      ];
    }
    console.log(data1,data2);
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

    if (direction==="down") {
      // 创建一个线性比例尺来对应y值
      xScale1 = d3.scaleLinear()
      .domain(d3.extent(data1, function(d) { return d.y; }))
      .range([0, dy1]);

      // 根据y值找到相应的数据点
      bisect1 = d3.bisector(function(d) { return d.y; }).left;

      // 创建一个线性比例尺来对应y值
      xScale2 = d3.scaleLinear()
      .domain(d3.extent(data2, function(d) { return d.y; }))
      .range([0, dy1]);

      // 根据y值找到相应的数据点
      bisect2 = d3.bisector(function(d) { return d.y; }).left;
    }
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
        let linewidth = 6 * Math.pow(((d.x - sourceX + 2) / dx2), 0.38);
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
        let linewidth = 6 * Math.pow(((d.x - sourceX + 2) / dx2), 0.38);
        return d.y + Math.sqrt(1+slope**2) * linewidth;
      })
      .curve(d3.curveBasis);

    if (direction==="down") {
      area1 = d3.area()
        .y(function(d) { return d.y; })
        .x0( d => {
          const yValue = d.y;
          let indexOfNode = bisect1(points1, xScale1.invert(yValue));
          if(indexOfNode >= points1.length - 1) indexOfNode = points1.length - 2;
          if(indexOfNode < 1) indexOfNode = 1;
          let pointBefore = points1[indexOfNode - 1];
          let pointAfter = points1[indexOfNode + 1];
          let slope = Math.abs((pointAfter.x - pointBefore.x) / (pointAfter.y - pointBefore.y));
          // let slope = 0;
          let linewidth = 6 * Math.pow(((d.y - sourceY + 2) / dy1), 0.38);
          return d.x - Math.sqrt(1+slope**2) * linewidth;
        })
        .x1( d => {
          const yValue = d.y;
          let indexOfNode = bisect1(points1, xScale1.invert(yValue));
          if(indexOfNode >= points1.length - 1) indexOfNode = points1.length - 2;
          if(indexOfNode < 1) indexOfNode = 1;
          let pointBefore = points1[indexOfNode - 1];
          let pointAfter = points1[indexOfNode + 1];
          let slope = Math.abs((pointAfter.x - pointBefore.x) / (pointAfter.y - pointBefore.y));
          // let slope = 0;
          let linewidth = 6 * Math.pow(((d.y - sourceY + 2) / dy1), 0.38);
          return d.x + Math.sqrt(1+slope**2) * linewidth;
        })
        .curve(d3.curveBasis);

      area2 = d3.area()
        .y(function(d) { return d.y; })
        .x0( d => {
          const yValue = d.y;
          let indexOfNode = bisect2(points2, xScale2.invert(yValue));
          if(indexOfNode >= points2.length - 1) indexOfNode = points2.length - 2;
          if(indexOfNode < 1) indexOfNode = 1;
          let pointBefore = points2[indexOfNode - 1];
          let pointAfter = points2[indexOfNode + 1];
          let slope = Math.abs((pointAfter.x - pointBefore.x) / (pointAfter.y - pointBefore.y));
          // let slope = 0;
          let linewidth = 6 * Math.pow(((d.y - sourceY + 2) / dy2), 0.38);
          return d.x - Math.sqrt(1+slope**2) * linewidth;
        })
        .x1(d => {
          const yValue = d.y;
          let indexOfNode = bisect2(points2, xScale2.invert(yValue));
          if(indexOfNode >= points2.length - 1) indexOfNode = points2.length - 2;
          if(indexOfNode < 1) indexOfNode = 1;
          let pointBefore = points2[indexOfNode - 1];
          let pointAfter = points2[indexOfNode + 1];
          let slope = Math.abs((pointAfter.x - pointBefore.x) / (pointAfter.y - pointBefore.y));
          // let slope = 0;
          let linewidth = 6 * Math.pow(((d.y - sourceY + 2) / dy2), 0.38);
          return d.x + Math.sqrt(1+slope**2) * linewidth;
        })
        .curve(d3.curveBasis);
    }
    // console.log(area1,area2);

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

    d3.select("#boxid" + body_num_source).selectAll("rect").each(function(d,i){
      const currentNode = d3.select(this);
      const currentNodeId = currentNode.attr("id");
      if (currentNodeId !== sourceid) {
        const currentNodeBody = currentNode.attr("data-body");
        if (currentNodeBody !== undefined && currentNodeBody !== null && currentNodeBody === body_num_target.split('-')[1] ) {
          currentNode.attr("data-opened", true);
          const sourceXforSL = Number(currentNode.attr('x')) + Number(currentNode.attr('width'));
          const sourceYforSL = Number(currentNode.attr('y')) + Number(currentNode.attr('height')) / 2;
          const targetXforSL= Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
          const targetYforSL = Number(d3.select("#" + targetid).attr('y')) + locationTransform[1] + Number(d3.select("#" + targetid).attr('height')) / 2;
          g.append("circle")
            .attr("cx", targetXforSL)
            .attr("cy", targetYforSL)
            .attr("r", 7)  // 设置圆的半径
            .attr("fill", color);  // 设置圆的颜色

          g.append("line")
            .attr("x1", sourceXforSL)
            .attr("y1", sourceYforSL)
            .attr("x2", targetXforSL)
            .attr("y2", targetYforSL)
            .attr("stroke-width", 3)  // 设置线的宽度
            .attr("stroke", color)  // 设置线的颜色
            .attr("stroke-dasharray", "5,5")  // 设置线为虚线，"5,5"表示线段和间隔的长度
            .attr("marker-end", "url(#arrow)")  // 设置线的终点为箭头
            .attr("class", "arrowLine");
        }
      }
    })

  }
  
export function updateLines(sourceid, targetid, locationTransform, body_num_source, body_num_target, color, lineID, direction) {
    // console.log("sourceid, ", sourceid);
    // console.log("targetid, ", targetid);
    // console.log("locationTransform, ", locationTransform);
    // console.log("body_num_source, ", body_num_source);
    // console.log("body_num_target, ", body_num_target);
    // console.log("color, ", color);

    let sourceX = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('x')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('width'));
    let sourceY = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('y')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('height')) / 2;
    let targetX1 = Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
    let targetX2= Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
    let targetY1 = Number(d3.select("#" + targetid).attr('y')) + locationTransform[1];
    let targetY2 = Number(d3.select("#" + targetid).attr('y')) + Number(d3.select("#" + targetid).attr('height')) + locationTransform[1];
    let dx1 = targetX1 - sourceX;
    let dy1 = targetY1 - sourceY;
    let dx2 = targetX2 - sourceX;
    let dy2 = targetY2 - sourceY;
    let controlPoint11 = {};
    let controlPoint12 = {};
    let controlPoint21 = {};
    let controlPoint22 = {};
    controlPoint11.x = sourceX + 0.25 * 1.5 * dx1;
    controlPoint11.y = sourceY + 0.25 * 1.2 * dy1;
    controlPoint12.x = sourceX + 0.75 * 0.8 * dx1;
    controlPoint12.y = sourceY + 0.75 * 1.0 * dy1;
    controlPoint21.x = sourceX + 0.25 * 1.5 * dx2;
    controlPoint21.y = sourceY + 0.25 * 1.2 * dy2;
    controlPoint22.x = sourceX + 0.75 * 0.8 * dx2;
    controlPoint22.y = sourceY + 0.75 * 1.0 * dy2;
    if (direction === "down") {
      sourceX = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('x')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('width')) / 2;
      sourceY = Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('y')) + Number(d3.select("#boxid" + body_num_source).select("#" + sourceid).attr('height'));
      targetX1 = Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
      targetX2= Number(d3.select("#" + targetid).attr('x')) + locationTransform[0] + Number(d3.select("#" + targetid).attr('width'));
      targetY1 = Number(d3.select("#" + targetid).attr('y')) + locationTransform[1];
      targetY2 = Number(d3.select("#" + targetid).attr('y')) + locationTransform[1];
      dx1 = targetX1 - sourceX;
      dy1 = targetY1 - sourceY;
      dx2 = targetX2 - sourceX;
      dy2 = targetY2 - sourceY;
      controlPoint11 = {};
      controlPoint12 = {};
      controlPoint21 = {};
      controlPoint22 = {};
      controlPoint11.x = sourceX + 0.25 * 1.5 * dx1;
      controlPoint11.y = sourceY + 0.25 * 1.2 * dy1;
      controlPoint12.x = sourceX + 0.75 * 0.8 * dx1;
      controlPoint12.y = sourceY + 0.75 * 1.0 * dy1;
      controlPoint21.x = sourceX + 0.25 * 1.5 * dx2;
      controlPoint21.y = sourceY + 0.25 * 1.2 * dy2;
      controlPoint22.x = sourceX + 0.75 * 0.8 * dx2;
      controlPoint22.y = sourceY + 0.75 * 1.0 * dy2;
    }
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

    if (direction==="down") {
      data1 = [
        {x: sourceX, y: sourceY},
        {x: controlPoint11.x, y: controlPoint11.y},
        {x: controlPoint12.x, y: controlPoint12.y},
        {x: targetX1 + paddingL, y: targetY1}
      ];
  
      data2 = [
        {x: sourceX, y: sourceY},
        {x: controlPoint21.x, y: controlPoint21.y},
        {x: controlPoint22.x, y: controlPoint22.y},
        {x: targetX2 - paddingL, y: targetY2}
      ];
    }

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

    if (direction==="down") {
      // 创建一个线性比例尺来对应y值
      xScale1 = d3.scaleLinear()
      .domain(d3.extent(data1, function(d) { return d.y; }))
      .range([0, dy1]);

      // 根据y值找到相应的数据点
      bisect1 = d3.bisector(function(d) { return d.y; }).left;

      // 创建一个线性比例尺来对应y值
      xScale2 = d3.scaleLinear()
      .domain(d3.extent(data2, function(d) { return d.y; }))
      .range([0, dy1]);

      // 根据y值找到相应的数据点
      bisect2 = d3.bisector(function(d) { return d.y; }).left;
    }
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

    if (direction==="down") {
      area1 = d3.area()
        .y(function(d) { return d.y; })
        .x0( d => {
          const yValue = d.y;
          let indexOfNode = bisect1(points1, xScale1.invert(yValue));
          if(indexOfNode >= points1.length - 1) indexOfNode = points1.length - 2;
          if(indexOfNode < 1) indexOfNode = 1;
          let pointBefore = points1[indexOfNode - 1];
          let pointAfter = points1[indexOfNode + 1];
          let slope = Math.abs((pointAfter.x - pointBefore.x) / (pointAfter.y - pointBefore.y));
          // let slope = 0;
          let linewidth = 6 * Math.pow(((d.y - sourceY + 2) / dy1), 0.38);
          return d.x - Math.sqrt(1+slope**2) * linewidth;
        })
        .x1( d => {
          const yValue = d.y;
          let indexOfNode = bisect1(points1, xScale1.invert(yValue));
          if(indexOfNode >= points1.length - 1) indexOfNode = points1.length - 2;
          if(indexOfNode < 1) indexOfNode = 1;
          let pointBefore = points1[indexOfNode - 1];
          let pointAfter = points1[indexOfNode + 1];
          let slope = Math.abs((pointAfter.x - pointBefore.x) / (pointAfter.y - pointBefore.y));
          // let slope = 0;
          let linewidth = 6 * Math.pow(((d.y - sourceY + 2) / dy1), 0.38);
          return d.x + Math.sqrt(1+slope**2) * linewidth;
        })
        .curve(d3.curveBasis);

      area2 = d3.area()
        .y(function(d) { return d.y; })
        .x0( d => {
          const yValue = d.y;
          let indexOfNode = bisect2(points2, xScale2.invert(yValue));
          if(indexOfNode >= points2.length - 1) indexOfNode = points2.length - 2;
          if(indexOfNode < 1) indexOfNode = 1;
          let pointBefore = points2[indexOfNode - 1];
          let pointAfter = points2[indexOfNode + 1];
          let slope = Math.abs((pointAfter.x - pointBefore.x) / (pointAfter.y - pointBefore.y));
          // let slope = 0;
          let linewidth = 6 * Math.pow(((d.y - sourceY + 2) / dy2), 0.38);
          return d.x - Math.sqrt(1+slope**2) * linewidth;
        })
        .x1(d => {
          const yValue = d.y;
          let indexOfNode = bisect2(points2, xScale2.invert(yValue));
          if(indexOfNode >= points2.length - 1) indexOfNode = points2.length - 2;
          if(indexOfNode < 1) indexOfNode = 1;
          let pointBefore = points2[indexOfNode - 1];
          let pointAfter = points2[indexOfNode + 1];
          let slope = Math.abs((pointAfter.x - pointBefore.x) / (pointAfter.y - pointBefore.y));
          // let slope = 0;
          let linewidth = 6 * Math.pow(((d.y - sourceY + 2) / dy2), 0.38);
          return d.x + Math.sqrt(1+slope**2) * linewidth;
        })
        .curve(d3.curveBasis);
    }
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

    d3.select("#boxid" + body_num_source).selectAll("rect").each(function(d,i){
      const currentNode = d3.select(this);
      const currentNodeId = currentNode.attr("id");
      if (currentNodeId !== sourceid) {
        const currentNodeBody = currentNode.attr("data-body");
        if (currentNodeBody !== undefined && currentNodeBody !== null && currentNodeBody === body_num_target.split('-')[1] ) {
          const sourceXforSL = Number(currentNode.attr('x')) + Number(currentNode.attr('width'));
          const sourceYforSL = Number(currentNode.attr('y')) + Number(currentNode.attr('height')) / 2;
          const targetXforSL= Number(d3.select("#" + targetid).attr('x')) + locationTransform[0];
          const targetYforSL = Number(d3.select("#" + targetid).attr('y')) + locationTransform[1] + Number(d3.select("#" + targetid).attr('height')) / 2;
          g.select("circle")
            .transition()
            .duration(720)
            .attr("cx", targetXforSL)
            .attr("cy", targetYforSL)
            .attr("r", 7)  // 设置圆的半径
            .attr("fill", color);  // 设置圆的颜色

          g.select("line")
            .transition()
            .duration(720)
            .attr("x1", sourceXforSL)
            .attr("y1", sourceYforSL)
            .attr("x2", targetXforSL)
            .attr("y2", targetYforSL)
            .attr("stroke-width", 3)  // 设置线的宽度
            .attr("stroke", color)  // 设置线的颜色
            .attr("stroke-dasharray", "5,5")  // 设置线为虚线，"5,5"表示线段和间隔的长度
            .attr("marker-end", "url(#arrow)")  // 设置线的终点为箭头
            .attr("class", "arrowLine");
        }
      }
      
    })
}

export function drawLinesDashArrow(treeLayout, sourceID, targetID, color, label, direction) {
  // d3.select("#boxid" + body_num_source).select("#" + sourceid).attr("data-opened", "true");
  const sourceFrame = "frame" + sourceID;
  const targetFrame = "frame" + targetID;
  let dx = treeLayout[targetID][0] - treeLayout[sourceID][0] - Number(d3.select("#" + sourceFrame).attr('width'));
  let dy = treeLayout[targetID][1] - treeLayout[sourceID][1];
  let sourceX = Number(d3.select("#" + sourceFrame).attr('x')) + Number(d3.select("#" + sourceFrame).attr('width'));
  let sourceY = Number(d3.select("#" + sourceFrame).attr('y')) + Number(d3.select("#" + sourceFrame).attr('height')) / 2;
  let targetX = sourceX + dx;
  let targetY = sourceY + dy;
  if (direction==="down") {
    sourceX = Number(d3.select("#" + sourceFrame).attr('x')) + Number(d3.select("#" + sourceFrame).attr('width')) / 2;
    sourceY = Number(d3.select("#" + sourceFrame).attr('y')) + Number(d3.select("#" + sourceFrame).attr('height'));
    dx = treeLayout[targetID][0] - treeLayout[sourceID][0];
    dy = treeLayout[targetID][1] - treeLayout[sourceID][1] - Number(d3.select("#" + sourceFrame).attr('height'));
    targetX = sourceX + dx;
    targetY = sourceY + dy;
  }
  const g = d3.select('svg').select('#sumGroup').append("g").attr('id', 'line' + String(sourceID) + '_' + String(targetID)).attr("line-type", "dashed").attr('class', 'drawer');
  const paddingL = 17;
  g.append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("markerWidth", 5)  // 原来的一半
    .attr("markerHeight", 3.5)  // 原来的一半
    .attr("refX", 5)  // 调整参考点以适应新的大小
    .attr("refY", 1.75)  // 调整参考点以适应新的大小
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,0 L5,1.75 L0,3.5 Z")  // 缩小箭头的路径
  .style("fill", "gray");
  g.append("line")
    .attr("x1", sourceX)
    .attr("y1", sourceY)
    .attr("x2", targetX)
    .attr("y2", targetY)
    .attr("stroke-width", 5)  // 设置线的宽度
    .attr("stroke", color)  // 设置线的颜色
    .attr("stroke-dasharray", "5,5")  // 设置线为虚线，"5,5"表示线段和间隔的长度
    .attr("marker-end", "url(#arrow)")  // 设置线的终点为箭头
    .attr("class", "arrowLine");
  let midX = (sourceX + targetX) / 2 - 45;
  let midY = (sourceY + targetY) / 2 - 5;
  g.append("text")
    .attr("x", midX)
    .attr("y", midY)
    .text(label)
    .style("font-size", "30px")  // 设置字体大小
    .style("fill", "black");  // 设置字体颜色
}

export function updateLinesDashArrow(treeLayout, sourceID, targetID, color, label, lineID, direction) {
  // d3.select("#boxid" + body_num_source).select("#" + sourceid).attr("data-opened", "true");
  let sourceFrame = "frame" + sourceID;
  let targetFrame = "frame" + targetID;
  let dx = treeLayout[targetID][0] - treeLayout[sourceID][0] - Number(d3.select("#" + sourceFrame).attr('width'));
  let dy = treeLayout[targetID][1] - treeLayout[sourceID][1];
  let sourceX = Number(d3.select("#" + sourceFrame).attr('x')) + Number(d3.select("#" + sourceFrame).attr('width'));
  let sourceY = Number(d3.select("#" + sourceFrame).attr('y')) + Number(d3.select("#" + sourceFrame).attr('height')) / 2;
  let targetX = sourceX + dx;
  let targetY = sourceY + dy;
  if (direction==="down") {
    sourceX = Number(d3.select("#" + sourceFrame).attr('x')) + Number(d3.select("#" + sourceFrame).attr('width')) / 2;
    sourceY = Number(d3.select("#" + sourceFrame).attr('y')) + Number(d3.select("#" + sourceFrame).attr('height'));
    dx = treeLayout[targetID][0] - treeLayout[sourceID][0];
    dy = treeLayout[targetID][1] - treeLayout[sourceID][1] - Number(d3.select("#" + sourceFrame).attr('height'));
    targetX = sourceX + dx;
    targetY = sourceY + dy;
  }
  const g = d3.select('svg').select('#sumGroup').select("#" + lineID);
  g.select("line")
    .transition()
    .duration(720)
    .attr("x1", sourceX)
    .attr("y1", sourceY)
    .attr("x2", targetX)
    .attr("y2", targetY)
    .attr("stroke-width", 5)  // 设置线的宽度
    .attr("stroke", color)  // 设置线的颜色
    .attr("stroke-dasharray", "5,5")  // 设置线为虚线，"5,5"表示线段和间隔的长度
    .attr("marker-end", "url(#arrow)")  // 设置线的终点为箭头
    .attr("class", "arrowLine");
  let midX = (sourceX + targetX) / 2 - 45;
  let midY = (sourceY + targetY) / 2 - 5;
  g.select("text")
    .transition()
    .duration(720)
    .attr("x", midX)
    .attr("y", midY)
    .text(label)
    .style("font-size", "30px")  // 设置字体大小
    .style("fill", "black");  // 设置字体颜色
}