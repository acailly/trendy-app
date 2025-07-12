/** @typedef {import("../model/types.mjs").RecordType} RecordType */
/** @typedef {import("../model/types.mjs").PlanType} PlanType */
/** @typedef {import("../model/types.mjs").CompanySize} CompanySize */
/** @typedef {import("../model/types.mjs").RecordSortAttribute} RecordSortAttribute */

/**
 * @typedef {Object} RecordTypeView
 * @property {string} title
 * @property {Record<string, RecordType | null>} searchParams
 * @property {string} icon
 */

/**
 * @typedef {Object} PlanView
 * @property {string} label
 * @property {Record<string, PlanType | null>} searchParams
 * @property {string} cssClass
 */

/**
 * @typedef {object} CompanySizeView
 * @property {string} label
 * @property {Record<string, CompanySize | null>} searchParams
 * @property {string} cssClass
 * @property {string} description
 */

/**
 * @typedef {Object} SortButton
 * @property {string} label
 */

export const SEARCH_PARAM_RECORD_CATEGORY = 'record-category'
export const SEARCH_PARAM_PAGE_INDEX = 'page-index'
export const SEARCH_PARAM_PAGE_SIZE = 'page-size'
export const SEARCH_PARAM_SEARCH = 'search'
export const SEARCH_PARAM_RECORD_DETAILS_ID = 'record-details-id'
export const SEARCH_PARAM_RECORD_DETAILS_IMAGE_INDEX = 'record-details-image-index'

export const STORAGE_KEY_SORT_ORDER = 'sort-order'
export const STORAGE_KEY_RECORD_SORT_ATTRIBUTE = 'sort-attribute'
export const STORAGE_KEY_RECORDS_DISPLAY_LAYOUT = 'records-display-layout'

export default class UIConfig {
  /** @type {Record<RecordType, RecordTypeView>} */
  static VIEWS_BY_RECORD_TYPE = {
    ALL: {
      title: 'All contacts',
      icon: 'users',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'ALL',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
    },
    DEMO_REQUEST: {
      title: 'Demo requests',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'DEMO_REQUEST',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
      icon: 'demo-request',
    },
    QUESTION: {
      title: 'Questions',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'QUESTION',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
      icon: 'question',
    },
    PROBLEM: {
      title: 'Problems',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'PROBLEM',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
      icon: 'problem',
    },
    FEEDBACK: {
      title: 'Feedback',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'FEEDBACK',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
      icon: 'feedback',
    },
  }

  /** @type {Record<PlanType, PlanView>} */
  static VIEWS_BY_PLAN = {
    PLAN_ENTERPRISE: {
      label: 'Enterprise',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'PLAN_ENTERPRISE',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
      cssClass: 'plan-color plan-enterprise',
    },
    PLAN_PRO: {
      label: 'Pro',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'PLAN_PRO',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
      cssClass: 'plan-color plan-pro',
    },
    PLAN_FREE: {
      label: 'Free',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'PLAN_FREE',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
      cssClass: 'plan-color plan-free',
    },
  }

  /** @type {Record<CompanySize, CompanySizeView>} */
  static VIEWS_BY_COMPANY_SIZE = {
    COMPANY_VERY_LARGE: {
      label: 'Very large',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'COMPANY_VERY_LARGE',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
      cssClass: 'size-color size-xl',
      description: '100+',
    },
    COMPANY_LARGE: {
      label: 'Large',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'COMPANY_LARGE',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
      cssClass: 'size-color size-l',
      description: '50 - 100',
    },
    COMPANY_MEDIUM: {
      label: 'Medium',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'COMPANY_MEDIUM',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
      cssClass: 'size-color size-m',
      description: '10 - 50',
    },
    COMPANY_SMALL: {
      label: 'Small',
      searchParams: {
        [SEARCH_PARAM_RECORD_CATEGORY]: 'COMPANY_SMALL',
        [SEARCH_PARAM_PAGE_INDEX]: null,
        [SEARCH_PARAM_PAGE_SIZE]: null,
      },
      cssClass: 'size-color size-s',
      description: '0 - 10',
    },
  }

  /** @type {Record<RecordSortAttribute, SortButton>} */
  static SORT_BUTTON_BY_SORT_ATTRIBUTE = {
    'CREATION DATE': { label: 'Created' },
    'COMPANY COUNTRY': { label: 'Country' },
    'COMPANY SIZE': { label: 'Company size' },
    PLAN: { label: 'Plan' },
  }
}
