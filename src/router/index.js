
import { createWebHistory,createRouter } from "vue-router";
import Home from '@/components/ComHome.vue';
import FriendPage from "@/components/FriendPage.vue";
import LopetProfile from "@/components/LopetProfile.vue";
import LopetAbout from "@/components/LopetAbout.vue";
import LopetPhotoGallery from "@/components/LopetPhotoGallery.vue";
import LopetEditProfile from "@/components/LopetEditProfile.vue";
import PetCommunity from "@/components/PetCommunity.vue";// mở rộng xem tất cả chủ gợi ý
import PetCommunityy from "@/components/PetCommunityy.vue";// chủ

import LoginView from '../layout/LoginView.vue'
import RegisterView from '../layout/RegisterView.vue'
import ResetPassword from '../layout/ResetPassword.vue'
import SetNewPassword from '../layout/SetNewPassword.vue'
import VerificationCode from '../layout/VerificationCode.vue'
import Message from '@/components/comMessage.vue';
import CreatePost from '@/components/CreatePost.vue'



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
    {
      path: "/groups",
      name: PetCommunityy,
      component:PetCommunityy,
    },
    { path: '/home',    name: 'Home',       component: Home },
  { path: '/create-post',    name: 'CreatePost',       component: CreatePost },
    // {
    //     path: "/admin",
    //     component: AdminLayout,
    //     children: [
        
    //     ],
    // }

  {
    path:'/message',
    name:'message',
    component:Message,
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: ResetPassword,
  },
  {
    path: '/setNewPassword',
    name: 'setNewPassword',
    component: SetNewPassword,
  },
  {
    path: '/verificationCode',
    name: 'verificationCode',
    component: VerificationCode,
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
export default router


