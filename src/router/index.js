import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store.js';
import clientDepartment from '@/components/client-department.vue';
import untreatedWorks from '@/components/untreated-works';
import receivesAndReturns from '@/components/receives-returns';
import operatedHistory from '@/components/operated-history';
import reporters from '@/components/reporters';
import acceptanceCheck from '@/components/acceptance-check.vue';
import ticketCahier from '@/components/ticket-cashier.vue';
import materialsDistribute from '@/components/materials-distribute.vue';
import materialsInventory from '@/components/materials-inventory.vue';
import materialsApproveApplying from '@/components/materials-approve-applying.vue';
// import purchasingProgress from '@/components/purchasing-progress';
import turnInFunds from '@/components/turn-in-funds';
import materialSearchModify from '@/components/material-search-modify.vue';
import cashier from '@/components/cashier';
import requestPaying from '@/components/request-paying';
import acceptOtherFunds from '@/components/accept-other-funds';
import product from '@/components/product';
import inputByHand from '@/components/input-by-hand';
import importFromExcel from '@/components/import-from-excel.vue';
import checkOrders from '@/components/check-orders.vue';
import requestInvoice from '@/components/request-invoice.vue';
import ticketChangeRefound from '@/components/ticket-change-refound.vue';
import selecterOfFilledInvoice from '@/components/selecter-of-filled-invoice.vue';
import detailsInAFilledInvoice from '@/components/details-in-a-filled-invoice.vue';
import modifyApplyedFilledInvoice from '@/components/modify-applyed-filled-invoice.vue';
import refillCancelFilledInvoice from '@/components/refill-cancel-filled-invoice.vue';
import rulePrice from '@/components/rule-price.vue';
import project from '@/components/project.vue';
import contract from '@/components/contract.vue';
import equipment from '@/components/equipment.vue';
import employee from '@/components/employee.vue';
import login from '@/components/login.vue';
import applyPurchasing from '@/components/apply-purchasing.vue';
import approveApplyingPurchasing from '@/components/approve-applying-purchasing.vue';
import enquiryComparePrice from '@/components/enquiry-compare-price.vue';
import approveEnquiry from '@/components/approve-enquiry.vue';
import launchPurchasing from '@/components/launch-purchasing.vue';
import checkReceipts from '@/components/check-receipts.vue';
import requestFunds from '@/components/request-funds.vue';
import rqstPcsgFunds from '@/components/rqst-pcsg-funds.vue';
import primaryAuditsRqstFunds from '@/components/primary-audits-requesting-funds.vue';
import finalAuditsRqstingFunds from '@/components/final-audits-rqsting-funds.vue';
import pay from '@/components/pay.vue';
import reviewPayment from '@/components/review-payment.vue';
import ticketInbound from '@/components/ticket-inbound.vue';
import ticketOutbound from '@/components/ticket-outbound.vue';
import rqstRfdFee from '@/components/rqst-rfdtkt-paying.vue';
import home from '@/components/home.vue';
import authorizations from '@/components/authorizations.vue';
import changePswd from '@/components/change-pswd.vue';
import materialsApply from '@/components/materials-apply.vue';
Vue.use(Router);

const router =  new Router({
// export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/home',
      name: 'home',
      component: home
    },  
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/clientDepartment',
      name: 'bscinfo_clnt_dptmt',
      component: clientDepartment
    },
    {
      path: '/untreatedWorks',
      name: 'untreated-works',
      component: untreatedWorks
    },
    {
      path: '/receivesAndReturns',
      name: 'receives-returns',
      component: receivesAndReturns
    },
    {
      path: '/operatedHistory',
      name: 'operated-history',
      component: operatedHistory
    },
    {
      path: '/reporters',
      name: 'reports',
      component: reporters
    },
    {
      path: '/acceptanceCheck',
      name: 'materials_acceptance',
      component: acceptanceCheck
    },
    {
      path: '/ticket-cashier',
      name: 'finance_tkt_cashier',
      component: ticketCahier
    },
    {
      path: '/materialsDistribute',
      name: 'materials_distribute',
      component: materialsDistribute
    },
    {
      path: '/materialsInventory',
      name: 'materials_Inventory',
      component: materialsInventory
    },
    {
      path: '/materialsApproveApplying',
      name: 'materials_approve_applying',
      component: materialsApproveApplying
    },
    // {
    //   path: '/purchasingProgress',
    //   name: 'purchasing-progress',
    //   component: purchasingProgress
    // },
    {
      path: '/turn-in-funds',
      name: 'personal_turn_in',
      component: turnInFunds
    },
    {
      path: '/ticketChangeRefound',
      name: 'orders_tkt_change_refound',
      component: ticketChangeRefound
    },
    {
      path: '/materialSearchModify',
      name: 'materials_search',
      component: materialSearchModify
    },
    {
      path: '/cashier',
      name: 'finance_cashier',
      component: cashier
    },
    {
      path: '/requestPaying',
      name: 'request-paying',
      component: requestPaying
    },
    {
      path: '/accept-other-funds',
      name: 'finance_accept_other_funds',
      component: acceptOtherFunds
    },
    {
      path: '/product',
      name: 'bscinfo_product',
      component: product
    },
    {
      path: '/inputByHand',
      name: 'orders_input_byhand',
      component: inputByHand      
    },
    {
      path: '/importFromExcel',
      name: 'orders_import_from_excel',
      component: importFromExcel      
    },
    {
      path: '/checkOrders',
      name: 'orders_check_orders',
      component: checkOrders      
    },
    {
      path: '/requestInvoice',
      name: 'invoices_apply',
      component: requestInvoice      
    },
    {
      path: '/selecterOfFilledInvoice',
      name: 'selecter-of-filled-invoice',
      component: selecterOfFilledInvoice       
    },
    {
      path: '/detailsInAFilledInvoice',
      name: 'invoices_details',
      component: detailsInAFilledInvoice       
    },
    {
      path: '/modifyApplyedFilledInvoice',
      name: 'invoices_modify_fill',
      component: modifyApplyedFilledInvoice       
    },
    {
      path: '/refillCancelFilledInvoice',
      name: 'invoices_refill_cancel',
      component: refillCancelFilledInvoice       
    },
    {
      path: '/rulePrice',
      name: 'bscinfo_rule_price',
      component: rulePrice
    },
    {
      path: '/project',
      name: 'bscinfo_project',
      component: project
    },
    {
      path: '/contract',
      name: 'bscinfo_contract',
      component: contract
    },
    {
      path: '/equipment',
      name: 'bscinfo_equipment',
      component: equipment
    },
    {
      path: '/employee',
      name: 'bscinfo_employee',
      component: employee
    },
    {
      path: '/apply-purchsing',
      name: 'purchasing_apply',
      component: applyPurchasing
    },
    {
      path:'/approve-applying-purchasing',
      name:'purchasing_approve_applying',
      component:approveApplyingPurchasing
    },
    {
      path:'/enquiry-compare-price',
      name:'purchasing_enquiry_compare',
      component:enquiryComparePrice
    },
    {
      path:'/approve-enquiry',
      name:'purchasing_approve_enquiry',
      component:approveEnquiry
    },
    {
      path:'/launch-purchasing',
      name:'purchasing_launch',
      component:launchPurchasing
    },
    {
      path:'/check-receipts',
      name:'finance_check_receipts',
      component:checkReceipts
    },
    {
      path:'/request-funds',
      name:'rqstfunds_borrow_reimburse',
      component:requestFunds      
    },
    {
      path:'/rqst-pcsg-funds',
      name:'rqstfunds_purchasing_funds',
      component:rqstPcsgFunds 
    },
    {
      path:'/prmry-audits-rqst-funds',
      name:'rqstfunds_primary_audits',
      component:primaryAuditsRqstFunds 
    },
    {
      path:'/final-audits-rqst-funds',
      name:'rqstfunds_final_audits',
      component:finalAuditsRqstingFunds 
    },
    {
      path:'/pay',
      name:'finance_pay',
      component:pay 
    },
    {
      path:'/review-payment',
      name:'finance_review_payment',
      component:reviewPayment 
    },
    {
      path:'/ticket-inbound',
      name:'orders_tkt_inbound',
      component:ticketInbound 
    },
    {
      path:'/ticket-outbound',
      name:'orders_tkt_outbound',
      component:ticketOutbound 
    },
    {
      path:'/rqst-rfdtkt-paying',
      name:'rqstfunds_rfdtkt_paying',
      component:rqstRfdFee 
    },
    {
      path:'/authorizations',
      name:'bscinfo_authorization',
      component:authorizations
    },
    {
      path:'/materialsApply',
      name:'materials_apply',
      component:materialsApply
    },    
    {
      path:'/change-pswd',
      name:'personal_modify_info',
      component:changePswd
    },
    {
      path:'*',
      redirect:'/'
    }
  ]
});
      // import changePswd from '@/components/change-pswd.vue';

router.beforeEach((to,from,next) => {
  if(store.state.isLogined) {//用户已经登录
    if(to.name==='home') {//前住主页
      next();
      return;
    } else {
      if(to.path=='/') {//前住登录页
        next('/home');
        return;
      }
    }
    if(store.state.user[to.name] && to.path!=='/selecterOfFilledInvoice') {//有权限且不前往发票详情页
      next();
    } else {
      if(to.path==='/selecterOfFilledInvoice') {
        if(store.state.user['invoices_details']) {
          next();
        } else {
          next('/home');
        }
      } else {
        next('/home');
      }
    }
    // console.log(store.state.user);
  } else {
    if(to.path!=='/') {
      next('/');
    } else {
      next();
    }
  }    
})

export default router;
