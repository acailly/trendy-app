import MutableListenableData from './listenableData.util.mjs'

// This is the logic of the app
// It is UI-independant
// Original app is here:
// - demo: https://mpa.nuejs.org/app/
// - source: https://github.com/nuejs/nue/tree/master/packages/examples/simple-mpa

// TODO ACY ICI : mettre ca dans un repo à part

/**
 * @template T
 * @typedef {import('./listenableData.util.mjs').ListenableData<T>} ListenableData<T>
 */

/** @typedef {import('./types.mjs').RecordDetails} RecordDetails */
/** @typedef {import('./types.mjs').RecordType} RecordType */
/** @typedef {import('./types.mjs').PlanType} PlanType */
/** @typedef {import('./types.mjs').CompanySize} CompanySize */
/** @typedef {import('./types.mjs').RecordCategory} RecordCategory */
/** @typedef {import('./types.mjs').RecordSortAttribute} RecordSortAttribute */
/** @typedef {import('./types.mjs').SortOrder} SortOrder */
/** @typedef {import('./types.mjs').DisplayLayout} DisplayLayout */
/** @typedef {import('./types.mjs').Pagination} Pagination */
/** @typedef {import('./types.mjs').RecordJSON} RecordJSON */
/** @typedef {import('./types.mjs').RecordDataJSON} RecordDataJSON */

// TODO ACY découper cette grosse classe en sous classe de domaine métier ?
// - selection
// - tri
// - login
// - ...

export default class Application {
  // LOGIN / LOGOUT

  _loggedIn = new MutableListenableData(/** @type {boolean} */ (true))
  $loggedIn = this._loggedIn.asReadonly()

  _myAvatarUrl = new MutableListenableData(/** @type {string} */ (''))
  $myAvatarUrl = this._myAvatarUrl.asReadonly()

  _myFullName = new MutableListenableData(/** @type {string} */ (''))
  $myFullName = this._myFullName.asReadonly()

  /**
   * @param {string} email
   * @param {string} password
   */
  login = (email, password) => {
    if (email === 'demo.user@example.com' && password === 'password') {
      // TODO ACY transformer en absolu avec baseUrl mais sans avoir à importer baseUrl côté application
      this._myAvatarUrl.set('../assets/img/female1.jpg')
      this._myFullName.set('Nancy Sanders')
      this._loggedIn.set(true)
    }
  }

  logout = () => {
    this._myAvatarUrl.set('')
    this._myFullName.set('')
    this._loggedIn.set(false)
  }

  // LOADING RECORDS

  _allRecords = new MutableListenableData(/** @type {RecordDetails[]} */ ([]))
  $allRecords = this._allRecords.asReadonly()

  /**
   * @returns {Promise<void>}
   */
  loadRecords = async () => {
    // TODO ACY externaliser dans un loader externe
    return await Promise.all([
      fetch('../../data/chunk-0.json').then((response) => response.json()),
      fetch('../../data/chunk-1.json').then((response) => response.json()),
    ])
      .then((promiseResultArray) =>
        promiseResultArray.flat().map((recordJSON, _, all) => this._createRecordFromJSON(recordJSON, all.length))
      )
      .then((records) => {
        this._allRecords.set(records)
        this._invalidateVisibleRecords()
      })
  }

  /** @type {Record<RecordJSON['type'], RecordDetails['type']>} */
  static JSON_TYPE_TO_RECORD_TYPE = {
    demo_request: 'DEMO_REQUEST',
    feedback: 'FEEDBACK',
    problem: 'PROBLEM',
    question: 'QUESTION',
  }

  /** @type {Record<RecordDetails['type'], string>} */
  static RECORD_TYPE_TO_RECORD_TYPE_ICON = {
    ALL: '',
    DEMO_REQUEST: 'demo-request',
    FEEDBACK: 'feedback',
    PROBLEM: 'problem',
    QUESTION: 'question',
  }

  /** @type {Record<RecordDataJSON['size'], RecordDetails['companySize']>} */
  static JSON_SIZE_TO_COMPANY_SIZE = {
    s: 'COMPANY_SMALL',
    m: 'COMPANY_MEDIUM',
    l: 'COMPANY_LARGE',
    xl: 'COMPANY_VERY_LARGE',
  }

  /** @type {Record<RecordDataJSON['plan'], RecordDetails['plan']>} */
  static JSON_PLAN_TO_PLAN_TYPE = {
    free: 'PLAN_FREE',
    pro: 'PLAN_PRO',
    enterprise: 'PLAN_ENTERPRISE',
  }

  /** @type {Record<RecordDataJSON['cc'], RecordDetails['companyCountry']>} */
  static JSON_CC_TO_COMPANY_COUNTRY = {
    cn: 'China',
    de: 'Germany',
    fr: 'France',
    jp: 'Japan',
    uk: 'UK',
    us: 'USA',
  }

  /**
   * @param {RecordJSON} recordJSON
   * @param {number} total
   * @returns {RecordDetails}
   */
  _createRecordFromJSON = (recordJSON, total) => {
    // TODO ACY externaliser dans un loader externe
    const creationDate = this._fakeDate(recordJSON.ts, total)
    const discussion = this._fakeDiscussion(creationDate, recordJSON.data.message)
    const type = Application.JSON_TYPE_TO_RECORD_TYPE[recordJSON.type]
    return {
      id: String(recordJSON.data.id),
      type,
      typeIcon: Application.RECORD_TYPE_TO_RECORD_TYPE_ICON[type],
      authorFullName: recordJSON.data.name,
      authorEmail: recordJSON.data.email,
      companyName: recordJSON.data.org,
      companyCountry: Application.JSON_CC_TO_COMPANY_COUNTRY[recordJSON.data.cc],
      companySize: Application.JSON_SIZE_TO_COMPANY_SIZE[recordJSON.data.size],
      companyWebsite: recordJSON.data.website,
      creationDate,
      description: recordJSON.data.message,
      plan: Application.JSON_PLAN_TO_PLAN_TYPE[recordJSON.data.plan],
      imageCount: recordJSON.data.shots?.length ?? 0,
      imageUrls: (recordJSON.data.shots ?? []).map((fileName) => `../assets/img/${fileName}`), // TODO ACY utiliser une URL absolue à l'aide de baseUrl
      iconUrl: `../assets/icons/cc/${recordJSON.data.cc}.svg`, // TODO ACY utiliser une URL absolue à l'aide de baseUrl
      discussion,
    }
  }

  /**
   * @param {number} index
   * @param {number} total
   * @returns {Date}
   */
  _fakeDate = (index, total) => {
    const now = Date.now()
    const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000
    const progress = Math.log(index) / Math.log(total)
    const baseTime = twoYearsAgo + (now - twoYearsAgo) * progress
    const jitter = (Math.random() - 0.5) * 12 * 60 * 60 * 1000 // ±12 hours
    return new Date(baseTime + jitter)
  }

  /* Random placeholder discussion */
  static THREADS = [
    ['Can you provide me your system information? Thanks.', 'Sure thing, gimme a second', '👍'],
    [
      'Can you tell me what you were doing when it happened?',
      'I was on the customer view, clicked on the notitication icon, and selected "never". The system did not respond. I\'m on latest Chrome',
      'We found the issue and pushed a fix to production. Please reload the app.',
      'Thank you! Works now 🎉🎉',
    ],
    [
      'Which browser are you using? Chrome, Firefox, Safari? Are you on Windows, Mac, or Linux?',
      'Alright, here’s the full rundown — OS: Windows 11, 64-bit, Version 22H2, CPU: Intel i7-12700, RAM: 16GB, Storage: 512GB SSD, GPU: NVIDIA RTX 3060, Browser: Chrome 123.0.6312.86. Let me know what’s next!',
      'Thanks. Checking this out. Will be back later today',
      '🫡',
    ],
  ]

  static threadIndex = 0

  /**
   * @param {Date} creationDate
   * @param {string} content
   * @returns {RecordDetails['discussion']}
   */
  _fakeDiscussion = (creationDate, content) => {
    if (Application.threadIndex == Application.THREADS.length) {
      Application.threadIndex = 0
    }

    /** @type {RecordDetails['discussion']} */
    const thread = [{ creationDate, content, isReply: false }]

    Application.THREADS[Application.threadIndex++].forEach(function (content, i) {
      thread.push({ creationDate: new Date(), content, isReply: i % 2 == 0 })
    })

    return thread
  }

  // FILTERING RECORDS

  _recordCategory = new MutableListenableData(/** @type {RecordCategory} */ ('ALL'))
  $recordCategory = this._recordCategory.asReadonly()

  /**
   * @param {RecordCategory} selectedRecordCategory
   */
  selectRecordCategory = (selectedRecordCategory) => {
    this._recordCategory.set(selectedRecordCategory)
    this.closeRecordDetails()
    if (selectedRecordCategory !== 'ALL') {
      this._currentSearch.set('')
    }

    this._invalidateVisibleRecords()
  }

  // SEARCHING RECORDS

  _currentSearch = new MutableListenableData(/** @type {string} */ (''))
  $currentSearch = this._currentSearch.asReadonly()

  /**
   * @param {string} textToSearch
   */
  searchInRecords = (textToSearch) => {
    this._currentSearch.set(textToSearch)
    if (textToSearch) {
      this._recordCategory.set('ALL')
    }

    this._invalidateVisibleRecords()
  }

  // SORTING RECORDS

  _sortOrder = new MutableListenableData(/** @type {SortOrder} */ ('DESC'))
  $sortOrder = this._sortOrder.asReadonly()

  // TODO ACY trouver un moyen de vérifier le satisfies sans pour autant casser le type de MutableListenableData
  _sortedRecordAttribute = new MutableListenableData(/** @type {RecordSortAttribute} */ ('CREATION DATE'))
  $sortedRecordAttribute = this._sortedRecordAttribute.asReadonly()

  /**
   * @param {RecordSortAttribute} sortAttribute
   * @param {SortOrder} sortOrder
   */
  sortRecords = (sortAttribute, sortOrder) => {
    this._sortedRecordAttribute.set(sortAttribute)
    this._sortOrder.set(sortOrder)

    this._invalidateVisibleRecords()
  }

  /** @type {PlanType[]} */
  static PLAN_SORT_ORDER = ['PLAN_FREE', 'PLAN_PRO', 'PLAN_ENTERPRISE']

  /** @type {CompanySize[]} */
  static COMPANY_SIZE_SORT_ORDER = ['COMPANY_SMALL', 'COMPANY_MEDIUM', 'COMPANY_LARGE', 'COMPANY_VERY_LARGE']

  // CHANGING RECORDS DISPLAY LAYOUT

  _recordsDisplayLayout = new MutableListenableData(/** @type {DisplayLayout} */ ('LIST'))
  $recordsDisplayLayout = this._recordsDisplayLayout.asReadonly()

  /**
   * @param {DisplayLayout} newLayout
   */
  changeRecordsDisplayLayout = (newLayout) => {
    this._recordsDisplayLayout.set(newLayout)
    // TODO ACY pour ce cas il n'y a pas grand intérêt à ne pas directement exposer le mutable data
  }

  // PAGINATIONG VISIBLE RECORDS

  /**
   * @type {Pagination}
   */
  static DEFAULT_PAGINATION = {
    pageIndex: 0,
    pageSize: 12,
  }

  _pagination = new MutableListenableData(/** @type {Pagination} */ (Application.DEFAULT_PAGINATION))
  $pagination = this._pagination.asReadonly()

  /**
   * @param {Pagination} newPagination
   */
  updatePagination = (newPagination) => {
    this._pagination.set(newPagination)
    // TODO ACY pour ce cas il n'y a pas grand intérêt à ne pas directement exposer le mutable data
  }

  isNextPageAvailable = () => {
    const totalCount = this.$visibleRecordCount.get()
    const currentPagination = this.$pagination.get()
    return currentPagination.pageIndex * currentPagination.pageSize < totalCount
  }

  nextPage = () => {
    if (!this.isNextPageAvailable()) {
      throw new Error('nextPage action in not available')
    }

    const currentPagination = this.$pagination.get()
    this._pagination.set({
      pageIndex: currentPagination.pageIndex + 1,
      pageSize: currentPagination.pageSize,
    })

    this._invalidateVisibleRecords()
  }

  isPreviousPageAvailable = () => {
    const currentPagination = this.$pagination.get()
    return currentPagination.pageIndex > 0
  }

  previousPage = () => {
    if (!this.isPreviousPageAvailable()) {
      throw new Error('previousPage action in not available')
    }

    const currentPagination = this.$pagination.get()
    this._pagination.set({
      pageIndex: currentPagination.pageIndex - 1,
      pageSize: currentPagination.pageSize,
    })

    this._invalidateVisibleRecords()
  }

  // VIEWING RECORDS

  _visibleRecords = new MutableListenableData(/** @type {RecordDetails[]} */ ([]))
  $visibleRecords = this._visibleRecords.asReadonly()

  _visibleRecordCount = new MutableListenableData(/** @type {number} */ (0))
  $visibleRecordCount = this._visibleRecordCount.asReadonly()

  /**
   *
   * @param {string} recordId
   * @returns {RecordDetails | undefined}
   */
  getRecordDetailsFromId = (recordId) => {
    return this.$visibleRecords.get().find((record) => record.id === recordId)
  }

  _invalidateVisibleRecords = () => {
    let matchedRecords = this.$allRecords.get()

    // TODO ACY sortir toute cette logique dans un fichier à part ? search-engine.mjs::query(records, sort, search, category, pagination) ?

    // Sort
    const sortBy = this.$sortedRecordAttribute.get()
    const sortOrder = this.$sortOrder.get()
    matchedRecords = this._sortRecords(matchedRecords, sortBy, sortOrder)

    // Filter on search
    const searchQuery = this.$currentSearch.get()
    if (searchQuery) {
      matchedRecords = this._filterBySearchQuery(matchedRecords, searchQuery)
    } else {
      // Filter on category
      const recordCategory = this.$recordCategory.get()
      if (recordCategory && recordCategory !== 'ALL') {
        matchedRecords = this._filterByRecordCategory(matchedRecords, recordCategory)
      }
    }

    // Get total count before pagination
    const totalCount = matchedRecords.length

    // Paginate
    const pagination = this.$pagination.get()
    matchedRecords = this._paginate(matchedRecords, pagination)

    this._visibleRecords.set(matchedRecords)
    this._visibleRecordCount.set(totalCount)
  }

  /**
   * @param {RecordDetails[]} records
   * @param {Pagination} pagination
   * @returns {RecordDetails[]}
   */
  _paginate = (records, pagination) => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = (pagination.pageIndex + 1) * pagination.pageSize
    return records.slice(start, end)
  }

  /**
   * @param {RecordDetails[]} records
   * @param {RecordCategory} recordCategory
   * @returns {RecordDetails[]}
   */
  _filterByRecordCategory = (records, recordCategory) => {
    return records.filter(
      (record) =>
        record.type === recordCategory || record.plan === recordCategory || record.companySize === recordCategory
    )
  }

  /**
   * @param {RecordDetails[]} records
   * @param {string} query
   * @returns {RecordDetails[]}
   */
  _filterBySearchQuery = (records, query) => {
    const q = query.toLowerCase()

    const matchedRecords = records.filter((event) => {
      const description = (event.description ?? '').toLowerCase()
      const name = (event.authorFullName ?? '').toLowerCase()
      const email = (event.authorEmail ?? '').toLowerCase()
      return (description && description.includes(q)) || (name && name.includes(q)) || (email && email.includes(q))
    })

    return matchedRecords
  }

  /**
   * @param {RecordDetails[]} records
   * @param {RecordSortAttribute} sortBy
   * @param {SortOrder} sortOrder
   * @returns {RecordDetails[]}
   */
  _sortRecords = (records, sortBy, sortOrder) => {
    const field = sortBy ?? 'CREATION DATE'

    return [...records].sort((a, b) => {
      let compare = 0
      if (field === 'CREATION DATE') {
        compare = a.creationDate.getTime() - b.creationDate.getTime()
      } else if (field == 'COMPANY COUNTRY') {
        compare = a.companyCountry.localeCompare(b.companyCountry)
      } else if (field == 'COMPANY SIZE') {
        compare =
          Application.COMPANY_SIZE_SORT_ORDER.indexOf(a.companySize ?? 'COMPANY_SMALL') -
          Application.COMPANY_SIZE_SORT_ORDER.indexOf(b.companySize || 'COMPANY_SMALL')
      } else if (field == 'PLAN') {
        compare =
          (a.plan ? Application.PLAN_SORT_ORDER.indexOf(a.plan) : -1) -
          (b.plan ? Application.PLAN_SORT_ORDER.indexOf(b.plan) : -1)
      }

      return sortOrder === 'ASC' ? compare : -compare
    })
  }

  // SELECTING RECORD / VIEWING RECORD DETAILS

  _visibleRecordDetails = new MutableListenableData(/** @type {RecordDetails | undefined} */ (undefined))
  $visibleRecordDetails = this._visibleRecordDetails.asReadonly()

  _visibleRecordDetailsImage = new MutableListenableData(/** @type {number | undefined} */ (undefined))
  $visibleRecordDetailsImage = this._visibleRecordDetailsImage.asReadonly()

  /**
   * @param {RecordDetails['id']} id
   */
  openRecordDetails = (id) => {
    const recordDetails = this.getRecordDetailsFromId(id)
    this._visibleRecordDetails.set(recordDetails)
  }

  closeRecordDetails = () => {
    this._visibleRecordDetails.set(undefined)
  }

  /**
   * @param {number} imageIndex
   */
  openRecordDetailsImage = (imageIndex) => {
    this._visibleRecordDetailsImage.set(imageIndex)
  }

  closeRecordDetailsImages = () => {
    this._visibleRecordDetailsImage.set(undefined)
  }

  /**
   * @param {RecordDetails['id']} id
   * @param {string} newMessage
   */
  answerRecordConversation = (id, newMessage) => {
    const recordDetails = this.getRecordDetailsFromId(id)
    if (recordDetails) {
      recordDetails.discussion.push({ creationDate: new Date(), content: newMessage, isReply: true })
      this._visibleRecordDetails.set(recordDetails)
    }
  }

  // VIEWING NAVIGATION PANEL

  _isNavigationPanelOpen = new MutableListenableData(/** @type {boolean} */ (false))
  $isNavigationPanelOpen = this._isNavigationPanelOpen.asReadonly()

  /**
   * @param {boolean} openState
   */
  toggleNavigationPanel = (openState) => {
    this._isNavigationPanelOpen.set(openState)
  }
}
