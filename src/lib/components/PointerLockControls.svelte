<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";
  import { Euler, Camera, Quaternion } from "three";
  import { useThrelte, useParent } from "@threlte/core";
  import { paintMode, sprayWheel } from "$lib/store/player";
  import { selectedKeyboard } from "$lib/store/settings";
  import { keyMapping } from "$lib/store/settings";
  import type { KeyMapping } from "$lib/store/settings";
  import { get } from "svelte/store";
  import TWEEN, { Tween, Easing } from "@tweenjs/tween.js";

  // Set to constrain the pitch of the camera
  // Range is 0 to Math.PI radians
  export let minPolarAngle = 0; // radians
  export let maxPolarAngle = Math.PI; // radians
  export let pointerSpeed = 1.0;

  let isLocked = false;

  const { renderer, invalidate } = useThrelte();

  const domElement = renderer.domElement;
  const camera = useParent();
  const dispatch = createEventDispatcher();

  const _euler = new Euler(0, 0, 0, "YXZ");
  const _PI_2 = Math.PI / 2;

  if (!renderer) {
    throw new Error(
      "Threlte Context missing: Is <PointerLockControls> a child of <Canvas>?",
    );
  }

  const isCamera = (p: any): p is Camera => {
    return p.isCamera;
  };

  if (!isCamera($camera)) {
    throw new Error(
      "Parent missing: <PointerLockControls> need to be a child of a <Camera>",
    );
  }

  const onChange = () => {
    invalidate();
    dispatch("change");
  };

  export const lock = () => domElement.requestPointerLock();
  export const unlock = () => document.exitPointerLock();

  domElement.addEventListener("mousemove", onMouseMove);
  domElement.ownerDocument.addEventListener(
    "pointerlockchange",
    onPointerlockChange,
  );
  domElement.ownerDocument.addEventListener(
    "pointerlockerror",
    onPointerlockError,
  );
  domElement.ownerDocument.addEventListener("keydown", onKeyDown);
  domElement.ownerDocument.addEventListener("keyup", onKeyUp);
  domElement.ownerDocument.addEventListener("mousedown", onMouseDown);

  onDestroy(() => {
    domElement.removeEventListener("mousemove", onMouseMove);
    domElement.ownerDocument.removeEventListener(
      "pointerlockchange",
      onPointerlockChange,
    );
    domElement.ownerDocument.removeEventListener(
      "pointerlockerror",
      onPointerlockError,
    );
    domElement.ownerDocument.removeEventListener("keydown", onKeyDown);
    domElement.ownerDocument.removeEventListener("keyup", onKeyUp);
    domElement.ownerDocument.removeEventListener("mousedown", onMouseDown);
  });

  function onMouseMove(event: MouseEvent) {
    if (!isLocked) return;
    if (!$camera) return;

    const { movementX, movementY } = event;

    _euler.setFromQuaternion($camera.quaternion);

    _euler.y -= movementX * 0.002 * pointerSpeed;
    _euler.x -= movementY * 0.002 * pointerSpeed;

    _euler.x = Math.max(
      _PI_2 - maxPolarAngle,
      Math.min(_PI_2 - minPolarAngle, _euler.x),
    );

    $camera.quaternion.setFromEuler(_euler);

    onChange();
  }

  function onMouseDown() {
    if (!isLocked && !$paintMode) {
      lock();
    }
  }
  function onPointerlockChange() {
    if (document.pointerLockElement === domElement) {
      paintMode.set(false);
      isLocked = true;
    } else {
      isLocked = false;
    }
  }

  function onPointerlockError() {
    console.error("PointerLockControls: Unable to use Pointer Lock API");
  }

  function onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    const mapping = keyMapping[get(selectedKeyboard)];
    const paintKey = mapping.paint;

    if (event.key === paintKey) {
      if (isLocked) {
        unlock();
        sprayWheel.set(true);
      }
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    const mapping = keyMapping[get(selectedKeyboard)];
    const paintKey = mapping.paint;

    if (event.key === paintKey) {
      if (!isLocked) {
        lock();
        sprayWheel.set(false);
      }
    }
  }
</script>
