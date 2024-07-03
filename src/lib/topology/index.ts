import { TopologyNode } from "@topology-foundation/node";
import { Vector3, Euler } from "three";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { Canvas, type ICanvas } from "./objects/canvas";
import { handleCanvasMessages, handlePresenceMessages } from "./handlers";
import { Player } from "../store/playersData";

// exception just for the EthCC demo, the format is not this at all
export const OBJECT_ID = "topology::counter_splash";
export const PRESENCE_GROUP = "counter-splash::presence";
export const WIDTH = 4000;
export const HEIGHT = 3000;

export async function topologyInit() {
  // maybe add it to browser storage and
  // add the presence handler before going
  // through the canvas loop
  const node = new TopologyNode();
  await node.start();

  await node.subscribeObject(OBJECT_ID);
  let canvas = new Canvas(node.getPeerId(), WIDTH, HEIGHT);
  node.addCustomGroupMessageHandler((e) => handleCanvasMessages(canvas, e));

  node.addCustomGroup(PRESENCE_GROUP);
  node.addCustomGroupMessageHandler((e) => handlePresenceMessages(e));

  // TODO check best way to handle this
  // and when to do full/partial merges (+ policy)
  let extCanvas = getObject(node, OBJECT_ID);
  while (extCanvas === null) {
    extCanvas = getObject(node, OBJECT_ID);
  }

  canvas.merge(extCanvas);
}

export function getObject(node: TopologyNode, id: string): ICanvas | null {
  let object: any = node.getObject(id);
  if (!object) return null;
  return Object.assign(new Canvas(node.getPeerId(), 0, 0), object);
}

export function addSpray(
  node: TopologyNode,
  canvas: ICanvas,
  offset: [number, number],
  sprayType: number,
) {
  canvas.addSpray(new Date().getTime(), offset, sprayType);
  node.updateObject(
    canvas,
    `addSpray(${new Date().getTime()},[${offset}],[${sprayType}])`,
  );
}

export function sendPresence(node: TopologyNode, player: Player) {
  node.sendGroupMessage(
    PRESENCE_GROUP,
    uint8ArrayFromString(JSON.stringify(player)),
  );
}
