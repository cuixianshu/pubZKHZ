import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store.js';
// import clientDepartment from '@/components/client-department.vue';
//import receivesAndReturns from '@/components/receives-returns';
import operatedHistory from '@/components/operated-history';
// import reportsSale from '@/components/reports-sale.vue';
//import acceptanceCheck from '@/components/acceptance-check.vue';
//import ticketCahier from '@/components/ticket-cashier.vue';
//import materialsDistribute from '@/components/materials-distribute.vue';
//import materialsInventory from '@/components/materials-inventory.vue';
// import materialsApproveApplying from '@/components/materials-approve-applying.vue';
// import purchasingProgress from '@/components/purchasing-progress';
//import turnInFunds from '@/components/turn-in-funds.vue';
// import materialSearchModify from '@/components/material-search-modify.vue';
// import cashier from '@/components/cashier';
// import requestPaying from '@/components/request-paying';
// import acceptOtherFunds from '@/components/accept-other-funds';
// import product from '@/components/product';
// import inputByHand from '@/components/input-by-hand';
// import importFromExcel from '@/components/import-from-excel.vue';
// import checkOrders from '@/components/check-orders.vue';
// import requestInvoice from '@/components/request-invoice.vue';
// import ticketChangeRefound from '@/components/ticket-change-refound.vue';
// import selecterOfFilledInvoice from '@/components/selecter-of-filled-invoice.vue';
// import detailsInAFilledInvoice from '@/components/details-in-a-filled-invoice.vue';
// import modifyApplyedFilledInvoice from '@/components/modify-applyed-filled-invoice.vue';
// import refillCancelFilledInvoice from '@/components/refill-cancel-filled-invoice.vue';
// import rulePrice from '@/components/rule-price.vue';
// import project from '@/components/project.vue';
// import contract from '@/components/contract.vue';
// import equipment from '@/components/equipment.vue';
// import employee from '@/components/employee.vue';
import login from '@/components/login.vue';
// import applyPurchasing from '@/components/apply-purchasing.vue';
// import approveApplyingPurchasing from '@/components/approve-applying-purchasing.vue';
// import enquiryComparePrice from '@/components/enquiry-compare-price.vue';
// import approveEnquiry from '@/components/approve-enquiry.vue';
// import launchPurchasing from '@/components/launch-purchasing.vue';
// import checkReceipts from '@/components/check-receipts.vue';
// import requestFunds from '@/components/request-funds.vue';
// import rqstPcsgFunds from '@/components/rqst-pcsg-funds.vue';
// import primaryAuditsRqstFunds from '@/components/primary-audits-requesting-funds.vue';
// import finalAuditsRqstingFunds from '@/components/final-audits-rqsting-funds.vue';
// import pay from '@/components/pay.vue';
// import reviewPayment from '@/components/review-payment.vue';
// import ticketInbound from '@/components/ticket-inbound.vue';
// import ticketOutbound from '@/components/ticket-outbound.vue';
// import rqstRfdFee from '@/components/rqst-rfdtkt-paying.vue';
import home from '@/components/home.vue';
// import authorizations from '@/components/authorizations.vue';
// import changePswd from '@/components/change-pswd.vue';
// import materialsApply from '@/components/materials-apply.vue';
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
      component:resolve => require(['@/components/client-department.vue'], resolve)
      //component: clientDepartment
    },
    {
      path: '/reports-finance',
      name: 'reports_finance',
      component:resolve => require(['@/components/reports-finance.vue'], resolve)
      //component: receivesAndReturns
    },
    {
      path: '/reports-purchasing',
      name: 'reports_purchasing',
      component:resolve => require(['@/components/reports-purchasing.vue'], resolve)
      //component: receivesAndReturns
    },
    {
      path: '/operatedHistory',
      name: 'operated-history',
      component: operatedHistory
    },
    {
      path: '/reports-sale',
      name: 'reports_sale',
      component:resolve => require(['@/components/reports-sale.vue'], resolve)
      // component: reportsSale
    },
    {
      path: '/acceptanceCheck',
      name: 'materials_acceptance',
      component:resolve => require(['@/components/acceptance-check.vue'], resolve)
      //component: acceptanceCheck
    },
    {
      path: '/ticket-cashier',
      name: 'finance_tkt_cashier',
      component:resolve => require(['@/components/ticket-cashier.vue'], resolve)
      //component: ticketCahier
    },
    {
      path: '/materialsDistribute',
      name: 'materials_distribute',
      component:resolve => require(['@/components/materials-distribute.vue'], resolve)
      //component: materialsDistribute
    },
    {
      path: '/materialsInventory',
      name: 'materials_Inventory',
      component:resolve => require(['@/components/materials-inventory.vue'], resolve)
      //component: materialsInventory
    },
    {
      path: '/materialsApproveApplying',
      name: 'materials_approve_applying',
      component:resolve => require(['@/components/materials-approve-applying.vue'], resolve)
      //component: materialsApproveApplying
    },
    {
      path: '/reports-other',
      name: 'reports_other',
      component:resolve => require(['@/components/reports-other.vue'], resolve)
      //component: materialsApproveApplying
    },
    {
      path: '/turn-in-funds',
      name: 'personal_turn_in',
      // component: turnInFunds
      component:resolve => require(['@/components/turn-in-funds.vue'], resolve)
    },
    {
      path: '/ticketChangeRefound',
      name: 'orders_tkt_change_refound',
      // component: ticketChangeRefound
      component:resolve => require(['@/components/ticket-change-refound.vue'], resolve)
      
    },
    {
      path: '/materialSearchModify',
      name: 'materials_search',
      // component: materialSearchModify
      component:resolve => require(['@/components/material-search-modify.vue'], resolve)
    },
    {
      path: '/cashier',
      name: 'finance_cashier',
      //component: cashier
      component:resolve => require(['@/components/cashier.vue'], resolve)

    },
    {
      path: '/requestPaying',
      name: 'request-paying',
      component:resolve => require(['@/components/request-paying.vue'], resolve)
      // component: requestPaying
    },
    {
      path: '/accept-other-funds',
      name: 'finance_accept_other_funds',
      component:resolve => require(['@/components/accept-other-funds.vue'], resolve)
      // component: acceptOtherFunds
    },
    {
      path: '/product',
      name: 'bscinfo_product',
      component:resolve => require(['@/components/product.vue'], resolve)
      // component: product
    },
    {
      path: '/inputByHand',
      name: 'orders_input_byhand',
      component:resolve => require(['@/components/input-by-hand.vue'], resolve)
      // component: inputByHand      
    },
    {
      path: '/importFromExcel',
      name: 'orders_import_from_excel',
      component:resolve => require(['@/components/import-from-excel.vue'], resolve)
      // component: importFromExcel      
    },
    {
      path: '/checkOrders',
      name: 'orders_check_orders',
      component:resolve => require(['@/components/check-orders.vue'], resolve)
      // component: checkOrders      
    },
    {
      path: '/requestInvoice',
      name: 'invoices_apply',
      component:resolve => require(['@/components/request-invoice.vue'], resolve)
      // component: requestInvoice    e  
    },
    {
      path: '/selecterOfFilledInvoice',
      name: 'selecter-of-filled-invoice',
      component:resolve => require(['@/components/selecter-of-filled-invoice.vue'], resolve)
      // component: selecterOfFilledInvoice       
    },
    {
      path: '/detailsInAFilledInvoice',
      name: 'invoices_details',
      component:resolve => require(['@/components/details-in-a-filled-invoice.vue'], resolve)
      // component: detailsInAFilledInvoice       
    },
    {
      path: '/modifyApplyedFilledInvoice',
      name: 'invoices_modify_fill',
      component:resolve => require(['@/components/modify-applyed-filled-invoice.vue'], resolve)
      // component: modifyApplyedFilledInvoice       
    },
    {
      path: '/refillCancelFilledInvoice',
      name: 'invoices_refill_cancel',
      component:resolve => require(['@/components/refill-cancel-filled-invoice.vue'], resolve)
      // component: refillCancelFilledInvoice       
    },
    {
      path: '/rulePrice',
      name: 'bscinfo_rule_price',
      component:resolve => require(['@/components/rule-price.vue'], resolve)
      // component: rulePrice  
    },
    {
      path: '/project',
      name: 'bscinfo_project',
      component:resolve => require(['@/components/project.vue'], resolve)
      // component: project
    },
    {
      path: '/contract',
      name: 'bscinfo_contract',
      component:resolve => require(['@/components/contract.vue'], resolve)
      // component: contract
    },
    {
      path: '/equipment',
      name: 'bscinfo_equipment',
      component:resolve => require(['@/components/equipment.vue'], resolve)
      // component: equipment
    },
    {
      path: '/employee',
      name: 'bscinfo_employee',
      component:resolve => require(['@/components/employee.vue'], resolve)
      // component: employee
    },
    {
      path: '/apply-purchsing',
      name: 'purchasing_apply',
      component:resolve => require(['@/components/apply-purchasing.vue'], resolve)
      // component: applyPurchasing
    },
    {
      path:'/approve-applying-purchasing',
      name:'purchasing_approve_applying',
      component:resolve => require(['@/components/approve-applying-purchasing.vue'], resolve)
      // component:approveApplyingPurchasing
    },
    {
      path:'/enquiry-compare-price',
      name:'purchasing_enquiry_compare',
      component:resolve => require(['@/components/enquiry-compare-price.vue'], resolve)
      // component:enquiryComparePrice  
    },
    {
      path:'/approve-enquiry',
      name:'purchasing_approve_enquiry',
      component:resolve => require(['@/components/approve-enquiry.vue'], resolve)
      // component:approveEnquiry
    },
    {
      path:'/launch-purchasing',
      name:'purchasing_launch',
      component:resolve => require(['@/components/launch-purchasing.vue'], resolve)
      // component:launchPurchasing
    },
    {
      path:'/check-receipts',
      name:'finance_check_receipts',
      component:resolve => require(['@/components/check-receipts.vue'], resolve)
      // component:checkReceipts
    },
    {
      path:'/request-funds',
      name:'rqstfunds_borrow_reimburse',
      component:resolve => require(['@/components/request-funds.vue'], resolve)
      // component:requestFunds      
    },
    {
      path:'/rqst-pcsg-funds',
      name:'rqstfunds_purchasing_funds',
      component:resolve => require(['@/components/rqst-pcsg-funds.vue'], resolve)
      // component:rqstPcsgFunds 
    },
    {
      path:'/prmry-audits-rqst-funds',
      name:'rqstfunds_primary_audits',
      component:resolve => require(['@/components/primary-audits-requesting-funds.vue'], resolve)
      // component:primaryAuditsRqstFunds 
    },
    {
      path:'/final-audits-rqst-funds',
      name:'rqstfunds_final_audits',
      component:resolve => require(['@/components/final-audits-rqsting-funds.vue'], resolve)
      // component:finalAuditsRqstingFunds 
    },
    {
      path:'/pay',
      name:'finance_pay',
      component:resolve => require(['@/components/pay.vue'], resolve)
      // component:pay 
    },
    {
      path:'/review-payment',
      name:'finance_review_payment',
      component:resolve => require(['@/components/review-payment.vue'], resolve)
      // component:reviewPayment 
    },
    {
      path:'/ticket-inbound',
      name:'orders_tkt_inbound',
      component:resolve => require(['@/components/ticket-inbound.vue'], resolve)
      // component:ticketInbound 
    },
    {
      path:'/ticket-outbound',
      name:'orders_tkt_outbound',
      component:resolve => require(['@/components/ticket-outbound.vue'], resolve)
      // component:ticketOutbound 
    },
    {
      path:'/rqst-rfdtkt-paying',
      name:'rqstfunds_rfdtkt_paying',
      component:resolve => require(['@/components/rqst-rfdtkt-paying.vue'], resolve)
      // component:rqstRfdFee 
    },
    {
      path:'/authorizations',
      name:'bscinfo_authorization',
      component:resolve => require(['@/components/authorizations.vue'], resolve)
      // component:authorizations
    },
    {
      path:'/materialsApply',
      name:'materials_apply',
      component:resolve => require(['@/components/materials-apply.vue'], resolve)
      // component:materialsApply
    },    
    {
      path:'/change-pswd',
      name:'personal_modify_info',
      component:resolve => require(['@/components/change-pswd.vue'], resolve)
      // component:changePswd
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
