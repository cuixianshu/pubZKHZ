import Vue from 'vue';
import Router from 'vue-router';
import clientDepartment from '@/components/client-department.vue';
import untreatedWorks from '@/components/untreated-works';
import receivesAndReturns from '@/components/receives-returns';
import operatedHistory from '@/components/operated-history';
import reporters from '@/components/reporters';
import checkingAndStoring from '@/components/manage-material';
import requestMaterial from '@/components/manage-material';
import distributeExwareHouse from '@/components/distribute-ex';
import takeInventory from '@/components/take-inventory';
import requestPurchasing from '@/components/purchasing-supplier';
import purchasingProgress from '@/components/purchasing-progress';
import turnInFunds from '@/components/turn-in-funds';
import payFor from '@/components/pay-receipt';
import cashier from '@/components/cashier';
import requestPaying from '@/components/request-paying';
import acceptOtherFunds from '@/components/accept-other-funds';
import product from '@/components/product';
import inputByHand from '@/components/input-by-hand';
import importFromExcel from '@/components/import-from-excel.vue';
import checkOrders from '@/components/check-orders.vue';
import requestInvoice from '@/components/request-invoice.vue';
import fillInvoice from '@/components/fill-invoice.vue';
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
Vue.use(Router);

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/clientDepartment',
      name: 'client-department',
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
      name: 'reporters',
      component: reporters
    },
    {
      path: '/checkingAndStoring',
      name: 'checking-Storing',
      component: checkingAndStoring
    },
    {
      path: '/requestMaterial',
      name: 'request-material',
      component: requestMaterial
    },
    {
      path: '/distributeExwareHouse',
      name: 'distribute-ex',
      component: distributeExwareHouse
    },
    {
      path: '/takeInventory',
      name: 'take-inventory',
      component: takeInventory
    },
    {
      path: '/requestPurchasing',
      name: 'request-purchasing',
      component: requestPurchasing
    },
    {
      path: '/purchasingProgress',
      name: 'purchasing-progress',
      component: purchasingProgress
    },
    {
      path: '/turn-in-funds',
      name: 'turn-in-funds',
      component: turnInFunds
    },
    {
      path: '/fillInvoice',
      name: 'fill-invoice',
      component: fillInvoice
    },
    {
      path: '/payFor',
      name: 'pay-for',
      component: payFor
    },
    {
      path: '/cashier',
      name: 'cashier',
      component: cashier
    },
    {
      path: '/requestPaying',
      name: 'request-paying',
      component: requestPaying
    },
    {
      path: '/accept-other-funds',
      name: 'accept-other-funds',
      component: acceptOtherFunds
    },
    {
      path: '/product',
      name: 'product',
      component: product
    },
    {
      path: '/inputByHand',
      name: 'input-by-hand',
      component: inputByHand      
    },
    {
      path: '/importFromExcel',
      name: 'import-from-excel',
      component: importFromExcel      
    },
    {
      path: '/checkOrders',
      name: 'check-orders',
      component: checkOrders      
    },
    {
      path: '/requestInvoice',
      name: 'request-invoice',
      component: requestInvoice      
    },
    {
      path: '/selecterOfFilledInvoice',
      name: 'selecter-of-filled-invoice',
      component: selecterOfFilledInvoice       
    },
    {
      path: '/detailsInAFilledInvoice',
      name: 'details-in-a-filled-invoice',
      component: detailsInAFilledInvoice       
    },
    {
      path: '/modifyApplyedFilledInvoice',
      name: 'modify-applyed-filled-invoice',
      component: modifyApplyedFilledInvoice       
    },
    {
      path: '/refillCancelFilledInvoice',
      name: 'refill-cancel-filled-invoice',
      component: refillCancelFilledInvoice       
    },
    {
      path: '/rulePrice',
      name: 'rule-price',
      component: rulePrice
    },
    {
      path: '/project',
      name: 'project',
      component: project
    },
    {
      path: '/contract',
      name: 'contract',
      component: contract
    },
    {
      path: '/equipment',
      name: 'equipment',
      component: equipment
    },
    {
      path: '/employee',
      name: 'employee',
      component: employee
    },
    {
      path: '/apply-purchsing',
      name: 'apply-purchsing',
      component: applyPurchasing
    },
    {
      path:'/approve-applying-purchasing',
      name:'approve-applying-purchasing',
      component:approveApplyingPurchasing
    },
    {
      path:'/enquiry-compare-price',
      name:'enquiry-compare-price',
      component:enquiryComparePrice
    },
    {
      path:'/approve-enquiry',
      name:'approve-enquiry',
      component:approveEnquiry
    },
    {
      path:'/launch-purchasing',
      name:'launch-purchasing',
      component:launchPurchasing
    },
    {
      path:'/check-receipts',
      name:'check-receipts',
      component:checkReceipts
    },
    {
      path:'/request-funds',
      name:'request-funds',
      component:requestFunds      
    },
    {
      path:'/rqst-pcsg-funds',
      name:'rqst-pcsg-funds',
      component:rqstPcsgFunds 
    },
    {
      path:'/prmry-audits-rqst-funds',
      name:'prmry-audits-rqst-funds',
      component:primaryAuditsRqstFunds 
    },
    {
      path:'/final-audits-rqst-funds',
      name:'final-audits-rqst-funds',
      component:finalAuditsRqstingFunds 
    },
    {
      path:'/pay',
      name:'pay',
      component:pay 
    },
    {
      path:'/review-payment',
      name:'review-payment',
      component:reviewPayment 
    },
    {
      path:'/ticket-inbound',
      name:'ticket-inbound',
      component:ticketInbound 
    },
    {
      path:'/ticket-outbound',
      name:'ticket-outbound',
      component:ticketOutbound 
    }

  ]
});
