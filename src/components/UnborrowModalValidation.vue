<template>
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
            <div class="d-flex flex-column gap-4">
                <span>
                    Are you sure this book was returned?
                </span>
                <div class="d-flex align-items-center justify-content-between gap-3">
                    <button @click="close" class="w-50 btn btn-sm btn-outline-secondary rounded-sm shadow border-0">No</button>
                    <button @click="unborrow" class="w-50 btn btn-sm btn-primary rounded-sm shadow border-0">Yes</button>
                </div>
            </div>
        </div>
    </div>
</template>  
  
<script>
export default {
    props: {
        showModal: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        unborrow(){
            this.$emit('unborrow');
        }
    }
};
</script>
  
<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
    max-width: 100%;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}
</style>
  