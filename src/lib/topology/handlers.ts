import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { type ICanvas } from "./objects/canvas";
import { OBJECT_ID, PRESENCE_GROUP, Player } from ".";

export function handlePresenceMessages(e: any) {
  if (e.detail.msg.topic !== PRESENCE_GROUP) return;
  const input = uint8ArrayToString(e.detail.msg.data);
  const player: Player = JSON.parse(input);

  // TODO process what to do with other players information
}

// TODO: this should be superseded by wasm and main ts-topology library
export const handleCanvasMessages = (canvas: ICanvas, e: any) => {
  if (e.detail.msg.topic !== OBJECT_ID) return;
  const input = uint8ArrayToString(e.detail.msg.data);
  const message = JSON.parse(input);
  switch (message["type"]) {
    case "object_update": {
      const fn = uint8ArrayToString(new Uint8Array(message["data"]));
      handleObjectUpdate(canvas, fn);
      break;
    }
    default: {
      break;
    }
  }
};

function handleObjectUpdate(canvas: ICanvas, fn: string) {
  // TODO `addSpray(${new Date().getTime()},[${offset}],[${sprayType}])`,
  let args = fn.replace("paint(", "").replace(")", "").split(", ");
  let offset_p = args[1]
    .replace("[", "")
    .replace("]", "")
    .split(",")
    .map((s) => parseInt(s, 10));
  const offset: [number, number] = [offset_p[0], offset_p[1]];
  let rgb_p = args[2]
    .replace("[", "")
    .replace("]", "")
    .split(",")
    .map((s) => parseInt(s, 10));
  const rgb: [number, number, number] = [rgb_p[0], rgb_p[1], rgb_p[2]];

  try {
    // canvas.paint(args[0], offset, rgb);
  } catch (e) {
    console.error(e);
  }
}
