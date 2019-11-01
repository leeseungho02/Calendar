<template>
    <div class="item d-flex position-relative" @click.stop="viewEdit">
        <div class="c"></div>
        <div class="content">
            <div class="title">{{ item.name }}</div>
            <div class="time">{{ item.content }}</div>
        </div>
        <font-awesome-icon icon="pen" class="edit" @click.stop="edit" v-if="item.icon"/>
    </div>
</template>

<script>
    export default {
        name: 'item',
        props: ['item'],
        data() {
            return {}
        },
        methods: {
            edit() {
                this.$emit("open");
            },
            viewEdit() {
                this.$emit("view");
            }
        }
    }
</script>