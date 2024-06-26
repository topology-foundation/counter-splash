<script>
    import { AutoColliders } from "@threlte/rapier";
    import { T } from "@threlte/core";
    export let position;
</script>

<AutoColliders shape={'cuboid'} friction={0}>
    <T.Mesh position={position}>
        <T.BoxGeometry args={[4, .2, 4]} />
        <T.MeshStandardMaterial color="#808080" />
    </T.Mesh>
    <T.Mesh name={'jumpPad'} position={[position[0], position[1] + .1, position[2]]}>
        <T.BoxGeometry args={[4 * 0.9, .3, 4 * 0.9]} />
        <T.MeshStandardMaterial color="#A9A9A9" />
    </T.Mesh>
</AutoColliders>