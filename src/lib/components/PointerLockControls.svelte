<script lang="ts">
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { Euler, Camera, Quaternion } from 'three'
    import { useThrelte, useParent } from '@threlte/core'
    import { paintMode } from '$lib/store/settings'
    import TWEEN, { Tween, Easing } from '@tweenjs/tween.js'
  
    // Set to constrain the pitch of the camera
    // Range is 0 to Math.PI radians
    export let minPolarAngle = 0 // radians
    export let maxPolarAngle = Math.PI // radians
    export let pointerSpeed = 1.0
  
    let isLocked = false
  
    const { renderer, invalidate } = useThrelte()
  
    const domElement = renderer.domElement
    const camera = useParent()
    const dispatch = createEventDispatcher()
  
    const _euler = new Euler(0, 0, 0, 'YXZ')
    const _PI_2 = Math.PI / 2
  
    if (!renderer) {
      throw new Error('Threlte Context missing: Is <PointerLockControls> a child of <Canvas>?')
    }
  
    const isCamera = (p: any): p is Camera => {
      return p.isCamera
    }
  
    if (!isCamera($camera)) {
      throw new Error('Parent missing: <PointerLockControls> need to be a child of a <Camera>')
    }
  
    const onChange = () => {
      invalidate()
      dispatch('change')
    }
  
    export const lock = () =>
      domElement.requestPointerLock()
      export const unlock = () => document.exitPointerLock()

    domElement.addEventListener('mousemove', onMouseMove)
    domElement.addEventListener('mousedown', onMouseDown)
    domElement.ownerDocument.addEventListener('pointerlockchange', onPointerlockChange)
    domElement.ownerDocument.addEventListener('pointerlockerror', onPointerlockError)
  
    onDestroy(() => {
      domElement.removeEventListener('mousemove', onMouseMove)
      domElement.removeEventListener('mousedown', onMouseDown)
      domElement.ownerDocument.removeEventListener('pointerlockchange', onPointerlockChange)
      domElement.ownerDocument.removeEventListener('pointerlockerror', onPointerlockError)
    })
  
    function onMouseMove(event: MouseEvent) {
      if (!isLocked) return
      if (!$camera) return
  
      const { movementX, movementY } = event
  
      _euler.setFromQuaternion($camera.quaternion)
  
      _euler.y -= movementX * 0.002 * pointerSpeed
      _euler.x -= movementY * 0.002 * pointerSpeed
  
      _euler.x = Math.max(_PI_2 - maxPolarAngle, Math.min(_PI_2 - minPolarAngle, _euler.x))
  
      $camera.quaternion.setFromEuler(_euler)
  
      onChange()
    }
  
    function onPointerlockChange() {
      if (document.pointerLockElement === domElement) {
        dispatch('lock')
        paintMode.set(false)
        isLocked = true
      } else {
        dispatch('unlock')
        isLocked = false
      }
    }
  
    function onPointerlockError() {
      console.error('PointerLockControls: Unable to use Pointer Lock API')
    }

    function onMouseDown(event: MouseEvent) {
      if (event.button === 0) {
        if (!isLocked) return
        paintMode.set(true)
        unlock()
        pointCameraToXAxis()
      }
    }
  
    function pointCameraToXAxis() {
      if (!$camera) return
  
      const initialQuaternion = $camera.quaternion.clone()
      const targetEuler = new Euler(0, 0, 0, 'YXZ')
      const targetQuaternion = new Quaternion().setFromEuler(targetEuler)
  
      new Tween(initialQuaternion)
        .to(targetQuaternion, 500) 
        .easing(Easing.Quadratic.InOut)
        .onUpdate(() => {
          $camera.quaternion.copy(initialQuaternion)
          onChange()
        })
        .start()
    }
  
    function animate(time: number) {
      requestAnimationFrame(animate)
      TWEEN.update(time)
    }
  
    animate(0)
</script>
