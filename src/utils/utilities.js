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

export function loopOverHierarchy(d, callback) {
    callback(d);
    if (d.children) d.children.forEach(c => loopOverHierarchy(c, callback));
    if (d._children) d._children.forEach(c => loopOverHierarchy(c, callback));
  }

export function getChildren(hierarchies, childrens) {
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

export function getMultiTree(hierarchies, nodeposition) {

}