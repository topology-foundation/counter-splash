

<script>
    import { T } from '@threlte/core'
    import ObstaclePlatforms from "../ObstaclePlatforms.svelte";
    import Level1Walls from "./Level1Walls.svelte";
    import GenericPlaform from '../GenericPlatform.svelte';

</script>


<T.Group>
    <ObstaclePlatforms />
    <Level1Walls />
    <GenericPlaform position={[-11, -8, 23]} />
    <GenericPlaform position={[-30, -8, 61]} />
    <GenericPlaform position={[-22, -8, 42]} />
    <GenericPlaform position={[-20, -8, 53]} />
    <GenericPlaform position={[4, -9, 4 ]} />
    <GenericPlaform position={[9, -9, -19 ]} />
    <GenericPlaform position={[24, -8, 26 ]} />
    <GenericPlaform position={[0, -8, 55 ]} />
    <GenericPlaform position={[42, -8, 46 ]} />
    <GenericPlaform position={[45, -10, 75 ]} />
</T.Group>