import { createWebHistory, createRouter } from "vue-router";
import ComHome from '@/components/ComHome.vue';
import FriendPage from "@/components/FriendPage.vue";
import LopetProfile from "@/components/LopetProfile.vue";
import LopetPhotoGallery from "@/components/LopetPhotoGallery.vue";
// import GroupPage from "@/components/GroupPage.vue";
// import GroupJoinedView from "@/components/GroupJoinedView.vue";
import PetCommunity from "@/components/PetCommunity.vue";
import PetCommunityy from "@/components/PetCommunityy.vue";
import ComCodelol from "@/components/ComCodelol.vue";
// Phần admin
import AdminLayout from "@/components/admin/AdminLayout.vue";
import Admindenounce from "@/components/admin/Admindenounce.vue";
import AdminLopetUser from "@/components/admin/AdminLopetUser.vue";
import AdminLopetAdvertisement from "@/components/admin/AdminLopetAdvertisement.vue";
const routes = [
    {
        path: "/home",
        name: "ComHome", 
        component: ComHome,
    },
    {
        path: "/friend",
        name: "FriendPage", 
        component: FriendPage,
    },
    {
        path: "/profile",
        name: "LopetProfile",
        component: LopetProfile,
    },
    
    {
        path: "/photo",
        name: "LopetPhotoGallery",
        component: LopetPhotoGallery,
    },
    // {
    //     path: "/group",
    //     name: "GroupPage",
    //     component: GroupPage,
    // },
    // {
    //     path: "/groupjoined",
    //     name: "GroupJoinedView",
    //     component: GroupJoinedView,
    // },
    {
        path: "/get",
        name: "ComCodelol",
        component: ComCodelol,
    },
    {
        path: "/pet",
        name: "PetCommunity",
        component: PetCommunity,
    },
    {
        path: "/pets",
        name: "PetCommunityy",
        component: PetCommunityy,
    },
    {
        path: "/admin",
        name: "AdminLayout",
        component: AdminLayout,
        children: [
            {
                path: "denounce",
                name: "Admindenounce", 
                component: Admindenounce,
            },
            {
                path: "user",
                name: "AdminLopetUser",
                component: AdminLopetUser,
            },
            {
                path: "advertisement",
                name: "AdminLopetAdvertisement",
                component: AdminLopetAdvertisement,
            },
            
        ],
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;