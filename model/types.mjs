/**
 * @typedef {Object} RecordDetails
 * @property {string} id
 * @property {RecordType} type
 * @property {string} typeIcon
 * @property {string} iconUrl
 * @property {string} authorFullName
 * @property {string} authorEmail
 * @property {string} description
 * @property {PlanType} [plan]
 * @property {Date} creationDate
 * @property {CompanySize} [companySize]
 * @property {string} [companyName]
 * @property {string} companyCountry
 * @property {string} companyWebsite
 * @property {string} companyWebsite
 * @property {number} imageCount // comme dans https://mpa.nuejs.org/app/search/?id=10&sort=size&asc=true
 * @property {string[]} imageUrls // comme dans https://mpa.nuejs.org/app/search/?query=dark&id=198&sort=cc
 * @property {Message[]} discussion
 */

/**
 * @typedef {Object} Message
 * @property {Date} creationDate
 * @property {string} content
 * @property {boolean} isReply
 */

/**
 * @typedef {Object} RecordJSON
 * @property {'demo_request' | 'problem' | 'question' | 'feedback'} type
 * @property {number} ts
 * @property {RecordDataJSON} data
 */

/**
 * @typedef {Object} RecordDataJSON
 * @property {number} id
 * @property {string} message
 * @property {string} cc
 * @property {string} name
 * @property {string} org
 * @property {string} email
 * @property {string} website
 * @property {'s' | 'm' | 'l' | 'xl'} size
 * @property {'free' | 'pro' | 'enterprise'} plan
 * @property {string[]} [shots]
 */

/**
 * @typedef {'ALL' | 'DEMO_REQUEST' | 'QUESTION' | 'PROBLEM' | 'FEEDBACK'} RecordType
 */

/**
 * @typedef {'PLAN_ENTERPRISE'| 'PLAN_PRO'| 'PLAN_FREE'} PlanType
 */

/**
 * @typedef {'COMPANY_VERY_LARGE'| 'COMPANY_LARGE'| 'COMPANY_MEDIUM' | 'COMPANY_SMALL'} CompanySize
 */

/**
 * @typedef {RecordType | PlanType | CompanySize} RecordCategory
 */

/**
 * @typedef {'CREATION DATE'| 'COMPANY COUNTRY'| 'COMPANY SIZE' | 'PLAN'} RecordSortAttribute
 */

/**
 * @typedef {'ASC'| 'DESC'} SortOrder
 */

/**
 * @typedef {'LIST'| 'GRID'} DisplayLayout
 */

/**
 * @typedef {Object} Pagination
 * @property {number} pageIndex
 * @property {number} pageSize
 */
