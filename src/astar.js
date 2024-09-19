// astar.js
export function astar(grid, start, goal) {
  const openList = [];
  const closedList = [];
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  const h = (a, b) => Math.abs(a.lat - b.lat) + Math.abs(a.lng - b.lng);

  openList.push(start);
  gScore.set(start, 0);
  fScore.set(start, h(start, goal));

  while (openList.length > 0) {
    let current = openList.reduce((minNode, node) =>
      fScore.get(node) < fScore.get(minNode) ? node : minNode
    );
    if (current.lat === goal.lat && current.lng === goal.lng) {
      let path = [];
      while (cameFrom.has(current)) {
        path.push(current);
        current = cameFrom.get(current);
      }
      path.push(start);
      return path.reverse();
    }

    openList.splice(openList.indexOf(current), 1);
    closedList.push(current);

    const neighbors = getNeighbors(current, grid);
    for (let neighbor of neighbors) {
      if (closedList.includes(neighbor)) continue;

      const tentativeGScore = gScore.get(current) + 1;
      if (!openList.includes(neighbor)) openList.push(neighbor);
      else if (tentativeGScore >= (gScore.get(neighbor) || Infinity)) continue;

      cameFrom.set(neighbor, current);
      gScore.set(neighbor, tentativeGScore);
      fScore.set(neighbor, tentativeGScore + h(neighbor, goal));
    }
  }

  return []; // No path found
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const directions = [
    { lat: 1, lng: 0 },
    { lat: -1, lng: 0 },
    { lat: 0, lng: 1 },
    { lat: 0, lng: -1 },
  ];

  for (let direction of directions) {
    const neighborLat = node.lat + direction.lat;
    const neighborLng = node.lng + direction.lng;
    if (
      grid.some(
        (cell) =>
          cell.latMin <= neighborLat &&
          neighborLat <= cell.latMax &&
          cell.lngMin <= neighborLng &&
          neighborLng <= cell.lngMax
      )
    ) {
      neighbors.push({ lat: neighborLat, lng: neighborLng });
    }
  }

  return neighbors;
}
