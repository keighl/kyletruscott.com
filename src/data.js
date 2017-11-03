import moment from 'moment'

export default {
  id: 'keighl',
  name: {
    first_name: 'Kyle',
    last_name: 'Truscott'
  },
  desc: 'Polyglot software engineer and UX designer',
  location: 'CT, USA',
  available_for_hire: true,
  github: 'https://github.com/keighl',
  competency: [
    'ux-design',
    'vuejs',
    'golang',
    'ruby',
    'ios',
    'dev-ops',
    '...and more!'
  ],
  career: [
    {
      name: 'Crate Space',
      role: 'CTO',
      url: 'https://cratespace.com',
      range: [
        moment('20161001', 'YYYYMMDD').toDate(),
        moment().toDate()
      ],
      location: 'NYC',
      desc: 'Build your own bundle of household essentials for one low price.',
      technology: [
        'vuejs',
        'graphql',
        'ruby',
        'nodejs'
      ]
    },
    {
      name: 'Sea/Salt Ventures',
      role: 'Partner',
      url: 'https://seasalt.io',
      range: [
        moment('20130301', 'YYYYMMDD').toDate(),
        moment().toDate()
      ],
      location: 'NYC',
      desc: 'The technology team that can do anything. We help strong operators get new companies off the ground.',
      technology: [
        'ux-design',
        'golang',
        'vuejs',
        'ios',
        'ruby',
        'ember',
        'dev-ops'
      ],
      industries: [
        'health care',
        'finance',
        'e-commerce',
        'social media',
        'travel'
      ]
    },
    {
      name: 'Freeassociation',
      role: 'Technology Director',
      url: 'http://freeassociation.is',
      range: [
        moment('20100501', 'YYYYMMDD').toDate(),
        moment('20131201', 'YYYYMMDD').toDate()
      ],
      location: 'Brooklyn',
      desc: 'A+ design and development studio',
      technology: [
        'ux-design',
        'ios',
        'ruby',
        'dev-ops'
      ],
      industries: [
        'advertising',
        'non-profit',
        'events'
      ]
    }
  ],
  education: [
    {
      name: 'Ithaca College',
      range: [
        moment('20050801', 'YYYYMMDD').toDate(),
        moment('20090501', 'YYYYMMDD').toDate()
      ],
      degree: {
        type: 'bachelors',
        focus: 'Speech Communication'
      }
    }
  ],
  random: [
    {
      id: 'http://youtu.be/JPH74ZHDuCI',
      desc: 'Partnered with Google to showcase their OnHub/IFTTT integration'
    }
  ]
}
