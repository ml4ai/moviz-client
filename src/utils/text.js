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