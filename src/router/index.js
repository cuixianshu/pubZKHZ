import Vue from 'vue/dist/vue.common.js';
import Router from 'vue-router';
import store from '@/store/store.js';
import operatedHistory from '@/components/operated-history';
import login from '@/components/login.vue';
import home from '@/components/home.vue';
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
      path: '/append-invoice',
      name: 'finance_append_invoice',
      component:resolve => require(['@/components/append-invoice.vue'], resolve)
      //component: ticketCahier
    },
    {
      path: '/personal-needtoreturn',
      name: 'personal_needtoreturn',
      component:resolve => require(['@/components/personal-needtoreturn.vue'], resolve)
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
      name: 'cnfrc_project',
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
    },
    {
      path:'/authorizations',
      name:'bscinfo_authorization',
      component:resolve => require(['@/components/authorizations.vue'], resolve)
    },
    {
      path:'/materialsApply',
      name:'materials_apply',
      component:resolve => require(['@/components/materials-apply.vue'], resolve)
    },    
    {
      path:'/change-pswd',
      name:'personal_modify_info',
      component:resolve => require(['@/components/change-pswd.vue'], resolve)
    },
    {
      path:'/cnfrc-attendees',
      name:'cnfrc_attendees',
      component:resolve => require(['@/components/attendees.vue'], resolve)
    },
    {
      path:'/cnfrc-communicate',
      name:'cnfrc_communicate',
      component:resolve => require(['@/components/communicate.vue'], resolve)
    },
    {
      path:'/vips',
      name:'dmstc_vips',
      component:resolve => require(['@/components/vips.vue'], resolve)
    },
    {
      path:'/vip-trips',
      name:'dmstc_vip_trips',
      component:resolve => require(['@/components/vip-trips.vue'], resolve)
    },
    {
      path:'/vip-in-project',
      name:'dmstc_vip_in_project',
      component:resolve => require(['@/components/vip-in-project.vue'], resolve)
    },
    {
      path:'/browse-trips',
      name:'dmstc_browse_vip_trips',
      component:resolve => require(['@/components/vip-browse-trips.vue'], resolve)
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
