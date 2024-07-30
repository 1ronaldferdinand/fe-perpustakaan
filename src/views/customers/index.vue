<template>
    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-md-12">
                <router-link :to="{ name: 'customers.create' }" class="btn btn-md btn-success rounded shadow border-0 mb-3">ADD CUSTOMER</router-link>
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <table class="table table-bordered">
                            <thead class="bg-dark text-white">
                                <tr>
                                    <th scope="col" @click="sortBy('customer_number')">
                                        Number
                                        <i v-if="params.sort === 'customer_number'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" @click="sortBy('customer_name')">
                                        Name
                                        <i v-if="params.sort === 'customer_name'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" @click="sortBy('customer_birthdate')">
                                        Birthdate
                                        <i v-if="params.sort === 'customer_birthdate'" :class="['fa', params.sort_type === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                                    </th>
                                    <th scope="col" class="text-center" style="width:15%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="customers.length == 0">
                                    <td colspan="4" class="text-center">
                                        <div class="alert alert-danger mb-0">
                                            Data Belum Tersedia!
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else v-for="(customer, index) in customers" :key="index">
                                    <td>{{ customer.customer_number ?? '-' }}</td>
                                    <td>{{ customer.customer_name ?? '-' }}</td>
                                    <td>{{ formatDate(customer.customer_birthdate) }}</td>
                                    <td class="d-flex justify-content-center">
                                        <router-link :to="{ name: 'customers.edit', params:{id: customer.id} }" class="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">
                                            <i class="fa fa-pen"></i>
                                        </router-link>
                                        <button @click="showDestroyModal(customer.id)" class="btn btn-sm btn-danger rounded-sm shadow border-0">
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

        <DeleteModalValidation :showModal="showModal" @close="closeModal()" @destroy="destroyData()"/>
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
            customers: [],
            
            totalPages: 1,

            showModal: false,
            destroy_id: null,
            
            params: {
                search: "",
                sort: "customer_number",
                sort_type: "asc",
                page: 1,
                per_page: 10,
            }
        }
    },
    methods: {
        async fetchData() {
            const params = this.params;
            const response = await api.get('/customers', { params });
            this.customers = response.data.data.data;
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
                const response = await api.delete('/customers/' + this.destroy_id);
                if(response.data.success){
                    this.showModal = false;
                    this.destroy_id = null;
                    this.fetchData();
                }
            } catch (error) {
                console.error('Error delete customer:', error?.response?.data || error);
            }
        }
    },
    mounted() {
        this.fetchData();
    }
}
</script>