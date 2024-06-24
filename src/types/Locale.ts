export type Locale = 'en' | 'fr-FR' | 'nl'

export interface Data {
    logo: string
    research_head: string
    research_lead: string
    explanation_short: {
      en: string
      nl: string
      'fr-FR': string
    }
  }
