/* eslint-disable */
import * as dagre from 'dagre';

export function getBoxLayout(data) {
  const graph = new dagre.graphlib.Graph({ compound: true });
  graph.setGraph({});
  // eslint-disable-next-line
  graph.setDefaultEdgeLabel(() => { return {}; });
  // get bf for all
  if ('bf' in data) {
    for (let i = 0; i < data.bf.length; i += 1) {
      // eslint-disable-next-line
      const node = data.bf[i];
      const nodeId = `bf-${i}`;
      const label = node.name;
      const type = node.function_type;
      const value = node.value;
      const body = node.body;
      graph.setNode(nodeId, { label, value, type, body });
      // add auxi node for each bf
      const auxLabel = 'aux';
      const width = 1;
      const height = 1;
      graph.setNode(`aux-${nodeId}`, { auxLabel, width, height });
      // graph.setParent(`aux-${nodeId}`, nodeId);
    }
  }

  // get pif
  if ('pif' in data) {
    for (let i = 0; i < data.pif.length; i += 1) {
      const node = data.pif[i];
      const nodeId = `pif-${i}`;
      const label = node.name;
      const width = 50;
      const height = 50;
      graph.setNode(nodeId, { label, width, height });
      graph.setParent(nodeId, `bf-${node.box - 1}`);
    }
  }

  // get pof
  if ('pof' in data) {
    for (let i = 0; i < data.pof.length; i += 1) {
      const node = data.pof[i];
      const nodeId = `pof-${i}`;
      const label = node.name;
      const width = 50;
      const height = 50;
      graph.setNode(nodeId, { label, width, height });
      graph.setParent(nodeId, `bf-${node.box - 1}`);
    }
  }

  // get opo
  if ('opo' in data) {
    for (let i = 0; i < data.opo.length; i += 1) {
      const node = data.opo[i];
      const nodeId = `opo-${i}`;
      const label = node.name;
      const width = 50;
      const height = 50;
      graph.setNode(nodeId, { label, width, height });
      // graph.setParent(nodeId, `bf-${node.box - 1}`);
    }
  }

  // get opi
  if ('opi' in data) {
    for (let i = 0; i < data.opi.length; i += 1) {
      const node = data.opi[i];
      const nodeId = `opi-${i}`;
      const label = node.name;
      const width = 50;
      const height = 50;
      graph.setNode(nodeId, { label, width, height });
      // graph.setParent(nodeId, `bf-${node.box - 1}`);
    }
  }

  // set edges wff
  if ('wff' in data) {
    for (let i = 0; i < data.wff.length; i += 1) {
      const edge = data.wff[i];
      const srcNodeId = `pif-${edge.src - 1}`;
      const tgtNodeId = `pof-${edge.tgt - 1}`;
      graph.setEdge(srcNodeId, tgtNodeId);
    }
  }

  // set edges wfopi
  if ('wfopi' in data) {
    for (let i = 0; i < data.wfopi.length; i += 1) {
      const edge = data.wfopi[i];
      const srcNodeId = `pif-${edge.src - 1}`;
      const tgtNodeId = `opi-${edge.tgt - 1}`;
      graph.setEdge(srcNodeId, tgtNodeId);
    }
  }

  // set edges wfopo
  if ('wfopo' in data) {
    for (let i = 0; i < data.wfopo.length; i += 1) {
      const edge = data.wfopo[i];
      const srcNodeId = `opo-${edge.src - 1}`;
      const tgtNodeId = `pof-${edge.tgt - 1}`;
      graph.setEdge(srcNodeId, tgtNodeId);
    }
  }

  // set edges wopio
  if ('wopio' in data) {
    for (let i = 0; i < data.wopio.length; i += 1) {
      const edge = data.wopio[i];
      const srcNodeId = `opo-${edge.src - 1}`;
      const tgtNodeId = `opi-${edge.tgt - 1}`;
      graph.setEdge(srcNodeId, tgtNodeId);
    }
  }

  // set bc
  if ('bc' in data) {
    for (let i = 0; i < data.bc.length; i += 1) {
      // eslint-disable-next-line
      const node = data.bc[i];
      const nodeId = `bc-${i}`;
      const label = node.name;
      const type = node.function_type;
      const value = node.value;
      const condition = node.condition;
      const body_if = node.body_if;
      const body_else = node.body_else;
      graph.setNode(nodeId, { label, value, type, condition, body_if, body_else });
      // add auxi node for each bc
      const auxLabel = 'aux';
      const width = 1;
      const height = 1;
      graph.setNode(`aux-${nodeId}`, { auxLabel, width, height });
      // graph.setParent(`aux-${nodeId}`, nodeId);
    }
  }

  // set pic
  if ('pic' in data) {
    for (let i = 0; i < data.pic.length; i += 1) {
      const node = data.pic[i];
      const nodeId = `pic-${i}`;
      const label = node.name;
      const width = 50;
      const height = 50;
      graph.setNode(nodeId, { label, width, height });
      graph.setParent(nodeId, `bc-${node.box - 1}`);
    }
  }

  // set poc
  if ('poc' in data) {
    for (let i = 0; i < data.poc.length; i += 1) {
      const node = data.poc[i];
      const nodeId = `poc-${i}`;
      const label = node.name;
      const width = 50;
      const height = 50;
      graph.setNode(nodeId, { label, width, height });
      graph.setParent(nodeId, `bc-${node.box - 1}`);
    }
  }

  // set wfc
  if ('wfc' in data) {
    for (let i = 0; i < data.wfc.length; i += 1) {
      const edge = data.wfc[i];
      const srcNodeId = `pic-${edge.src - 1}`;
      const tgtNodeId = `pof-${edge.tgt - 1}`;
      graph.setEdge(srcNodeId, tgtNodeId);
    }
  }

  // set wcf
  if ('wcf' in data) {
    for (let i = 0; i < data.wcf.length; i += 1) {
      const edge = data.wcf[i];
      const srcNodeId = `pif-${edge.src - 1}`;
      const tgtNodeId = `poc-${edge.tgt - 1}`;
      graph.setEdge(srcNodeId, tgtNodeId);
    }
  }

  // set wcc
  if ('wcc' in data) {
    for (let i = 0; i < data.wcc.length; i += 1) {
      const edge = data.wcc[i];
      const srcNodeId = `pic-${edge.src - 1}`;
      const tgtNodeId = `poc-${edge.tgt - 1}`;
      graph.setEdge(srcNodeId, tgtNodeId);
    }
  }

  // set edges wcopi
  if ('wcopi' in data) {
    for (let i = 0; i < data.wcopi.length; i += 1) {
      const edge = data.wcopi[i];
      const srcNodeId = `pic-${edge.src - 1}`;
      const tgtNodeId = `opi-${edge.tgt - 1}`;
      graph.setEdge(srcNodeId, tgtNodeId);
    }
  }

  // set edges wcopo
  if ('wcopo' in data) {
    for (let i = 0; i < data.wcopo.length; i += 1) {
      const edge = data.wcopo[i];
      const srcNodeId = `opo-${edge.src - 1}`;
      const tgtNodeId = `poc-${edge.tgt - 1}`;
      graph.setEdge(srcNodeId, tgtNodeId);
    }
  }

  // add auxi edges
  if ('pif' in data) {
    for (let i = 0; i < data.pif.length; i += 1) {
      const nodeID = `pif-${i}`;
      const pifNode = data.pif[i];
      const auxID = `aux-bf-${pifNode.box - 1}`;
      const hasIncomingEdges = graph.predecessors(nodeID).length > 0;
      if (!hasIncomingEdges) {
        graph.setEdge(auxID, nodeID);
      }
    }
  }
  if ('pof' in data) {
    for (let i = 0; i < data.pof.length; i += 1) {
      const nodeID = `pof-${i}`;
      const pofNode = data.pof[i];
      const auxID = `aux-bf-${pofNode.box - 1}`;
      const hasOutgoingEdges = graph.successors(nodeID).length > 0;
      if (!hasOutgoingEdges) {
        graph.setEdge(nodeID, auxID);
      }
    }
  }
  if ('pic' in data) {
    for (let i = 0; i < data.pic.length; i += 1) {
      const nodeID = `pic-${i}`;
      const picNode = data.pic[i];
      const auxID = `aux-bc-${picNode.box - 1}`;
      const hasIncomingEdges = graph.predecessors(nodeID).length > 0;
      if (!hasIncomingEdges) {
        graph.setEdge(auxID, nodeID);
      }
    }
  }
  if ('poc' in data) {
    for (let i = 0; i < data.poc.length; i += 1) {
      const nodeID = `poc-${i}`;
      const pocNode = data.poc[i];
      const auxID = `aux-bc-${pocNode.box - 1}`;
      const hasOutgoingEdges = graph.successors(nodeID).length > 0;
      if (!hasOutgoingEdges) {
        graph.setEdge(nodeID, auxID);
      }
    }
  }
  const bfNodes = graph.nodes().filter(node => node.startsWith('bf'));
  const bcNodes = graph.nodes().filter(node => node.startsWith('bc'));
  const opoNodes = graph.nodes().filter(node => node.startsWith('opo'));
  const opiNodes = graph.nodes().filter(node => node.startsWith('opi'));
  const parentNodes = [...bcNodes,...bfNodes, ...opoNodes, ...opiNodes];
  const superNodes = groupParentNodes(graph, parentNodes);

  // console.log(graph);
  // eslint-disable-next-line
  // console.log(graph);
  // execute layout calculation
  graph.setGraph({ ranksep: 30, rankdir: 'BT' });
  dagre.layout(graph);

  if (Object.keys(superNodes).length>1) {
    arrangeSuperNodes(graph,superNodes);
  }

  // get layout result
  const layout = {
    nodes: {},
    edges: [],
  };
  console.log(data);
  graph.nodes().forEach((nodeId) => {
    const node = graph.node(nodeId);
    layout.nodes[nodeId] = {
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      label: node.label,
      type: node.type,
      value: node.value,
      body: node.body,
      condition: node.condition,
      body_if: node.body_if,
      body_else: node.body_else
    };
  });
  graph.edges().forEach((edge, i) => {
    layout.edges.push({
      id: i,
      source: edge.v,
      target: edge.w,
    });
  });
  // console.log(layout);
  // set attributes for bf
  if ('bf' in data) {
    for (let i = 0; i < data.bf.length; i += 1) {
      const bfNodeId = `bf-${i}`;
      if (('pif' in data) && ('pof' in data)) {
        const pofNode = data.pof.find(node => node.box === i + 1);
        const pifNode = data.pif.find(node => node.box === i + 1);
        if (pofNode && pifNode) {
          layout.nodes[bfNodeId].fullBox = true;
        } else {
          layout.nodes[bfNodeId].fullBox = false;
        }
      } else {
        layout.nodes[bfNodeId].fullBox = false;
      }
    }
  }
  if ('bc' in data) {
    for (let i = 0; i < data.bf.length; i += 1) {
      const bcNodeId = `bc-${i}`;
      if (('pic' in data) && ('poc' in data)) {
        const pocNode = data.poc.find(node => node.box === i + 1);
        const picNode = data.pic.find(node => node.box === i + 1);
        if (pocNode && picNode) {
          layout.nodes[bcNodeId].fullBox = true;
        } else {
          layout.nodes[bcNodeId].fullBox = false;
        }
      } else {
        layout.nodes[bcNodeId].fullBox = false;
      }
    }
  }

  // set meta data for layout
  layout.meta = {};
  layout.meta.name = data.b[0].name;
  layout.meta.identifier = `${data.b[0].function_type}-${data.b[0].metadata}`;
  layout.meta.type = data.b[0].function_type;
  return layout;
}

class UnionFind {
  constructor(elements) {
    this.parent = {};
    elements.forEach(e => this.parent[e] = e);
  }

  find(x) {
    if(this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const parentX = this.find(x);
    const parentY = this.find(y);
    if(parentX !== parentY) {
      this.parent[parentY] = parentX;
    }
  }
}

function isEdgeBetweenChildNodes(graph, parentNode1, parentNode2) {
  let nodes1 = [];
  let nodes2 = [];

  if (parentNode1.startsWith("opo") || parentNode1.startsWith("opi")) {
    nodes1.push(parentNode1);
  } else {
    nodes1 = graph.children(parentNode1);
  }

  if (parentNode2.startsWith("opo") || parentNode2.startsWith("opi")) {
    nodes2.push(parentNode2);
  } else {
    nodes2 = graph.children(parentNode2);
  }

  for (const node1 of nodes1) {
    for (const node2 of nodes2) {
      if (graph.edge(node1, node2) || graph.edge(node2, node1)) {
        return true;
      }
    }
  }

  return false;
}

function groupParentNodes(graph, parentNodes) {
  const uf = new UnionFind(parentNodes);
  for(let i = 0; i < parentNodes.length; i++) {
    for(let j = i+1; j < parentNodes.length; j++) {
      if(isEdgeBetweenChildNodes(graph, parentNodes[i], parentNodes[j])) {
        uf.union(parentNodes[i], parentNodes[j]);
      }
    }
  }
  const groups = {};
  parentNodes.forEach(node => {
    const root = uf.find(node);
    if(!groups[root]) {
      groups[root] = [];
    }
    groups[root].push(node);
  });

  let superNodeCounter = 0;
  const superNodes = {};
  let previousSuperNodeId = null;
  for (let root in groups) {
    const superNodeId = `aux-super-${superNodeCounter}`;
    const label = `aux-super`;
    const virtual = true;
    graph.setNode(superNodeId, { label, virtual });
    groups[root].forEach(node => graph.setParent(node, superNodeId));
    superNodes[superNodeId] = groups[root];
    
    // Now there is a bug of dagre, it can not set an edge between group nodes
    if (previousSuperNodeId) {
      // graph.setEdge(previousSuperNodeId, superNodeId);
    }
    previousSuperNodeId = superNodeId;
    superNodeCounter++;
  }

  return superNodes;
}

function adjustChildNodesPosition(graph, parentNodeId, deltaX, deltaY) {
  const children = graph.children(parentNodeId);
  children.forEach(childId => {
    const childNode = graph.node(childId);
    
    childNode.x += deltaX;
    childNode.y += deltaY;

    if (graph.children(childId).length>0){
      adjustChildNodesPosition(graph, childId, deltaX, deltaY);
    }

    if (childId.split('-')[0]==="bf") {
      // console.log("aux-" + childId);
      adjustAuxNodesPosition(graph, "aux-" + childId, deltaX, deltaY);
    }

    if (childId.split('-')[0]==="bc") {
      // console.log("aux-" + childId);
      adjustAuxNodesPosition(graph, "aux-" + childId, deltaX, deltaY);
    }
  });
}

function adjustAuxNodesPosition(graph, auxNodeId, deltaX, deltaY) {
  const auxNode = graph.node(auxNodeId);
  auxNode.x += deltaX;
  auxNode.y += deltaY;
}

function arrangeSuperNodes(graph, superNodes) {
  const nodeSpacing = 50; // 超级节点之间的间距
  let currentY = 0;

  // 根据超级节点创建顺序进行排序
  const superNodeIds = Object.keys(superNodes);
  superNodeIds.sort((a, b) => parseInt(a.split('-')[2]) - parseInt(b.split('-')[2]));

  // 获取第一个超级节点，保持其位置不变
  const firstSuperNode = graph.node(superNodeIds[0]);
  const firstSuperNodeCenterX = firstSuperNode.x + 100;
  firstSuperNode.x += 100;
  currentY = firstSuperNode.y;
  adjustChildNodesPosition(graph, superNodeIds[0], 100, 0);

  // 从第二个超级节点开始遍历，调整其位置
  for (let i = 1; i < superNodeIds.length; i++) {
    
    const superNodeId = superNodeIds[i];
    const preSuperNode = graph.node(superNodeIds[i-1]);
    const superNode = graph.node(superNodeId);
    currentY += nodeSpacing + superNode.height / 2 + preSuperNode.height / 2;

    // 计算移动距离
    const deltaX = firstSuperNodeCenterX - superNode.x;
    const deltaY = currentY - superNode.y;

    // 将超级节点移动到新的中心点
    superNode.x += deltaX;
    superNode.y += deltaY;

    // 更新超级节点的子节点的坐标
    adjustChildNodesPosition(graph, superNodeId, deltaX, deltaY);

    // 更新下一个超级节点的y坐标
    // currentY += superNode.height + nodeSpacing;
  }
}



// function isEdgeBetweenChildNodes(graph, parentNode1, parentNode2) {
//   // 获取父节点的子节点
//   const children1 = graph.children(parentNode1);
//   const children2 = graph.children(parentNode2);

//   // 遍历每一对子节点，检查它们之间是否存在边缘
//   for (const child1 of children1) {
//     for (const child2 of children2) {
//       if (graph.edge(child1, child2) || graph.edge(child2, child1)) {
//         // 如果找到了边缘，返回true
//         return true;
//       }
//     }
//   }

//   // 如果没有找到边缘，返回false
//   return false;
// }

// function groupParentNodesWithConnectedChildren(graph, parentNodeIds) {
//   // 为每个父节点创建一个集合
//   const sets = new Map(parentNodeIds.map(id => [id, new Set([id])]));

//   // 超级父节点计数器
//   let superParentCounter = 0;

//   // 对每一对父节点进行迭代
//   for (let i = 0; i < parentNodeIds.length; i++) {
//     for (let j = i + 1; j < parentNodeIds.length; j++) {
//       // 检查父节点的子节点之间是否存在连接
//       if (isEdgeBetweenChildNodes(graph, parentNodeIds[i], parentNodeIds[j])) {
//         // 如果存在连接，将这两个节点的集合合并
//         const set1 = sets.get(parentNodeIds[i]);
//         const set2 = sets.get(parentNodeIds[j]);

//         const newSet = new Set([...set1, ...set2]);

//         // 更新集合映射
//         newSet.forEach(id => sets.set(id, newSet));
//       }
//     }
//   }

//   // 创建超级父节点
//   const visited = new Set();
//   const superParentNodes = [];

//   sets.forEach((set, id) => {
//     // 忽略已经访问过的节点
//     if (visited.has(id)) return;

//     const superParentNodeId = `aux-super-${superParentCounter++}`;

//     // 设置超级父节点的子节点
//     set.forEach(id => {
//       graph.setParent(id, superParentNodeId);
//       visited.add(id);
//     });

//     superParentNodes.push(superParentNodeId);
//   });

//   return superParentNodes;
// }


export function getTreeLayout(data) {
  const g = new dagre.graphlib.Graph({ compound: true });
  g.setGraph({});
  // eslint-disable-next-line
  g.setDefaultEdgeLabel(() => { return {}; });

  g.setGraph(data.graph);

  data.subgraphs.forEach((subgraph) => {
    const filteredAttributes = {};
    Object.keys(subgraph.attributes).forEach((key) => {
      if (key === 'label') {
        filteredAttributes[key] = subgraph.attributes[key];
      }
    });
    g.setNode(subgraph.name, filteredAttributes);
    subgraph.nodes.forEach((node) => {
      const filteredAttributesN = {};
      Object.keys(node.attributes).forEach((key) => {
        if (key === 'label') {
          filteredAttributesN[key] = node.attributes[key];
        }
      });
      g.setNode(node.name, filteredAttributesN);
      g.setParent(node.name, subgraph.name);
    });
  });

  data.edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);
  // eslint-disable-next-line
  // console.log(g);
  // // eslint-disable-next-line
  // console.log(g.edges());

  // const svg = d3.select('.svg-container').append('svg');
  // // eslint-disable-next-line
  // const inner = svg.append('g');
  // // eslint-disable-next-line
  // const render = new dagreD3.render();
  // // eslint-disable-next-line
  // render(inner, g);
}
