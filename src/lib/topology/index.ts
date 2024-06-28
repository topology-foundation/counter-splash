import { TopologyNode } from "@topology-foundation/node";
import { Canvas, type ICanvas } from "./objects/canvas";
import { Pixel } from "./objects/pixel";
import { GCounter } from "@topology-foundation/crdt";
import { handleCanvasMessages, handlePresenceMessages } from "./handlers";

// exception just for the EthCC demo, the format is not this at all
export const OBJECT_ID = "topology::counter_splash";

export async function topologyInit() {
  // maybe add it to browser storage and
  // add the presence handler before going
  // through the canvas loop
  const node = new TopologyNode();
  await node.start();

  // also add it to the handlers file
  node.addCustomMessageHandler("/counter-splash/presence/0.0.1", (e) =>
    handlePresenceMessages(e),
  );

  while (node.getPeers().length < 2) {
    console.log("waiting for peers");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  let canvas = getObject(node, OBJECT_ID);
  while (canvas === null) {
    console.log("waiting for canvas", node.getPeers());
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await node.subscribeObject(OBJECT_ID);
    canvas = getObject(node, OBJECT_ID);
  }

  // can add extra logic here
  node.addCustomGroupMessageHandler((e) => handleCanvasMessages(canvas, e));
  // TODO store canvas in browser storage

  return node;
}

export function getObject(node: TopologyNode, id: string): ICanvas | null {
  let object: any = node.getObject(id);
  if (!object) return null;

  object["canvas"] = object["canvas"].map((x: any) =>
    x.map((y: any) => {
      y["red"] = Object.assign(new GCounter({}), y["red"]);
      y["green"] = Object.assign(new GCounter({}), y["green"]);
      y["blue"] = Object.assign(new GCounter({}), y["blue"]);
      return Object.assign(new Pixel(node.getPeerId()), y);
    }),
  );

  return Object.assign(new Canvas(node.getPeerId(), 0, 0), object);
}

export function paintBrush1(
  node: TopologyNode,
  canvas: ICanvas,
  offset: [number, number],
  color: [number, number, number],
) {
  canvas.paint(node.getPeerId(), offset, color);
  node.updateObject(
    canvas,
    `paint(${node.getPeerId()}, [${offset}], [${color}])`,
  );
}