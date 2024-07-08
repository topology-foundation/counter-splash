import { GSet } from "@topology-foundation/crdt";
import { TopologyObject } from "@topology-foundation/object";

export interface ICanvas extends TopologyObject {
  width: number;
  height: number;
  sprays: GSet<String>;
  addSpray(
    timestamp: number,
    offset: [number, number],
    sprayType: number,
  ): void;
  getSprays(): GSet<String>;
  merge(peerCanvas: Canvas): void;
}

export class Canvas extends TopologyObject implements ICanvas {
  width: number;
  height: number;
  sprays: GSet<String>;

  constructor(
    peerId: string,
    width: number,
    height: number,
    sprays?: Set<String>,
  ) {
    super(peerId);
    this.width = width;
    this.height = height;
    this.sprays = new GSet<String>(sprays ? sprays : new Set<String>());
  }

  addSpray(
    timestamp: number,
    offset: [number, number],
    sprayType: number,
  ): void {
    if (
      offset[0] < 0 ||
      offset[0] >= this.width ||
      offset[1] < 0 ||
      offset[1] >= this.height
    )
      return;
    this.sprays.add(`[${timestamp},[${offset[0]},${offset[1]}],${sprayType}]`);
  }

  getSprays(): GSet<String> {
    return this.sprays;
  }

  merge(peerCanvas: Canvas): void {
    // TODO ugly, fix this
    // protobufs should solve this
    peerCanvas = Object.assign(new Canvas("", 0, 0), peerCanvas);
    peerCanvas.sprays = Object.assign(
      new GSet<String>(new Set()),
      peerCanvas.sprays,
    );
    peerCanvas.sprays._set = Object.assign(
      new Set<String>(),
      peerCanvas.sprays._set,
    );
    this.sprays.merge(peerCanvas.getSprays());
  }
}
