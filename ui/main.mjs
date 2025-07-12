import Application from '../model/application.mjs'
import './shared/component-loader/component-loader.mjs'
import './shared/svg-import-as-symbol/svg-import-as-symbol.mjs'
import { synchronizeSearchParamsWithExternal } from './shared/search-params/search-params.mjs'
import {
  SEARCH_PARAM_PAGE_INDEX,
  SEARCH_PARAM_PAGE_SIZE,
  SEARCH_PARAM_RECORD_CATEGORY,
  SEARCH_PARAM_RECORD_DETAILS_ID,
  SEARCH_PARAM_RECORD_DETAILS_IMAGE_INDEX,
  SEARCH_PARAM_SEARCH,
  STORAGE_KEY_RECORD_SORT_ATTRIBUTE,
  STORAGE_KEY_RECORDS_DISPLAY_LAYOUT,
  STORAGE_KEY_SORT_ORDER,
} from './ui-config.mjs'

import { addNavigationStartEventListener } from './shared/navigation-start-listener/navigation-start-listener.mjs'
import { synchronizeLocalStorageWithExternal } from './shared/web-storage/web-storage.mjs'

/** @typedef {import('../model/types.mjs').RecordCategory} RecordCategory */
/** @typedef {import('../model/types.mjs').DisplayLayout} DisplayLayout */
/** @typedef {import('../model/types.mjs').RecordSortAttribute} RecordSortAttribute */
/** @typedef {import('../model/types.mjs').SortOrder} SortOrder */

// Initialize application
const application = new Application()
export const getApplication = () => application
application.loadRecords().then(() => {
  syncURLSearchParamsWithApplication()
})

// TODO ACY
// déplacer cette synchronisation URL search params <=> applications dans un fichier dédié

// Don't do the real navigation when new URL is the same than the previous, ignoring hash and search params
addNavigationStartEventListener((url, replace) => {
  const previousUrl = new URL(window.location.href)
  previousUrl.hash = ''
  previousUrl.search = ''

  const nextUrl = new URL(url)
  nextUrl.hash = ''
  nextUrl.search = ''

  if (previousUrl.href === nextUrl.href) {
    if (replace) {
      window.history.replaceState({}, url, url)
    } else {
      window.history.pushState({}, url, url)
    }

    return false
  }

  return true
})

// TODO ACY compter le nombre de fois qu'on fait un _invalidateVisibleRecords à l'initialisation mais ca doit être beaucoup
// essayer de le réduire
// (compté 4 fois sur http://localhost:3000/ui/records/?record-category=ALL&records-display-layout=LIST&sort-attribute=CREATION+DATE&sort-order=DESC&page-index=0&page-size=12&record-details-id=201)

const syncURLSearchParamsWithApplication = () => {
  // Sync record category
  synchronizeSearchParamsWithExternal(
    SEARCH_PARAM_RECORD_CATEGORY,
    () => application.$recordCategory.get(),
    (valueFromSearchParams) => {
      if (valueFromSearchParams) {
        application.selectRecordCategory(/** @type {RecordCategory} */ (valueFromSearchParams))
      }
    },
    (updateSearchParam) => {
      application.$recordCategory.onChange(({ currentValue }) => {
        updateSearchParam(currentValue)
      })
    }
  )

  // Sync page index
  synchronizeSearchParamsWithExternal(
    SEARCH_PARAM_PAGE_INDEX,
    () => String(application.$pagination.get().pageIndex),
    (valueFromSearchParams) => {
      if (valueFromSearchParams) {
        application.updatePagination({
          pageIndex: Number(valueFromSearchParams),
          pageSize: application.$pagination.get().pageSize,
        })
      }
    },
    (updateSearchParam) => {
      application.$pagination.onChange(({ currentValue }) => {
        updateSearchParam(String(currentValue.pageIndex))
      })
    }
  )

  // Sync page size
  synchronizeSearchParamsWithExternal(
    SEARCH_PARAM_PAGE_SIZE,
    () => String(application.$pagination.get().pageSize),
    (valueFromSearchParams) => {
      if (valueFromSearchParams) {
        application.updatePagination({
          pageIndex: application.$pagination.get().pageIndex,
          pageSize: Number(valueFromSearchParams),
        })
      }
    },
    (updateSearchParam) => {
      application.$pagination.onChange(({ currentValue }) => {
        updateSearchParam(String(currentValue.pageSize))
      })
    }
  )

  // Sync search
  synchronizeSearchParamsWithExternal(
    SEARCH_PARAM_SEARCH,
    () => application.$currentSearch.get(),
    (valueFromSearchParams) => {
      application.searchInRecords(valueFromSearchParams ?? '')
    },
    (updateSearchParam) => {
      application.$currentSearch.onChange(({ currentValue }) => {
        updateSearchParam(String(currentValue))
      })
    }
  )

  // Sync visible record details
  synchronizeSearchParamsWithExternal(
    SEARCH_PARAM_RECORD_DETAILS_ID,
    () => application.$visibleRecordDetails.get()?.id ?? null,
    (valueFromSearchParams) => {
      if (valueFromSearchParams) {
        application.openRecordDetails(valueFromSearchParams)
      } else {
        application.closeRecordDetails()
      }
    },
    (updateSearchParam) => {
      application.$visibleRecordDetails.onChange(({ currentValue }) => {
        updateSearchParam(currentValue?.id ?? null)
      })
    }
  )

  // Sync visible record details image
  synchronizeSearchParamsWithExternal(
    SEARCH_PARAM_RECORD_DETAILS_IMAGE_INDEX,
    () => application.$visibleRecordDetailsImage.get()?.toString() ?? null,
    (valueFromSearchParams) => {
      if (valueFromSearchParams) {
        application.openRecordDetailsImage(Number(valueFromSearchParams))
      } else {
        application.closeRecordDetailsImages()
      }
    },
    (updateSearchParam) => {
      application.$visibleRecordDetailsImage.onChange(({ currentValue }) => {
        updateSearchParam(currentValue?.toString() ?? null)
      })
    }
  )

  // Sync sort order
  synchronizeLocalStorageWithExternal(
    STORAGE_KEY_SORT_ORDER,
    () => application.$sortOrder.get(),
    (valueFromSearchParams) => {
      if (valueFromSearchParams) {
        application.sortRecords(
          application.$sortedRecordAttribute.get(),
          /** @type {SortOrder} */ (valueFromSearchParams)
        )
      }
    },
    (updateSearchParam) => {
      application.$sortOrder.onChange(({ currentValue }) => {
        updateSearchParam(currentValue)
      })
    }
  )

  // Sync sort attribute
  synchronizeLocalStorageWithExternal(
    STORAGE_KEY_RECORD_SORT_ATTRIBUTE,
    () => application.$sortedRecordAttribute.get(),
    (valueFromSearchParams) => {
      if (valueFromSearchParams) {
        application.sortRecords(
          /** @type {RecordSortAttribute} */ (valueFromSearchParams),
          application.$sortOrder.get()
        )
      }
    },
    (updateSearchParam) => {
      application.$sortedRecordAttribute.onChange(({ currentValue }) => {
        updateSearchParam(currentValue)
      })
    }
  )

  // Sync record display layout
  synchronizeLocalStorageWithExternal(
    STORAGE_KEY_RECORDS_DISPLAY_LAYOUT,
    () => application.$recordsDisplayLayout.get(),
    (valueFromSearchParams) => {
      if (valueFromSearchParams) {
        application.changeRecordsDisplayLayout(/** @type {DisplayLayout} */ (valueFromSearchParams))
      }
    },
    (updateSearchParam) => {
      application.$recordsDisplayLayout.onChange(({ currentValue }) => {
        updateSearchParam(currentValue)
      })
    }
  )
}
