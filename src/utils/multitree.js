/* eslint-disable */
import { tree } from "d3";
import flextree from "./flextree";
import cloneDeep from 'lodash/cloneDeep';
import { layout } from "dagre";
import { loopOverHierarchy } from "./utilities";

export default function getMultiTree(hierarchies) {
    let hierarchies_copy = cloneDeep(hierarchies);
    const Layout = processTree(hierarchies_copy);
    return Layout;
}

function processTree(hierarchies) {
    let treeLayout = {};
    do {
        let subtrees = findAllSubtrees(hierarchies);
        let currentLayout = [...subtrees.right, ...subtrees.down, ...subtrees.mix];
        console.log(currentLayout, "current");
        console.log(treeLayout, "currentT");
        let mergedCL = currentLayout.reduce((acc, obj) => ({...acc, ...obj}), {});
        if (hasProperties(treeLayout)) {
            const sharedNodes = getSharedKeys(treeLayout, mergedCL);
            console.log(sharedNodes)
            for (let key of sharedNodes) {
                const nodeL = mergedCL[key];
                const childrenRect = {};
                for (let keyPre  in treeLayout) {
                    const nodeLPre = treeLayout[keyPre];
                    if (keyPre.startsWith(key)) {
                        childrenRect[keyPre] = nodeLPre;                   
                    }
                }
                const oldBoundingBox = findBoundingBox(childrenRect);
                // debugger
                console.log(oldBoundingBox)
                console.log(nodeL)
                const differenceX1 = nodeL[0] - oldBoundingBox.x;
                const differenceY1 = nodeL[1] - oldBoundingBox.y;
                for (let keyPre  in treeLayout) {
                    const nodeLPre = treeLayout[keyPre];
                    if (keyPre.startsWith(key)) {
                        nodeLPre[0] += differenceX1;
                        nodeLPre[1] += differenceY1;
                    }
                }
            }
            copyNonDuplicateProperties(treeLayout, mergedCL);
        } else {
            treeLayout = cloneDeep(mergedCL);
        }
    } while ('children' in hierarchies);
    console.log(treeLayout, "layout")
    return treeLayout;
    function hasProperties(obj) {
        for (let key in obj) {
            return true;
        }
        return false;
    }

    function getSharedKeys(obj1, obj2) {
        let sharedKeys = [];
    
        for (let key in obj1) {
            if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
                sharedKeys.push(key);
            }
        }
    
        return sharedKeys;
    }
    function copyNonDuplicateProperties(obj1, obj2) {
        for (let key in obj2) {
            if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
                obj1[key] = obj2[key];
            }
        }
    }
  }

  function findAllSubtrees(root) {
    let parentNodesRight = new Set();
    let parentNodesDown = new Set();
    const spacing = 100;
    setParents(root, null);
    dfs(root, parentNodesRight, parentNodesDown);
    const parentNodesMix = new Set();
    for (const item of parentNodesRight) {
        if (parentNodesDown.has(item)) {
            parentNodesMix.add(item);
            parentNodesRight.delete(item);
            parentNodesDown.delete(item);
        }
    }
    const result = {
        right: Array.from(parentNodesRight).map(node => {
            let clone = cloneDeep(node);
            delete node.children;
            removeDownChildren(clone);
            if (node.direction==="down") {
                const clonex = clone.size[0];
                clone.size[0] = clone.size[1];
                clone.size[1] = clonex;
            }
            loopOverHierarchy(clone, d => {
                if (Array.isArray(d.size)) {
                d.size[1] += spacing;
                }
            });
            const flexLayout = flextree({ spacing: 80 });
            const tree = flexLayout.hierarchy(clone);
            var treeData = flexLayout(tree);
            treeData.each(d => {
                const x = d.x;
                d.x = d.y;
                d.y = x;
              });
            var treeLayout = {};
            treeData.each(d => {
                treeLayout[d.data.oName] = [d.x, d.y - d.data.size[0] / 2, d.data.size[1], d.data.size[0] * 1];
            });
            const newBoundingbox = findBoundingBox(treeLayout);
            node._size = [newBoundingbox.width, newBoundingbox.height];
            node.size = [newBoundingbox.height, newBoundingbox.width];
            console.log(treeLayout, "test");
            return treeLayout;
        }),
        down: Array.from(parentNodesDown).map(node => {
            let clone = cloneDeep(node);
            delete node.children;
            removeRightChildren(clone);
            loopOverHierarchy(clone, d => {
                if (Array.isArray(d.size)) {
                if (!d._size) d._size = d.size.slice();
                d.size = [d.size[1], d.size[0]];
                }
            });
            loopOverHierarchy(clone, d => {
                if (Array.isArray(d.size)) {
                d.size[1] += spacing;
                }
            });
            if (node.direction==="down") {
                const clonex = clone.size[0];
                clone.size[0] = clone.size[1];
                clone.size[1] = clonex;
            }
            const flexLayout = flextree({ spacing: 120 });
            const tree = flexLayout.hierarchy(clone);
            var treeData = flexLayout(tree);
            var treeLayout = {};
            treeData.each(d => {
                treeLayout[d.data.oName] = [d.x - d.data.size[0] / 2, d.y, d.data.size[0] * 1, d.data.size[1]];
            });
            const newBoundingbox = findBoundingBox(treeLayout);
            node._size = [newBoundingbox.width, newBoundingbox.height];
            node.size = [newBoundingbox.height, newBoundingbox.width];
            
            return treeLayout;
        }),
        mix: Array.from(parentNodesMix).map(node => {
            let cloneRight = cloneDeep(node);
            delete node.children;
            let cloneDown = cloneDeep(cloneRight);
            loopOverHierarchy(cloneDown, d => {
                if (Array.isArray(d.size)) {
                if (!d._size) d._size = d.size.slice();
                d.size = [d.size[1], d.size[0]];
                }
            });
            loopOverHierarchy(cloneDown, d => {
                if (Array.isArray(d.size)) {
                d.size[1] += spacing;
                }
            });
            loopOverHierarchy(cloneRight, d => {
                if (Array.isArray(d.size)) {
                d.size[1] += spacing;
                }
            });
            removeRightChildren(cloneDown);
            removeDownChildren(cloneRight);
            const flexLayoutDown = flextree({ spacing: 120 });
            const flexLayoutRight = flextree({ spacing: 80 });
            const treeDown = flexLayoutDown.hierarchy(cloneDown);
            const treeRight = flexLayoutRight.hierarchy(cloneRight);
            // if (node.direction==="right") {
            //     const cloneDownx = cloneDown.size[0];
            //     cloneDown.size[0] = cloneDown.size[1];
            //     cloneDown.size[1] = cloneDownx;
            // }
            if (node.direction==="down") {
                const cloneRightx = cloneRight.size[0];
                cloneRight.size[0] = cloneRight.size[1];
                cloneRight.size[1] = cloneRightx;
                const cloneDownx = cloneDown.size[0];
                cloneDown.size[0] = cloneDown.size[1];
                cloneDown.size[1] = cloneDownx;
            }
            var treeDataDown = flexLayoutDown(treeDown);
            var treeDataRight = flexLayoutDown(treeRight);
            treeDataRight.each(d => {
                const x = d.x;
                d.x = d.y;
                d.y = x;
              });
            var treeLayoutDown = {};
            treeDataDown.each(d => {
                treeLayoutDown[d.data.oName] = [d.x - d.data.size[0] / 2, d.y, d.data.size[0], d.data.size[1] * 1];
            });
            var treeLayoutRight = {};
            treeDataRight.each(d => {
                treeLayoutRight[d.data.oName] = [d.x, d.y - d.data.size[0] / 2, d.data.size[1], d.data.size[0] * 1];
            });
            const differenceX = treeLayoutRight[node.oName][0] - treeLayoutDown[node.oName][0];
            const differenceY = treeLayoutRight[node.oName][1] - treeLayoutDown[node.oName][1];
            for (const key in treeLayoutDown) {
                treeLayoutDown[key][0] += differenceX;
                treeLayoutDown[key][1] += differenceY;
            }
            const mergedLayout = { ...treeLayoutRight, ...treeLayoutDown };
            const newBoundingbox = findBoundingBox(mergedLayout);
            node._size = [newBoundingbox.width, newBoundingbox.height];
            node.size = [newBoundingbox.height, newBoundingbox.width];
            console.log(newBoundingbox, "test");
            return mergedLayout;
        }),
    };
    return result;

    function setParents(node, parent) {
        node.parent = parent;
        if (node.children) {
            node.children.forEach(child => setParents(child, node));
        }
    }

    function dfs(node, parentNodesRight, parentNodesDown) {
        let isSameDirection = true;
    
        checkProperties(node);
    
        if (isSameDirection) {
            if (node.direction === 'right') {
                if (node.parent!==null) {
                    parentNodesRight.add(node.parent);
                } else {
                    parentNodesRight.add(node);
                }
            } else if (node.direction === 'down') {
                if (node.parent!==null) {
                    parentNodesDown.add(node.parent);
                } else {
                    parentNodesDown.add(node.parent);
                }
            }
            return true;
        }
    
        if (node.children) {
            node.children.forEach(child => dfs(child, parentNodesRight, parentNodesDown));
        }
    
        return false;
    
        function checkProperties(currentNode) {
            if (currentNode.direction !== node.direction) {
                isSameDirection = false;
            }
    
            if (currentNode.children) {
                currentNode.children.forEach(checkProperties);
            }
        }
    }
    function removeRightChildren(node) {
        if (node.children) {
            node.children = node.children.filter(child => child.direction !== 'right');
            node.children.forEach(removeRightChildren);
        }
    }
    
    function removeDownChildren(node) {
        if (node.children) {
            node.children = node.children.filter(child => child.direction !== 'down');
            node.children.forEach(removeDownChildren);
        }
    }
}

function findBoundingBoxCentral(rectanglesObj) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let key in rectanglesObj) {
        let rectangle = rectanglesObj[key];
        let centerX = rectangle[0];
        let centerY = rectangle[1];
        let width = rectangle[2];
        let height = rectangle[3];

        let x1 = centerX - width / 2;
        let y1 = centerY - height / 2;
        let x2 = centerX + width / 2;
        let y2 = centerY + height / 2;

        minX = Math.min(minX, x1);
        minY = Math.min(minY, y1);
        maxX = Math.max(maxX, x2);
        maxY = Math.max(maxY, y2);
    }

    return {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
        width: maxX - minX,
        height: maxY - minY
    };
}

function findBoundingBox(rectanglesObj) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let key in rectanglesObj) {
        let rectangle = rectanglesObj[key];
        let rectX = rectangle[0];
        let rectY = rectangle[1];
        let width = rectangle[2];
        let height = rectangle[3];

        let x1 = rectX;
        let y1 = rectY;
        let x2 = rectX + width;
        let y2 = rectY + height;

        minX = Math.min(minX, x1);
        minY = Math.min(minY, y1);
        maxX = Math.max(maxX, x2);
        maxY = Math.max(maxY, y2);
    }

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}