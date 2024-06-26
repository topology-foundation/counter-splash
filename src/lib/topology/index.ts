import { TopologyNode } from "@topology-foundation/node";
import { Canvas, type ICanvas } from "./objects/canvas";
import { Pixel } from "./objects/pixel";
import { GCounter } from "@topology-foundation/crdt";
import { handleCanvasMessages } from "./handlers";

const random_int = (max: number) => Math.floor(Math.random() * max);

async function paint_pixel(
  node: TopologyNode,
  canvas: ICanvas,
  offset: [number, number],
) {
  // where should we handle the painting values?
  // instead of pixel, we should paint area
  const painting: [number, number, number] = [
    random_int(256),
    random_int(256),
    random_int(256),
  ];
  canvas.paint(node.getPeerId(), offset, painting);
  node.updateObject(
    canvas,
    `paint(${node.getPeerId()}, [${offset}], [${painting}])`,
  );
}

async function init() {
  const node = new TopologyNode();
  await node.start();

  // can add extra logic here
  node.addCustomGroupMessageHandler((e) => handleCanvasMessages(canvas, e));

  // also add it to the handlers file
  node.addCustomMessageHandler("/counter-splash/presence/0.0.1", (e) => {
    console.log(e);
  });

  // pre-created object with fixed id (?)
  // let canvas = new Canvas(node.getPeerId(), 5, 10);
  // node.createObject(canvas);

  await node.subscribeObject("");

  let object: any = node.getObject("");
  object["canvas"] = object["canvas"].map((x: any) =>
    x.map((y: any) => {
      y["red"] = Object.assign(new GCounter({}), y["red"]);
      y["green"] = Object.assign(new GCounter({}), y["green"]);
      y["blue"] = Object.assign(new GCounter({}), y["blue"]);
      return Object.assign(new Pixel(node.getPeerId()), y);
    }),
  );

  let canvas = Object.assign(new Canvas(node.getPeerId(), 0, 0), object);
}
