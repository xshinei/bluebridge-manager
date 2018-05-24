import Vue from 'vue'
import Router from 'vue-router'

import VLogin from '@/components/vLogin';
import VLayout from '@/components/vLayout';
import VDataView from '../base/vDataView';

import VProblemTable from '@/components/vProblemTable';
import VProblemAdd from '@/components/vProblemAdd';
import VProblemEdit from '@/components/vProblemEdit';
import VAdminList from '@/components/vAdminList';
import VAdminAdd from '@/components/vAdminAdd';
import VAdminEdit from '@/components/vAdminEdit';
import VTeacherList from '@/components/vTeacherList';
import VTeacherEdit from '@/components/vTeacherEdit';
import VStudentList from '@/components/vStudentList';
import VStudentEdit from '@/components/vStudentEdit';
import VSubmissionList from '@/components/vSubmissionList';
import VSubmissionEdit from '@/components/vSubmissionEdit';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/manager',
      name: 'vLayout',
      meta: {
        requireLogin: true
      },
      component: VLayout,
      children: [
        {
          path: 'dataView',
          name: '',
          meta: {
            requireLogin: true
          },
          component: VDataView
        },
        {
          path: 'problemList/:type',
          name: 'vProblemTable',
          props: true,
          meta: {
            requireLogin: true
          },
          component: VProblemTable,
        },
        {
          path: 'problemAdd',
          name: 'vProblemAdd',
          meta: {
            requireLogin: true
          },
          component: VProblemAdd
        },
        {
          path: 'problemEdit/:problemId',
          name: 'vProblemEdit',
          props: true,
          meta: {
            requireLogin: true
          },
          component: VProblemEdit
        },
        {
          path: 'adminList',
          name: 'vAdminList',
          meta: {
            requireLogin: true,
            requireJurisdiction: true
          },
          component: VAdminList
        },
        {
          path: 'adminAdd',
          name: 'vAdminAdd',
          meta: {
            requireLogin: true,
            requireJurisdiction: true
          },
          component: VAdminAdd
        },
        {
          path: 'adminEdit/:adminId',
          name: 'vAdminEdit',
          props: true,
          meta: {
            requireLogin: true,
            requireJurisdiction: true
          },
          component: VAdminEdit
        },
        {
          path: 'teacherList',
          name: 'vTeacherList',
          meta: {
            requireLogin: true
          },
          component: VTeacherList
        },
        {
          path: 'teacherEdit/:teacherId',
          name: 'vTeacherEdit',
          props: true,
          meta: {
            requireLogin: true
          },
          component: VTeacherEdit
        },
        {
          path: 'studentList',
          name: 'vStudentList',
          meta: {
            requireLogin: true
          },
          component: VStudentList
        },
        {
          path: 'studentEdit/:studentId',
          name: 'vStudentEdit',
          meta: {
            requireLogin: true
          },
          props: true,
          component: VStudentEdit
        },
        {
          path: 'submissionList',
          name: 'vSubmission',
          meta: {
            requireLogin: true
          },
          component: VSubmissionList
        },
        {
          path: 'submissionEdit/:submissionId',
          name: '',
          props: true,
          meta: {
            requireLogin: true
          },
          component: VSubmissionEdit
        }
      ]
    },
    {
      path: '/',
      name: 'vLogin',
      component: VLogin
    }
  ]
});

router.beforeEach((to, from, next) => {
  if(to.meta.requireLogin) {
    if(window.localStorage.getItem('admin') && window.localStorage.getItem('token')) {
      next();
    }
    else {
      alert('信息过期，请重新登录!');

      next({
        path: '/',
        query: {redirect: to.fullPath}
      });
    }
  }
  else {
    next();
  }
});

export default router;
