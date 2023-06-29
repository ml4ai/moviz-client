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

  // eslint-disable-next-line
  // console.log(graph);
  // execute layout calculation
  graph.setGraph({ ranksep: 30, rankdir: 'BT' });
  dagre.layout(graph);

  // get layout result
  const layout = {
    nodes: {},
    edges: [],
  };
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
    };
  });
  graph.edges().forEach((edge, i) => {
    layout.edges.push({
      id: i,
      source: edge.v,
      target: edge.w,
    });
  });

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

  // set meta data for layout
  layout.meta = {};
  layout.meta.name = data.b[0].name;
  layout.meta.identifier = `${data.b[0].function_type}-${data.b[0].metadata}`;
  layout.meta.type = data.b[0].function_type;
  return layout;
}

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
