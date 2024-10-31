import { defineStore } from 'pinia'
import type { CMSState, Locale } from '@/types/CMS'
import { fetchDirectus } from 'fari-directus-parser'
import { ref } from 'vue'

export const useCMS = defineStore('cms', () => {
  const loading = ref(false)
  const error = ref<unknown | null>(null)
  const data = ref<CMSState>({} as CMSState)
  const locale = ref<Locale>('en')

  async function getCMSData() {
    try {
      loading.value = true
      const ticTacToeInfo = await fetchDirectus({ slug: 'tic-tac-toe' })
      data.value = ticTacToeInfo
    } catch (err) {
      if (err) error.value = err
      console.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const setLocale = (newLocale: Locale) => (locale.value = newLocale)

  return {
    loading,
    error,
    data,
    locale,
    getCMSData,
    setLocale
  }
})
