import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home.vue')
    },
    {
        path: '/books',
        name: 'books.index',
        component: () => import('../views/books/index.vue')
    },
    {
        path: '/books/create',
        name: 'books.create',
        component: () => import('../views/books/create.vue')
    },
    {
        path: '/books/edit/:id',
        name: 'books.edit',
        component: () => import('../views/books/edit.vue')
    },
    {
        path: '/customers',
        name: 'customers.index',
        component: () => import('../views/customers/index.vue')
    },
    {
        path: '/customers/create',
        name: 'customers.create',
        component: () => import('../views/customers/create.vue')
    },
    {
        path: '/customers/edit/:id',
        name: 'customers.edit',
        component: () => import('../views/customers/edit.vue')
    },
    {
        path: '/borrows',
        name: 'borrows.index',
        component: () => import('../views/borrows/index.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router