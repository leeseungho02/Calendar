<template>
    <div class="day d-flex justify-content-center align-items-center flex-column" v-bind:class="[day.now ? 'active' : '', day.nextDay ? 'nextDay' : '']" @click.stop="openPopup">
        <div :class="[day.listCheck ? 'day_before' : '']"></div>
        <div class="date">
            <span class="number">{{day.date.getDate()}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'day',
        props: ['day'],
        data() {
            return {}
        },
        methods: {
            openPopup() {
                this.$emit("open");
            },
            openEditPopup(idx) {
                this.$emit("edit", event, idx, this.day.idx);
            }
        }
    }
</script>