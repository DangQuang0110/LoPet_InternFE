import { createWebHistory,createRouter } from "vue-router";
//import Home from '@/components/ComHome.vue';
import FriendPage from "@/components/FriendPage.vue";
import LopetProfile from "@/components/LopetProfile.vue";
import LopetAbout from "@/components/LopetAbout.vue";
import LopetPhotoGallery from "@/components/LopetPhotoGallery.vue";
import LopetEditProfile from "@/components/LopetEditProfile.vue";
// Phần admin
//import AdminLayout from '@/components/admin/AdminLayout.vue';

const routes=[
    {
        path: "/friend",
        name:FriendPage,
        component:FriendPage,
    },
    {
        path: "/profile",
        name:LopetProfile,
        component:LopetProfile,
    },
    {
        path: "/about",
        name:LopetAbout,
        component:LopetAbout,
    },
    {
        path: "/photo",
        name:LopetPhotoGallery,
        component:LopetPhotoGallery,
    },
    {
        path: "/edit",
        name:LopetEditProfile,
        component:LopetEditProfile,
    },
    // {
    //     path: "/admin",
    //     component: AdminLayout,
    //     children: [
            {

            }
        
    //     ],
    // }
]
const router=createRouter({
    history:createWebHistory(),
    routes,
});
export default router    