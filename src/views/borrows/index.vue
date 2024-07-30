<template>
    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-md-12">
                <router-link :to="{ name: 'home' }" class="btn btn-md btn-success rounded shadow border-0 mb-3">ADD BORROW</router-link>
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <table class="table table-bordered">
                            <thead class="bg-dark text-white">
                                <tr>
                                    <th scope="col" @click="sortBy('customer_name')">
                                        Borrower
                                        <i v-if="params.sort === 'customer_name'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" @click="sortBy('book_title')">
                                        Book
                                        <i v-if="params.sort === 'book_title'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" @click="sortBy('borrow_start')">
                                        Borrow Start Date
                                        <i v-if="params.sort === 'borrow_start'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" @click="sortBy('borrow_end')">
                                        Borrow End Date
                                        <i v-if="params.sort === 'borrow_end'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" @click="sortBy('book_price')">
                                        Price
                                        <i v-if="params.sort === 'book_price'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" class="text-center" style="width:15%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="borrows.length == 0">
                                    <td colspan="6" class="text-center">
                                        <div class="alert alert-danger mb-0">
                                            Data Belum Tersedia!
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else v-for="(borrow, index) in borrows" :key="index">
                                    <td>
                                        {{ borrow.customer.customer_name ?? '-' }} 
                                        <span v-if="borrow.customer.customer_status == 0">( Deleted )</span>
                                    </td>
                                    <td>
                                        {{ borrow.book.book_title ?? '-' }}
                                        <span v-if="borrow.book.book_status == 0">( Deleted )</span>
                                    </td>
                                    <td>{{ formatDate(borrow.borrow_start) }}</td>
                                    <td>{{ formatDate(borrow.borrow_end) }}</td>
                                    <td>{{ formatNumberToThousands(borrow.book.book_price) }}</td>
                                    <td class="d-flex justify-content-center">
                                        <button v-if="borrow.borrow_status == 1" @click="unborrowModal(borrow.id)" class="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">
                                            Returned
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

        <UnborrowModalValidation :showModal="showModal" @close="closeUnborrowModal()" @unborrow="submitUnborrow()"/>
    </div>
</template>

<script>
import api from '../../api';
import UnborrowModalValidation from '../../components/UnborrowModalValidation.vue';

export default {
    components: {
        UnborrowModalValidation
    },
    data() {
        return {
            borrows: [],
            
            totalPages: 1,
            showModal: false,

            borrow_id: null,
            
            params: {
                search: "",
                sort: "borrow_title",
                sort_type: "asc",
                page: 1,
                per_page: 10,
            }
        }
    },
    methods: {
        async fetchData() {
            const params = this.params;
            const response = await api.get('/borrows', { params });
            this.borrows = response.data.data.data;
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
        formatDate(dateString) {
            if (!dateString) return '-';
            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', options); // use id-ID if want in Indonesian
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
        unborrowModal(id){
            this.borrow_id = id;
            this.showModal = true;
        },
        closeUnborrowModal(){
            this.showModal = false;
            this.borrow_id = null;
        },
        async submitUnborrow(){
            try {
                const response = await api.post('/borrows/' + this.borrow_id);
                if(response.data.success){
                    this.showModal = false;
                    this.borrow_id = null;
                    this.fetchData();
                }
            } catch (error) {
                console.error('Error submitting unborrow:', error?.response?.data || error);
            }
        }
    },
    mounted() {
        this.fetchData();
    }
}
</script>