export type Locale = 'en' | 'fr-FR' | 'nl'

export interface CMSState {
  loading: boolean
  error: any
  locale: Locale
  data: {
    logo?: string
    research_head: string
    research_lead: string
    title: {
      [locale in Locale]: string
    }
    topic: {
      [locale in Locale]: string
    }
    description: {
      [locale in Locale]: string
    }
  }
}
