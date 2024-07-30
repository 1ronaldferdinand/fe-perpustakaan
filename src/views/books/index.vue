<template>
    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-md-12">
                <router-link :to="{ name: 'books.create' }" class="btn btn-md btn-success rounded shadow border-0 mb-3">ADD BOOK</router-link>
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <table class="table table-bordered">
                            <thead class="bg-dark text-white">
                                <tr>
                                    <th scope="col" @click="sortBy('book_title')">
                                        Title
                                        <i v-if="params.sort === 'book_title'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" @click="sortBy('book_publisher')">
                                        Publisher
                                        <i v-if="params.sort === 'book_publisher'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" @click="sortBy('book_size')">
                                        Size ( page(s) )
                                        <i v-if="params.sort === 'book_size'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" @click="sortBy('book_price')">
                                        Price ( IDR )
                                        <i v-if="params.sort === 'book_price'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" @click="sortBy('book_stocks')">
                                        Stocks
                                        <i v-if="params.sort === 'book_stocks'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" class="text-center" style="width:15%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="books.length == 0">
                                    <td colspan="6" class="text-center">
                                        <div class="alert alert-danger mb-0">
                                            Data Belum Tersedia!
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else v-for="(book, index) in books" :key="index">
                                    <td>{{ book.book_title }}</td>
                                    <td>{{ book.book_publisher }}</td>
                                    <td>{{ book.book_size }}</td>
                                    <td>{{ formatNumberToThousands(book.book_price) }}</td>
                                    <td>{{ book.book_stocks }}</td>
                                    <td class="d-flex justify-content-center">
                                        <router-link :to="{ name: 'books.edit', params:{id: book.id} }" class="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">
                                            <i class="fa fa-pen"></i>
                                        </router-link>
                                        <button @click="showDestroyModal(book.id)" class="btn btn-sm btn-danger rounded-sm shadow border-0">
                                            <i class="fa fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="d-flex justify-content-between mt-4">
                            <button 
                                @click="changePage(params.page - 1)" 
                                :disabled="params.page === 1"
                                class="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
                            >
                                Previous
                            </button>
                            <span class="mx-2 d-flex align-items-center">Page {{ params.page }} of {{ totalPages }}</span>
                            <button 
                                @click="changePage(params.page + 1)" 
                                :disabled="params.page === totalPages"
                                class="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <DeleteModalValidation :showModal="showModal" @close="closeModal()" @destroy="destroyData()" />
    </div>
</template>

<script>
import api from '../../api';
import DeleteModalValidation from '../../components/DeleteModalValidation.vue';

export default {
    components: {
        DeleteModalValidation
    },  
    data() {
        return {
            books: [],
            
            totalPages: 1,

            showModal: false,
            destroy_id: null,
            
            params: {
                search: "",
                sort: "book_title",
                sort_type: "asc",
                page: 1,
                per_page: 10,
            }
        }
    },
    methods: {
        async fetchData() {
            const params = this.params;
            const response = await api.get('/books', { params });
            this.books = response.data.data.data;
            this.totalPages = response.data.data.last_page;
        },
        sortBy(column) {
            if (this.params.sort === column) {
                this.params.sort_type = this.params.sort_type === 'asc' ? 'desc' : 'asc';
            } else {
                this.params.sort = column;
                this.params.sort_type = 'asc';
            }

            this.fetchData();
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.params.page = page;
            this.fetchData();
        },
        formatNumberToThousands(value) {
            if (!value) return '-';

            let [integerPart, decimalPart] = value.toString().split('.');
            integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            
            if (decimalPart) {
                return `${integerPart},${decimalPart}`;
            }

            return integerPart;
        },
        closeModal(){
            this.showModal = false;
            this.destroy_id = null;
        },
        showDestroyModal(id){
            this.destroy_id = id;
            this.showModal = true;
        },
        async destroyData() {
            try {
                const response = await api.delete('/books/' + this.destroy_id);
                if(response.data.success){
                    this.showModal = false;
                    this.destroy_id = null;
                    this.fetchData();
                }
            } catch (error) {
                console.error('Error delete books:', error?.response?.data || error);
            }
        }
    },
    mounted() {
        this.fetchData();
    }
}
</script>