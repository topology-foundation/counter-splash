<script lang="ts">
    import { T } from '@threlte/core'
    import { pixels } from '$lib/store/wall'
    import { mousePosition, isMouseDown } from '$lib/store/player';
    import { onMount } from 'svelte';
    import { AutoColliders } from '@threlte/rapier'
    import * as THREE from 'three';
    import { get } from 'svelte/store';
    import { generateRandomPixels, initPixelToImage } from '$lib/handler';
    import { interactivity } from '@threlte/extras'
    interactivity()

    let texture : any;
    const data = get(pixels);


    const width = 4000;
    const height = 3000;

    interface ExtendedPointerEvent extends PointerEvent {
        uv: {
            x: number
            y: number
        }
    }

    function handlePointerMove (event: ExtendedPointerEvent): void {
        mousePosition.set(event.uv)
    }

    function handlePointerDown (): void {
        isMouseDown.set(true)
    }

    function handlePointerUp (): void {
        isMouseDown.set(false)
        
    }

    onMount(() => {
        texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
        texture.needsUpdate = true;

        pixels.subscribe(pixelData => {
            texture.image.data.set(pixelData);
            texture.needsUpdate = true;
        });
        initPixelToImage('/DrawHere.png')
        //generateRandomPixels(width, height, width * height * 4);
        
    });
</script>

<T.Group position={[0, 27, -50]}   
    on:pointermove={handlePointerMove}
    on:pointerdown={handlePointerDown}
    on:pointerup={handlePointerUp}
>
        <AutoColliders shape={'cuboid'} friction={0}>
        <T.Mesh name="SplashWall">
            <T.PlaneGeometry args={[100, 80]} />
            <T.MeshBasicMaterial map={texture} />
        </T.Mesh>
    </AutoColliders>
</T.Group>
