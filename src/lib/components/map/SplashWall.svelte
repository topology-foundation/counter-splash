<script lang="ts">
    import { T } from '@threlte/core'
    import { HTML } from '@threlte/extras'
    import { pixels } from '$lib/store/wall'
    import { onMount } from 'svelte';
    import { AutoColliders } from '@threlte/rapier'
    import { generateRandomPixels } from '$lib/handler';
  import { Box } from 'lucide-svelte';


    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null;

    const width = 4000;
    const height = 3000;

    onMount(() => {
        context = canvas.getContext('2d');

        const unsubscribe = pixels.subscribe(value => {
            if (context) {
                context.clearRect(0, 0, width, height);
                for (const [key, color] of Object.entries(value)) {
                    const [x, y] = key.split(',').map(Number);
                    context.fillStyle = color as string;
                    context.fillRect(x, y, 1, 1);
                }
            }
        });

        generateRandomPixels(width, height, 50000);

        return () => {
        unsubscribe();
        };
    });
</script>

<T.Group position={[0, 27, -50]}>
        <AutoColliders shape={'cuboid'}>
        <T.Mesh>
            <T.BoxGeometry args={[100, 80, 1]} />
            <HTML
                transform
            >
                <canvas bind:this={canvas} width={width} height={height} class="bg-white"></canvas>
            </HTML>
        </T.Mesh>
    </AutoColliders>
</T.Group>