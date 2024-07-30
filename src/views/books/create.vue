<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-12">
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <form @submit.prevent="storeBook()">
                            <div v-if="errorMessage" class="alert alert-danger">
                                {{ errorMessage }}
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Title <span style="color: red;">*</span></label>
                                <input type="text" class="form-control" v-model="title" placeholder="Book's Title">
                                <div v-if="errors.book_title" class="alert alert-danger mt-2">
                                    <span>{{ errors.book_title[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Publisher <span style="color: red;">*</span></label>
                                <input type="text" class="form-control" v-model="publisher" placeholder="Book's Publisher">
                                <div v-if="errors.book_publisher" class="alert alert-danger mt-2">
                                    <span>{{ errors.book_publisher[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Size ( pages )</label>
                                <input type="number" min="0" class="form-control" v-model="size" placeholder="Book's Size">
                                <div v-if="errors.book_size" class="alert alert-danger mt-2">
                                    <span>{{ errors.book_size[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Price</label>
                                <input type="number" min="0" class="form-control" v-model="price" placeholder="Book's Price">
                                <div v-if="errors.book_price" class="alert alert-danger mt-2">
                                    <span>{{ errors.book_price[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Stocks</label>
                                <input type="number" min="0" class="form-control" v-model="stocks" placeholder="Book's Stocks">
                                <div v-if="errors.book_stocks" class="alert alert-danger mt-2">
                                    <span>{{ errors.book_stocks[0] }}</span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-md btn-primary rounded-sm shadow border-0">Save Book</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../api';

export default {
    data() {
        return {
            title: "",
            publisher: "",
            size: 0,
            price: 0,
            stocks: 0,

            errors: [],
            errorMessage: "",
        }
    },
    methods: {
        async storeBook(){
            let formData = new FormData();
            
            formData.append("book_title", this.title);
            formData.append("book_publisher", this.publisher);
            formData.append("book_size", this.size);
            formData.append("book_price", this.price);
            formData.append("book_stocks", this.stocks);

            await api.post('/books', formData)
            .then(() => {
                this.$router.push('/books');
            })
            .catch((error) => {
                this.errors = error.response.data.data;

                if(error.response.status != 422){
                    this.errorMessage = 'Failed to submit book. Please try again later.';
                }
            })
        }
    }
}
</script>