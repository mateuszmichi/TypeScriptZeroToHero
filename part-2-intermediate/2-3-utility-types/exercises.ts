// Utility types

type XYZ = unknown;

/**
 * Make the following code work better with default values
 */
function Exercise1() {
  // Setup
  type Achievement = {
    type: "standard" | "rare";
    title: string;
    description: string;
    date: Date;
  };

  const saveAchievement = (achievement: Achievement) => {
    console.log(`Saving achievement to DB (${achievement.date})`);
    console.log(`${achievement.title} (${achievement.type})`);
    return achievement.date.getTime();
  };

  // Modify from this point
  const createAchievement = (data: XYZ) => {
    saveAchievement({
      date: new Date(),
      description: "",
      title: "Achievement",
      type: "standard",
      ...data,
    });
  };
  createAchievement();
  createAchievement({ type: "rare" });
  createAchievement({ title: "My achievement" });
  createAchievement({ description: "Hmmm..." });
}

/**
 * Make the code from the previous example more natural:
 * 1. Save achievement should not take data and id but return it after creation
 * 2. Create achievement should require description and title
 * 3. Make saveAchievement return a promise simulating an API call
 */
function Exercise2() {
  // Setup - additional id key
  type Achievement = {
    id: number;
    type: "standard" | "rare";
    title: string;
    description: string;
    date: Date;
  };

  // Modify from this point
  const saveAchievement = (achievement: XYZ): XYZ => {
    // TODO
  };

  const createAchievement = (data: XYZ) => {
    saveAchievement({
      type: "standard",
      ...data,
    });
  };
}

/**
 * Make the following code easier to maintain (only types):
 * 1. Extract common type
 * 2. Enable rendering the area without access to nodes and edges data - for example, prerender while loading
 * 3. Allow updating the graph nodes and edges separately
 */
function Exercise3() {
  type GraphData = {
    nodes: Array<{ x: number; y: number; id: number }>;
    edges: Array<{ from: number; to: number }>;
    axisX: [number, number];
    axisY: [number, number];
    container: {
      height: number;
      width: number;
    };
  };

  const getRenderTools = (data: GraphData) => {
    const _calculateRealPosition = (coord: number, axis: [number, number]) => {
      return (coord - axis[0]) / (axis[1] - axis[0]);
    };

    const { axisX, axisY, container } = data;
    const xZoom = (axisX[1] - axisX[0]) / container.width;
    const yZoom = (axisY[1] - axisY[0]) / container.height;
    const zoom = Math.min(xZoom, yZoom);
    const xAdditionalSpace = (container.width * Math.max(zoom, xZoom)) / 2;
    const yAdditionalSpace = (container.height * Math.max(zoom, yZoom)) / 2;

    const updatedAxisX: [number, number] = [
      -xAdditionalSpace + axisX[0],
      axisX[1] + xAdditionalSpace,
    ];
    const updatedAxisY: [number, number] = [
      -yAdditionalSpace + axisY[0],
      axisY[1] + yAdditionalSpace,
    ];

    return {
      getXCoordinate: (x: number) =>
        _calculateRealPosition(x, updatedAxisX) * container.width,
      getYCoordinate: (y: number) =>
        _calculateRealPosition(y, updatedAxisY) * container.height,
      axisX: updatedAxisX,
      axisY: updatedAxisY,
    };
  };

  const renderBackground = (context: ReturnType<typeof getRenderTools>) => {
    const { axisX, axisY, getXCoordinate, getYCoordinate } = context;
    console.log(`Rendering square:
A (${getXCoordinate(axisX[0])}, ${getYCoordinate(axisY[0])})
B (${getXCoordinate(axisX[1])}, ${getYCoordinate(axisY[0])})
C (${getXCoordinate(axisX[1])}, ${getYCoordinate(axisY[1])})
D (${getXCoordinate(axisX[0])}, ${getYCoordinate(axisY[1])})`);
  };

  const renderNodes = (
    data: GraphData,
    context: ReturnType<typeof getRenderTools>,
  ) => {
    const { getXCoordinate, getYCoordinate } = context;
    data.nodes.forEach((node) => {
      console.log(
        `Rendering node (${getXCoordinate(node.x)}, ${getYCoordinate(node.y)})`,
      );
    });
  };

  const renderEdges = (
    data: GraphData,
    context: ReturnType<typeof getRenderTools>,
  ) => {
    const { getXCoordinate, getYCoordinate } = context;
    data.edges.forEach((edge) => {
      const origin = data.nodes.find((n) => n.id === edge.from);
      const target = data.nodes.find((n) => n.id === edge.to);
      if (origin && target) {
        console.log(`Rendering edge:
A (${getXCoordinate(origin.x)}, ${getYCoordinate(origin.y)})
B (${getXCoordinate(target.x)}, ${getYCoordinate(target.y)})`);
      }
    });
  };
}

/**
 * Implement types for a function handling refunds.
 * 1. We do not accept wholesale items.
 */
function Exercise4() {
  type BoughtItem = {
    type: "new" | "used" | "wholesale";
    price: number;
    id: number;
  };

  const refundItem = (item: XYZ) => {
    // Here would go some logic
  };

  const tryToRefund = (item: BoughtItem) => {
    if (item.type === "wholesale") {
      throw new Error("Contact the sales manager.");
    }
    refundItem(item);
  };
}
