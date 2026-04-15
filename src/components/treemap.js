import React, { useState } from "react";
import { treemap, hierarchy, scaleOrdinal, schemeDark2, format } from "d3";

export function TreeMap(props) {
  const { margin, svg_width, svg_height, tree, selectedCell, setSelectedCell } = props;
  const [hoveredCell, setHoveredCell] = useState(null);

  if (!tree) return null;

  const legendHeight = 22;
  const innerWidth = svg_width - margin.left - margin.right;
  const innerHeight = svg_height - margin.top - margin.bottom - legendHeight;

  const layout = treemap()
    .size([innerWidth, innerHeight])
    .paddingInner(2)
    .paddingOuter(2)
    .round(true);

  // 只让叶子节点参与面积计算，避免出现白块
  const root = layout(
    hierarchy(tree)
      .sum((d) => (d.children ? 0 : d.value || 0))
      .sort((a, b) => (b.value || 0) - (a.value || 0))
  );

  const pct = format(".1%");
  const level1Groups = root.children || [];
  const leaves = root.leaves();

  function getAncestorAtDepth(node, depth) {
    let current = node;
    while (current && current.depth > depth) {
      current = current.parent;
    }
    return current;
  }

  // 第二层作为颜色和 legend
  let level2Nodes = [];
  level1Groups.forEach((group) => {
    if (group.children) {
      group.children.forEach((child) => {
        level2Nodes.push(child);
      });
    }
  });

  const legendMap = new Map();
  level2Nodes.forEach((node) => {
    const key = `${node.data.attribute}:${node.data.name}`;
    if (!legendMap.has(key)) {
      legendMap.set(key, {
        key,
        attribute: node.data.attribute,
        name: node.data.name,
      });
    }
  });

  const legendItems =
    level2Nodes.length > 0
      ? Array.from(legendMap.values())
      : level1Groups.map((group) => ({
          key: `${group.data.attribute}:${group.data.name}`,
          attribute: group.data.attribute,
          name: group.data.name,
        }));

  const colorScale = scaleOrdinal()
    .domain(legendItems.map((d) => d.key))
    .range(schemeDark2);

  function getNodeId(node, i) {
    return `${node.depth}-${node.data.attribute || "na"}-${node.data.name}-${i}`;
  }

  // 颜色取第二层；如果没有第二层，就退回第一层
  function getColorKey(node) {
    const level2 = getAncestorAtDepth(node, 2);
    if (level2) {
      return `${level2.data.attribute}:${level2.data.name}`;
    }
    const level1 = getAncestorAtDepth(node, 1);
    return `${level1.data.attribute}:${level1.data.name}`;
  }

  // 白字显示叶子节点本身，也就是第三个 button
  function getDisplayLabel(node) {
    return `${node.data.attribute}:${node.data.name}`;
  }

  // 百分比：
  // 三层时，相对于第二层父块
  // 两层时，相对于第一层父块
  function getFraction(node) {
    if (node.parent && node.parent.value) {
      return node.value / node.parent.value;
    }
    return 1;
  }

  return (
    <svg
      viewBox={`0 0 ${svg_width} ${svg_height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%" }}
    >
      {/* legend：显示第二个属性 */}
      <g transform={`translate(${margin.left}, 0)`}>
        {legendItems.map((item, i) => {
          const key = `${item.attribute}:${item.name}`;
          return (
            <g key={key} transform={`translate(${i * 170}, 0)`}>
              <rect width={15} height={15} fill={colorScale(key)} />
              <text x={20} y={12} fontSize={12}>
                {item.attribute}: {item.name}
              </text>
            </g>
          );
        })}
      </g>

      <g transform={`translate(${margin.left}, ${margin.top + legendHeight})`}>
        {/* 先画叶子节点 */}
        {leaves.map((leaf, i) => {
          const w = leaf.x1 - leaf.x0;
          const h = leaf.y1 - leaf.y0;

          const colorKey = getColorKey(leaf);
          const baseColor = colorScale(colorKey);
          const fraction = getFraction(leaf);

          const nodeId = getNodeId(leaf, i);
          const isHovered = hoveredCell === nodeId;

          const isSelected =
            selectedCell &&
            selectedCell.attribute === leaf.data.attribute &&
            selectedCell.name === leaf.data.name &&
            selectedCell.parent === leaf.parent?.data?.name;

          return (
            <g
              key={nodeId}
              transform={`translate(${leaf.x0}, ${leaf.y0})`}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredCell(nodeId)}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() =>
                setSelectedCell(
                  isSelected
                    ? null
                    : {
                        attribute: leaf.data.attribute,
                        name: leaf.data.name,
                        parent: leaf.parent?.data?.name,
                        value: fraction,
                      }
                )
              }
            >
              <rect
                width={w}
                height={h}
                fill={isHovered ? "#d62728" : baseColor}
                opacity={!selectedCell || isSelected ? 0.8 : 0.45}
                stroke={isHovered ? "black" : isSelected ? "white" : "none"}
                strokeWidth={isHovered || isSelected ? 2 : 0}
              />

              {/* 太小也显示，显示不全没关系 */}
              <foreignObject width={w} height={h}>
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    fontSize: "0.5em",
                    padding: "2px",
                    pointerEvents: "none",
                    color: "white",
                    fontFamily: "sans-serif",
                    lineHeight: 1.2,
                    overflow: "hidden",
                    wordBreak: "break-word",
                  }}
                >
                  <div>{getDisplayLabel(leaf)}</div>
                  <div>Value: {pct(fraction)}</div>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* 再画第一层大框和背景字 */}
        {level1Groups.map((group, i) => {
          const w = group.x1 - group.x0;
          const h = group.y1 - group.y0;
          const label = `${group.data.attribute}: ${group.data.name}`;
          const rotate = h > w;

          return (
            <g key={`group-${i}`} transform={`translate(${group.x0}, ${group.y0})`}>
              <rect width={w} height={h} stroke="black" fill="none" />
              <text
                x={w / 2}
                y={h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={0.25}
                transform={rotate ? `rotate(90, ${w / 2}, ${h / 2})` : undefined}
                style={{
                  fontSize: "2em",
                  fontWeight: "bold",
                  pointerEvents: "none",
                }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}