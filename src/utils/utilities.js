/* eslint-disable */
import * as d3 from "d3";

export function arraysAreEqual(array1, array2) {
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

export function relayoutPorts(nodesObject) {
    let overlap = false;
    let leftLimit = false;
    const nodes = Object.values(nodesObject);
    console.log(nodes);
    nodes.sort(function(a, b){
        return a.x - b.x;
    });
    let previousX = -999999;
    nodes.forEach(function(node, index){
        // if (node.x-previousX>54){
        //     previousX = node.x;
        // } else {
        //     overlap = true;
        //     if (node.x - 55 < 0) {
        //         leftLimit = true;
        //     } else {
        //         nodes[index-1].x = node.x - 55;
        //     }
        // }
        if (node.x-previousX<57){
            overlap = true;
        } else {
            previousX = node.x;
        }
    })
    while (overlap==true) {
        overlap = false;
        if (leftLimit==false){
            previousX = -999999;
            nodes.forEach(function(node, index){
                if (node.x-previousX>57){
                    previousX = node.x;
                } else {
                    overlap = true;
                    if (node.x - 60 < 0) {
                        leftLimit = true;
                    } else {
                        nodes[index-1].x = node.x - 60;
                    }
                }
            })
        } else {
            nodes.forEach(function(node, index){
                previousX = -999999;
                if (node.x-previousX>57){
                    previousX = node.x;
                } else {
                    overlap = true;
                    if (node.x - 60 < 0) {
                        leftLimit = true;
                    } else {
                        node.x = previousX + 60;
                    }
                }
            })
        }
    }
    console.log(nodes)
    return nodes;
}

export function loopOverHierarchy(d, callback) {
    callback(d);
    if (d.children) d.children.forEach(c => loopOverHierarchy(c, callback));
    if (d._children) d._children.forEach(c => loopOverHierarchy(c, callback));
  }

function getChildren(hierarchies, childrens) {
  console.log(childrens);
  childrens.forEach(function(element){
    var children = hierarchies;
    var zoomin = 2;
    element.path.forEach(function(node){
        if (Number(node) !== 0) {
            if (zoomin <= element.path.length - 1) {
                // debugger
                const filterChild = children.children.filter(function(item){
                    return Number(item.name) === Number(node);
                })[0]
                zoomin += 1
                children = filterChild;
            }
            else if (node === element.path[element.path.length - 1]) {
                // debugger
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

export function findChildrenAtSameLevel(arr) {
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

export function autoTranslate() {
    let gs = d3.select('svg').selectAll('g');

    let tops = [], lefts = [], rights = [], bottoms = [];
    
    gs.each(function() {
        let rect = this.getBoundingClientRect();
    
        tops.push(rect.top);
        lefts.push(rect.left);
        rights.push(rect.right);
        bottoms.push(rect.bottom);
    });
    
    // 计算缩放前的矩形大小
    let initialWidth = Math.max(...rights) - Math.min(...lefts);
    let initialHeight = Math.max(...bottoms) - Math.min(...tops);
    
    // 设置你想要的矩形大小
    let desiredWidth = 2000;  // 请替换为你想要的宽度
    let desiredHeight = 2000;  // 请替换为你想要的高度
    
    // 计算缩放因子，这里使用相同的缩放因子以保持长宽比不变
    let scale = Math.min(desiredWidth / initialWidth, desiredHeight / initialHeight);
    
    // 应用缩放
    gs.attr('transform', (d, i, nodes) => {
        // 获取原有的 transform 值
        let originalTransform = d3.select(nodes[i]).attr('transform');
        let translateValues = originalTransform.match(/translate\(([^)]+)\)/);
    
        let originalX = 0, originalY = 0;
    
        if (translateValues) {
            [originalX, originalY] = translateValues[1].split(',').map(Number);
        }
    
        // 保持平移不变，应用缩放
        return `translate(${originalX}, ${originalY})`;
    });
}

export function computeBoundingRectangle(shapes) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const ranksep = 37;
    
    for (const key in shapes) {
        const node = shapes[key];
        const [type, index] = key.split("-");
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
        if (isBfNode||isBcNode||isBlNode) {
            if(node.width===undefined || node.height===undefined){
                continue;
            }
            if (node.type == "LITERAL") {
                if (node.fullBox) {
                    minX = Math.min(minX, node.x - node.width / 2);
                    minY = Math.min(minY, node.y - node.height / 2 + ranksep);
                    maxX = Math.max(maxX, node.x + node.width / 2);
                    maxY = Math.max(maxY, node.y + node.height / 2 - ranksep);
                } else {
                    minX = Math.min(minX, node.x - node.width / 2 + ranksep / 2);
                    minY = Math.min(minY, node.y - node.height / 2 - ranksep);
                    maxX = Math.max(maxX, node.x + node.width / 2 - ranksep / 2);
                    maxY = Math.max(maxY, node.y + node.height / 2 - ranksep);
                }
            } else {
                if (node.fullBox) {
                    minX = Math.min(minX, node.x - node.width / 2);
                    minY = Math.min(minY, node.y - node.height / 2 + ranksep);
                    maxX = Math.max(maxX, node.x + node.width / 2);
                    maxY = Math.max(maxY, node.y + node.height / 2 - ranksep);
                } else {
                    minX = Math.min(minX, node.x - node.width / 2);
                    minY = Math.min(minY, node.y - node.height / 2 - ranksep);
                    maxX = Math.max(maxX, node.x + node.width / 2);
                    maxY = Math.max(maxY, node.y + node.height / 2 - ranksep);
                }
            }
        } else if (isPofNode || isPifNode || isOpiNode || isOpoNode || isPicNode || isPocNode || isPilNode || isPolNode) {
            minX = Math.min(minX, node.x - node.width / 2);
            minY = Math.min(minY, node.y - node.height / 2);
            maxX = Math.max(maxX, node.x + node.width / 2);
            maxY = Math.max(maxY, node.y + node.height / 2);
        }
    }
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}

export function getOuterBox(bbox, padding, ranksep, nodes) {
    let x;
    let y;
    let width;
    let height;
    if ('opo-0' in nodes && 'opi-0' in nodes){
        // full
        x = bbox.x - padding;
        y = bbox.y - padding + ranksep;
        width = bbox.width + 2 * padding;
        height = bbox.height + 2 * padding - 2* ranksep;
    } else if ('opo-0' in nodes && !('opi-0' in nodes)) {
        // bottom
        x = bbox.x - padding;
        y = bbox.y - padding - ranksep / 10;
        width = bbox.width + 2 * padding;
        height = bbox.height + 2 * padding - ranksep;
    } else if (!('opo-0' in nodes) && 'opi-0' in nodes) {
        // top
        x = bbox.x - padding;
        y = bbox.y - padding + ranksep * 2;
        width = bbox.width + 2 * padding;
        height = bbox.height + 2 * padding - ranksep;
    } else {
        // empty
        x = bbox.x - padding;
        y = bbox.y - padding;
        width = bbox.width + 2 * padding;
        height = bbox.height + 2 * padding;
    }
    return {
        x,
        y,
        width,
        height
    };
}

export function getHierarchy(spaceY) {
    var hierarchies = {};
    const childrens = [];
    const gs = d3.selectAll('.drawer').each(function(d, i){
        const nodeID = d3.select(this).attr('id').replace("boxid", "");
        const direction = d3.select(this).attr('direction');
        if (nodeID.split('_').length !== 2) {
        const routes = nodeID.split("-");
        const currentID = routes[routes.length - 1];
        if (currentID==='0') {
            hierarchies.name = Number(currentID);
            hierarchies.oName = nodeID;
            hierarchies.path = routes;
            hierarchies.size = [Number(d3.select(this).attr('width')) + spaceY, Number(d3.select(this).attr('height'))];
            hierarchies.direction = direction;
            if (direction === "right") {
                hierarchies.parentCoordinates = d3.select(this).attr('parentCoord').split(',').map(Number)[1];
            } else { 
                hierarchies.parentCoordinates = d3.select(this).attr('parentCoord').split(',').map(Number)[0];
            }
            
        } else {
            const temp = {}
            temp.name = Number(currentID);
            temp.size = [Number(d3.select(this).attr('width')) + spaceY, Number(d3.select(this).attr('height'))];
            temp.path = routes;
            temp.oName = nodeID;
            temp.direction = direction;
            temp.parentCoordinates = d3.select(this).attr('parentCoord').split(',').map(Number);
            if (direction === "right") {
                temp.parentCoordinates = d3.select(this).attr('parentCoord').split(',').map(Number)[1];
            } else { 
                temp.parentCoordinates = d3.select(this).attr('parentCoord').split(',').map(Number)[0];
            }
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
    return hierarchies;
}
import * as dagre from 'dagre';

export function errorChecking(data) {
let graph = new dagre.graphlib.Graph({ compound: true });
  graph.setGraph({});
  // eslint-disable-next-line
  graph.setDefaultEdgeLabel(() => { return {}; });
      // get pif
  if ('pif' in data) {
    for (let i = 0; i < data.pif.length; i += 1) {
      const node = data.pif[i];
      const nodeId = `pif-${i}`;
      const label = node.name;
      const width = 50;
      const height = 50;
      const metadata = node.metadata;
      graph.setNode(nodeId, { label, width, height, metadata });
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
      const metadata = node.metadata;
      graph.setNode(nodeId, { label, width, height, metadata });
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
      const metadata = node.metadata;
      graph.setNode(nodeId, { label, width, height, metadata });
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
      const metadata = node.metadata;
      graph.setNode(nodeId, { label, width, height, metadata });
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
      const metadata = node.metadata;
      graph.setNode(nodeId, { label, width, height, metadata });
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
      const metadata = node.metadata;
      graph.setNode(nodeId, { label, width, height, metadata });
    }
  }

  // set pil
  if ('pil' in data) {
    for (let i = 0; i < data.pil.length; i += 1) {
      const node = data.pil[i];
      const nodeId = `pil-${i}`;
      const label = node.name;
      const width = 50;
      const height = 50;
      const metadata = node.metadata;
      graph.setNode(nodeId, { label, width, height, metadata });
    }
  }

  // set pol
  if ('pol' in data) {
    for (let i = 0; i < data.pol.length; i += 1) {
      const node = data.pol[i];
      const nodeId = `pol-${i}`;
      const label = node.name;
      const width = 50;
      const height = 50;
      const metadata = node.metadata;
      graph.setNode(nodeId, { label, width, height, metadata });
    }
  }



    if ('wff' in data) {
        for (let i = 0; i < data.wff.length; i += 1) {
          const edge = data.wff[i];
          const srcNodeId = `pif-${edge.src - 1}`;
          const tgtNodeId = `pof-${edge.tgt - 1}`;
          if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
            graph.setEdge(srcNodeId, tgtNodeId);
          } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
            const WnodeId = tgtNodeId;
            const label = "err";
            const width = 50;
            const height = 50;
            graph.setNode(WnodeId, { label, width, height});
            graph.setEdge(srcNodeId, tgtNodeId);
          } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
            const WnodeId = srcNodeId;
            const label = "err";
            const width = 50;
            const height = 50;
            graph.setNode(WnodeId, { label, width, height});
            graph.setEdge(srcNodeId, tgtNodeId);
          } else {
            const WnodeId1 = srcNodeId;
            const WnodeId2 = tgtNodeId;
            const label = "err";
            const width = 50;
            const height = 50;
            graph.setNode(WnodeId1, { label, width, height});
            graph.setNode(WnodeId2, { label, width, height});
            graph.setEdge(srcNodeId, tgtNodeId);
          }
        }
      }
// set edges wfopi
if ('wfopi' in data) {
    for (let i = 0; i < data.wfopi.length; i += 1) {
      const edge = data.wfopi[i];
      const srcNodeId = `pif-${edge.src - 1}`;
      const tgtNodeId = `opi-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set edges wfopo
  if ('wfopo' in data) {
    for (let i = 0; i < data.wfopo.length; i += 1) {
      const edge = data.wfopo[i];
      const srcNodeId = `opo-${edge.src - 1}`;
      const tgtNodeId = `pof-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set edges wopio
  if ('wopio' in data) {
    for (let i = 0; i < data.wopio.length; i += 1) {
      const edge = data.wopio[i];
      const srcNodeId = `opo-${edge.src - 1}`;
      const tgtNodeId = `opi-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

   // set wfc
   if ('wfc' in data) {
    for (let i = 0; i < data.wfc.length; i += 1) {
      const edge = data.wfc[i];
      const srcNodeId = `pic-${edge.src - 1}`;
      const tgtNodeId = `pof-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set wcf
  if ('wcf' in data) {
    for (let i = 0; i < data.wcf.length; i += 1) {
      const edge = data.wcf[i];
      const srcNodeId = `pif-${edge.src - 1}`;
      const tgtNodeId = `poc-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set wcc
  if ('wcc' in data) {
    for (let i = 0; i < data.wcc.length; i += 1) {
      const edge = data.wcc[i];
      const srcNodeId = `pic-${edge.src - 1}`;
      const tgtNodeId = `poc-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set edges wcopi
  if ('wcopi' in data) {
    for (let i = 0; i < data.wcopi.length; i += 1) {
      const edge = data.wcopi[i];
      const srcNodeId = `pic-${edge.src - 1}`;
      const tgtNodeId = `opi-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set edges wcopo
  if ('wcopo' in data) {
    for (let i = 0; i < data.wcopo.length; i += 1) {
      const edge = data.wcopo[i];
      const srcNodeId = `opo-${edge.src - 1}`;
      const tgtNodeId = `poc-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }
// set wfl
if ('wfl' in data) {
    for (let i = 0; i < data.wfl.length; i += 1) {
      const edge = data.wfl[i];
      const srcNodeId = `pil-${edge.src - 1}`;
      const tgtNodeId = `pof-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set wcl
  if ('wcl' in data) {
    for (let i = 0; i < data.wcl.length; i += 1) {
      const edge = data.wcl[i];
      const srcNodeId = `pil-${edge.src - 1}`;
      const tgtNodeId = `poc-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set wlopi
  if ('wlopi' in data) {
    for (let i = 0; i < data.wlopi.length; i += 1) {
      const edge = data.wlopi[i];
      const srcNodeId = `pil-${edge.src - 1}`;
      const tgtNodeId = `opi-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set wll
  if ('wll' in data) {
    for (let i = 0; i < data.wll.length; i += 1) {
      const edge = data.wll[i];
      const srcNodeId = `pil-${edge.src - 1}`;
      const tgtNodeId = `pol-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set wlf
  if ('wlf' in data) {
    for (let i = 0; i < data.wlf.length; i += 1) {
      const edge = data.wlf[i];
      const srcNodeId = `pif-${edge.src - 1}`;
      const tgtNodeId = `pol-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set wlc
  if ('wlc' in data) {
    for (let i = 0; i < data.wlc.length; i += 1) {
      const edge = data.wlc[i];
      const srcNodeId = `pic-${edge.src - 1}`;
      const tgtNodeId = `pol-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }

  // set wlopo
  if ('wlopo' in data) {
    for (let i = 0; i < data.wlopo.length; i += 1) {
      const edge = data.wlopo[i];
      const srcNodeId = `opo-${edge.src - 1}`;
      const tgtNodeId = `pol-${edge.tgt - 1}`;
      if (graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId)) {
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if (graph.hasNode(srcNodeId) && !graph.hasNode(tgtNodeId)) {
        const WnodeId = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else if ((!graph.hasNode(srcNodeId) && graph.hasNode(tgtNodeId))) {
        const WnodeId = srcNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      } else {
        const WnodeId1 = srcNodeId;
        const WnodeId2 = tgtNodeId;
        const label = "err";
        const width = 50;
        const height = 50;
        graph.setNode(WnodeId1, { label, width, height});
        graph.setNode(WnodeId2, { label, width, height});
        graph.setEdge(srcNodeId, tgtNodeId);
      }
    }
  }
//   console.log(graph)
  let nodesWithTargetLabel = [];
  graph.nodes().forEach(function(node) {
    if (graph.node(node).label === "err") {
      nodesWithTargetLabel.push(node);
    }
  });
  return nodesWithTargetLabel;

}