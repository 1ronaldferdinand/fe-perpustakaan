<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-12">
                <div class="card border-0 rounded shadow">
                    <div class="card-body">
                        <form @submit.prevent="updateCustomer()">
                            <div v-if="errorMessage" class="alert alert-danger">
                                {{ errorMessage }}
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Name <span style="color: red;">*</span></label>
                                <input type="text" class="form-control" v-model="customer.customer_name" placeholder="Customer's Name">
                                <div v-if="errors.customer_name" class="alert alert-danger mt-2">
                                    <span>{{ errors.customer_name[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Number <span style="color: red;">*</span></label>
                                <input type="text" class="form-control" v-model="customer.customer_number" placeholder="Customer's Number">
                                <div v-if="errors.customer_number" class="alert alert-danger mt-2">
                                    <span>{{ errors.customer_number[0] }}</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Birthdate <span style="color: red;">*</span></label>
                                <input type="date" class="form-control" v-model="customer.customer_birthdate" placeholder="Customer's Birthdate">
                                <div v-if="errors.customer_birthdate" class="alert alert-danger mt-2">
                                    <span>{{ errors.customer_birthdate[0] }}</span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-md btn-primary rounded-sm shadow border-0">Update Customer</button>
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
            customer: {
                customer_name: "",
                customer_number: "",
                customer_birthdate: "",
            },

            errors: [],
            errorMessage: "",
        }
    },
    methods: {
        async updateCustomer(){
            let formData = {
                customer_name: this.customer.customer_name,
                customer_number: this.customer.customer_number,
                customer_birthdate: this.customer.customer_birthdate,
            };

            await api.put('/customers/' + this.$route.params.id, formData)
            .then(() => {
                this.$router.push('/customers');
            })
            .catch((error) => {
                this.errors = error.response.data.data;

                if(error.response.status != 422){
                    this.errorMessage = 'Failed to submit customer. Please try again later.';
                }
            })
        },
        async fetchCustomer(){
            const response = await api.get('/customers/' + this.$route.params.id);
            this.customer = response.data.data;
        }
    },
    mounted() {
        this.fetchCustomer();
    }
}
</script>