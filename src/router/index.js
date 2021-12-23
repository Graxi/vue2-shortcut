import Vue from "vue";
import VueRouter from "vue-router";
//import App from "@/App";
import Demo from "@/components/Demo";
import Essential from '@/components/nav/Essential'
import Tools from "@/components/nav/Tools";
import View from "@/components/nav/View";

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path:'/',
            redirect:'/demo'
        },
        {
            path:'/demo',
            component:Demo,
            children:[
                {
                    path:'/essential',component:Essential
                },
                {
                    path:'/tool',component:Tools
                },
                {
                    path:'/view',component:View
                }
            ]
        }
    ]
})
export default router