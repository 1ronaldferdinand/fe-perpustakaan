<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-12">
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <form @submit.prevent="updateBook()">
                            <div v-if="errorMessage" class="alert alert-danger">
                                {{ errorMessage }}
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Title <span style="color: red;">*</span></label>
                                <input type="text" class="form-control" v-model="book.book_title" placeholder="Book's Title">
                                <div v-if="errors.book_title" class="alert alert-danger mt-2">
                                    <span>{{ errors.book_title[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Publisher <span style="color: red;">*</span></label>
                                <input type="text" class="form-control" v-model="book.book_publisher" placeholder="Book's Publisher">
                                <div v-if="errors.book_publisher" class="alert alert-danger mt-2">
                                    <span>{{ errors.book_publisher[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Size ( pages )</label>
                                <input type="number" min="0" class="form-control" v-model="book.book_size" placeholder="Book's Size">
                                <div v-if="errors.book_size" class="alert alert-danger mt-2">
                                    <span>{{ errors.book_size[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Price</label>
                                <input type="number" min="0" class="form-control" v-model="book.book_price" placeholder="Book's Price">
                                <div v-if="errors.book_price" class="alert alert-danger mt-2">
                                    <span>{{ errors.book_price[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Stocks</label>
                                <input type="number" min="0" class="form-control" v-model="book.book_stocks" placeholder="Book's Stocks">
                                <div v-if="errors.book_stocks" class="alert alert-danger mt-2">
                                    <span>{{ errors.book_stocks[0] }}</span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-md btn-primary rounded-sm shadow border-0">Update Book</button>
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
            book: {
                book_title: "",
                book_publisher: "",
                book_size: 0,
                book_price: 0,
                book_stocks: 0,
            },

            errors: [],
            errorMessage: "",
        }
    },
    methods: {
        async updateBook(){
            let formData = {
                book_title: this.book.book_title,
                book_publisher: this.book.book_publisher,
                book_size: this.book.book_size,
                book_price: this.book.book_price,
                book_stocks: this.book.book_stocks
            };

            await api.put('/books/' + this.$route.params.id, formData)
            .then(() => {
                this.$router.push('/books');
            })
            .catch((error) => {
                this.errors = error.response.data.data;

                if(error.response.status != 422){
                    this.errorMessage = 'Failed to submit book. Please try again later.';
                }
            })
        },
        async fetchBook(){
            const response = await api.get('/books/' + this.$route.params.id);
            this.book = response.data.data;
        }
    },
    mounted() {
        this.fetchBook();
    }
}
</script>