import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { type ICanvas } from "./objects/canvas";
import { OBJECT_ID, PRESENCE_GROUP } from ".";
import { type Player } from "$lib/store/playersData";
import { addOrUpdatePlayer } from "$lib/store/playersManager";
import { addSprayData, type SprayData } from "$lib/store/player";

export function handlePresenceMessages(e: any) {
  if (e.detail.msg.topic !== PRESENCE_GROUP) return;
  const input = uint8ArrayToString(e.detail.msg.data);
  const player: Player = JSON.parse(input);
  addOrUpdatePlayer(player);
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
  const fnName = fn.split("(")[0];
  switch (fnName) {
    case "addSpray": {
      const args = fn.replace("addSpray(", "").replace(")", "").split(",");
      let timestamp = parseInt(args[0], 10);
      let offset_x = parseInt(args[1].replace("[", ""), 10);
      let offset_y = parseInt(args[2].replace("]", ""), 10);
      const offset: [number, number] = [offset_x, offset_y];
      let sprayType = parseInt(args[3], 10);
      try {
        canvas.addSpray(timestamp, offset, sprayType);
        const sprayData: SprayData = {
          id: sprayType,
          offset: {
            x: offset_x,
            y: offset_y,
          },
          timestamp,
        };
        addSprayData(sprayData);
      } catch (e) {
        console.error(e);
      }
      break;
    }
    default: {
      break;
    }
  }
}
