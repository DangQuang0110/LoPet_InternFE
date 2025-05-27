import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import LoginView from '../layout/LoginView.vue'
import RegisterView from '../layout/RegisterView.vue'
import ResetPassword from '../layout/ResetPassword.vue'
import SetNewPassword from '../layout/SetNewPassword.vue'
import VerificationCode from '../layout/VerificationCode.vue'
import GroupJoinedView from '../layout/GroupJoinedView.vue'
import GroupEdit from '../layout/GroupEdit.vue'
import GroupPage from '../layout/GroupPage.vue'
import PetCommunity from '../layout/PetCommunity.vue'
import PetCommunityy from '../layout/PetCommunityy.vue'
// import AboutView from '../components/AboutView.vue'

const routes = [
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

  {
    path: '/groupJoined',
    name: 'groupJoined',
    component: GroupJoinedView,
  },
  {
    path: '/groupEdit',
    name: 'groupEdit',
    component: GroupEdit,
  },

  {
    path: '/groupPage',
    name: 'groupPage',
    component: GroupPage,
  },
    {
    path: '/petCommunity',
    name: 'petCommunity',
    component: PetCommunity,
  },
    {
    path: '/petCommunityy',
    name: 'petCommunityy',
    component: PetCommunityy,
  },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: HomeView,
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: AboutView,
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
