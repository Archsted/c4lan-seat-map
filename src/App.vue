<template>
    <div id="app">
        <seat-map></seat-map>
    </div>
</template>

<script>
    import SeatMap from "./components/SeatMap";

    export default {components: {
            SeatMap
        }
    }
</script>

<style>
    body {
        margin: 0;
    }
    #app {
    }
</style>
