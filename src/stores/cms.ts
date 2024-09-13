import { defineStore } from 'pinia'
import type { CMSState, Locale } from '@/types/CMS'

export const useCMS = defineStore('cms', {
  state: () =>
    ({
      loading: false,
      error: null,
        locale: 'en',
        data: {
          logo: '',
          research_head: '',
          research_lead: '',
          explanation_short: {
            en: '',
            'fr-FR': '',
            nl: ''
          }
        },
    }) as CMSState,
  actions: {
    async getCMSData() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('http://localhost:3000/api/data')
        const parsed = await response.json()

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        parsed.forEach((e: { [k: string]: string }) => {
          const { research_head, research_lead, logo, locale, explanation_short } = e

          if (logo) this.data.logo = logo
          if (research_head) this.data.research_head = research_head
          if (research_lead) this.data.research_lead = research_lead
          if (locale) this.data.explanation_short[locale as Locale] = explanation_short
        })
      } catch (error) {
        this.error = 'Error fetching data'
      } finally {
        this.loading = false
      }
    },
    setLocale(locale: Locale): any {
      this.locale = locale
    },
  }
})
