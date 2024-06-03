<script lang="ts">
    import { T } from '@threlte/core'
    import { pixels } from '$lib/store/wall'
    import { onMount } from 'svelte';
    import { AutoColliders } from '@threlte/rapier'
    import * as THREE from 'three';
    import { get } from 'svelte/store';
    import { generateRandomPixels } from '$lib/handler';


    let texture : any;
    const data = get(pixels);


    const width = 4000;
    const height = 3000;

    onMount(() => {
        texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
        texture.needsUpdate = true;

        pixels.subscribe(pixelData => {
            texture.image.data.set(pixelData);
            texture.needsUpdate = true;
        });
        generateRandomPixels(width, height, width * height * 4);
    });
</script>

<T.Group position={[0, 27, -50]}>
        <AutoColliders shape={'cuboid'}>
        <T.Mesh>
            <T.PlaneGeometry args={[100, 80]} />
            <T.MeshBasicMaterial map={texture} />
        </T.Mesh>
    </AutoColliders>
</T.Group>
