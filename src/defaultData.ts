import { SurpriseData } from './types';

export const DEFAULT_SURPRISE: SurpriseData = {
  recipientName: 'Ananya',
  senderName: 'Rahul',
  age: '25',
  birthDay: '24',
  birthMonth: 'Oct',
  cake: 'midnight-chocolate',
  virtualCandles: true,
  balloons: [
    {
      id: 'b1',
      name: 'Ruby Balloon',
      color: 'bg-rose-500',
      textColor: 'text-white',
      tagColor: 'text-rose-600',
      tagBg: 'bg-rose-100',
      text: 'The way you laugh until your stomach hurts and tears roll down 😂❤️',
      popNumber: 1,
      popped: false,
    },
    {
      id: 'b2',
      name: 'Amber Balloon',
      color: 'bg-amber-500',
      textColor: 'text-white',
      tagColor: 'text-amber-700',
      tagBg: 'bg-amber-100',
      text: 'How you always know when I need a check-in call without asking ☕💫',
      popNumber: 2,
      popped: false,
    },
    {
      id: 'b3',
      name: 'Rose Balloon',
      color: 'bg-orange-400',
      textColor: 'text-white',
      tagColor: 'text-orange-700',
      tagBg: 'bg-orange-100',
      text: 'You make ordinary Tuesday evenings feel like a mini festival ✨🎉',
      popNumber: 3,
      popped: false,
    },
  ],
  photos: [
    {
      id: 'p1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtuLfUNLG6yh9nfQLl_PLdMGR4lmuOwihiFWkLQOFICwGiXob5-MikF8Hn-uV_5KM97h7HMPld1d48PhyN6BbLbFk5iXl2y5UdldBsklI6DJ0JlmJ3CRc2cZW2zULM_wZkiiJM89A__cNQlRT7JWD0m0LENwiX8wiR_gVxWnL-Os7lQPbzDehcxObVxJmy2baIRpoPYX8Tk_6wEGa1kmNtbgCLCRSkTzy5NfmnU_t9B2ovtycvj0uM',
      caption: 'Goa Sunset, 2023 🌅',
      location: 'Anjuna Beach',
      date: 'Dec 2023',
    },
    {
      id: 'p2',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDauHuwjRMCjVcjhRI5i6dkKOzU9bAUQsiUso9owq5dDnzq-kOVkF3wdgKaXLuUqOiYnH3XjISPTCIZF-jWatnUr87a_fIviC8v-KI_kg4-nMapUm5ivOfg2Ovro6CEY48l9JgXD2LiJ6EaUKCvds5K7IsrrJFXQ8tVrZ_iVxsMGow_jLo0Ec2yCvF4kR8V3Tgkk_aeIGxDFSRlOKEhrS1A1ana2_kLV-YxV_Zjc_2ryzPR-zpwau7Y',
      caption: 'Coffee date laughs ☕',
      location: 'Bangalore',
      date: 'Nov 2023',
    },
    {
      id: 'p3',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEjAMwFbS0L7zQ0BLGVzT3O52r2oTZXD0Ot4k9x_pktzCFoEnntWoRIUEz3GSGg6pst0b8aBktG2rsmBgCRaidAbxitaTMNwljYby_hj3QWn_VLR3av39GOlH5smgeBLtn3-11Rkx4AHBE2axOyfrje5i5DT2slG27ZyUCWqkYv3ZPrfi7lkWgKgu9YNrkBjM7GHLyMdIBJKXR413mJy8gMNfxguJigafUf64gsOf_9wDiLV_MZBxo',
      caption: 'Jaipur golden hour ✨',
      location: 'Hawa Mahal',
      date: 'Feb 2024',
    },
  ],
  fairyLightsActive: true,
  letter: `Watching you grow and blossom over this past year has been my absolute favorite privilege. Through every late-night giggle, impromptu cup of midnight chai, and wild ambition you conquered — you made life brighter.

Happy birthday to the person who turns ordinary moments into memories I treasure forever. Here is to 365 more days of pure laughter, endless road trips, and dreams fulfilled! ✨`,
  letterTone: 'romantic',
  waxSeal: 'crimson',
  soundtrack: 'blue',
  soundtrackVolume: 45,
  voiceNoteCandle: null,
  voiceNoteLetter: null,
  voiceNote: null,
};

export const CAKE_OPTIONS = [
  {
    id: 'midnight-chocolate' as const,
    title: 'Midnight Chocolate',
    tag: 'Popular',
    sub: 'Rich, dark & dreamy',
    desc: 'Decadent chocolate layers, golden sprinkles, chocolate truffle details',
    flavorBadge: 'DECADENT & INDULGENT',
    ingredients: 'Triple Dutch cocoa, 24k gold leaf speckles',
    emoji: '🍫',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiXnokNyFI6nPxhu4ly183bhIt3pzzSEfOQZf8h_FDJbvmYpIZhRs-_SCPU0B4cAT4ejRrtyeIT_WL6V7m0nloBQJm4yqWTWnrExCOkMntQqBfaV_pmZfjdDU1rQe_jBdY977WRLTUkbNz_5XafMwfoD7OSgCTSrbFTm5tFG2z_urOPVelFLyN5FtN9LtH93ZJmaI_jbw6KgmjSrqC1S4QZ4pkHZ-q7_6KZT1uJnQcEvwgDY5fuF79',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAq-aZoULOacEfDOHgQwfj8_CGad9VkkM0AZPCXS1-6MeUHTuWK3I0gIbaWJRbu8K9QrjuJRaToJQELp6hVkvXctFbSZkSm3uhqyxj9Ltfw-7zhYIwvSGyecajnfzMIx6fOtY3bL7twR_AReJ9AJkJSloVY9-gK5eYsCucH1voA1LjZK77Hu73eHN95YkaFNOtMEmoIRW-OqawUoiOn_VmW5i7mnXlzeE1kQqWXerS95kNU_FJvk0v',
  },
  {
    id: 'strawberry-blush' as const,
    title: 'Strawberry Blush',
    tag: 'Romantic',
    sub: 'Soft, sweet & rosy',
    desc: 'Delicate strawberry cream, fresh berry toppings, pastel pink icing',
    flavorBadge: 'DELICATE & REFRESHING',
    ingredients: 'Velvety alpine berry cream, pink meringue rosettes',
    emoji: '🍓',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVQHOxQjUqqM05Has_eznRR14HcDhvL_Ay6AQScvXi7u4t17wAtyRahFgK1C3DdFCrXFIeNdgpeQWNV-n0Et4WediPVpNNAceEQH-Tl-GMR9MSa4-Nv2aA99_SEyx50SOLGpGzR_3zX-qYQz0X4fyOJ-X9gZs5QdbQNFjCNNy2DACfD7EzaDWc72SwTr2VKg-34607H-Oa7YW0LoCIRY7KRczdpuKM_7a3CpmP6pgPpzoT2AhdEK4a',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVQHOxQjUqqM05Has_eznRR14HcDhvL_Ay6AQScvXi7u4t17wAtyRahFgK1C3DdFCrXFIeNdgpeQWNV-n0Et4WediPVpNNAceEQH-Tl-GMR9MSa4-Nv2aA99_SEyx50SOLGpGzR_3zX-qYQz0X4fyOJ-X9gZs5QdbQNFjCNNy2DACfD7EzaDWc72SwTr2VKg-34607H-Oa7YW0LoCIRY7KRczdpuKM_7a3CpmP6pgPpzoT2AhdEK4a',
  },
  {
    id: 'vanilla-gold' as const,
    title: 'Vanilla Gold',
    tag: 'Timeless',
    sub: 'Classic, warm & glowing',
    desc: 'Pure Madagascar vanilla, shimmering edible gold foil, warm caramel drizzle',
    flavorBadge: 'CLASSIC & LUMINOUS',
    ingredients: 'Bourbon bean frosting, caramel drizzle & edible gold',
    emoji: '✨',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd0k1ZUjgSRNFOYIGpo3ujGe-iMuula4zHbs_tkPxU5OM6PkKZTtRyh8bX9zH2JInIe9DlGMHxcGcS1pSFWQsUi5OxDWYBwive1tHEd3tiefgziDo6kX0a5pqNFlXpg9wW70r3FQkswQXAWIXNZpIx8efNunudf5LeilzfaS7PTmM9nbvbhhkBueEQYJwU5peT7W47qk5Q6Fg74FmkM8EGGyUuF6EkE8Ozy72PSRQ-JLdUC01cAQQB',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd0k1ZUjgSRNFOYIGpo3ujGe-iMuula4zHbs_tkPxU5OM6PkKZTtRyh8bX9zH2JInIe9DlGMHxcGcS1pSFWQsUi5OxDWYBwive1tHEd3tiefgziDo6kX0a5pqNFlXpg9wW70r3FQkswQXAWIXNZpIx8efNunudf5LeilzfaS7PTmM9nbvbhhkBueEQYJwU5peT7W47qk5Q6Fg74FmkM8EGGyUuF6EkE8Ozy72PSRQ-JLdUC01cAQQB',
  },
];

export const BRAND_LOGO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD5JlzCxBYn6nCyR0Gjw-p9guqHYtggj1Op9brdbajF0EYsyWl4kNeBM5vTb5sBwf_qv9LYBzr7nOF9oCJEyBlHydTSKRuNLNHbpXpa4krKAnhSS8ZTBGKIZ9Pj1ZM0hiAz2aVoiCAVo6Se7_lUxWXA_33GPpXf9qUbxPkeS1VcW6eP6u45sl-iZkOxlreQJuy6mvNMm0vR6QSWhGDxDnzlVEWpbgKIeq9exKRpUF6agRlzTLK_XyaU';

export const PARCEL_BOX_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDsUNya6Z7cQhCyfgf9KJ8Tro9aLAio1YRP60S6EdxCWd-9PDAwHFht9GNSYQne0p2Sgv3BRh32uWHGNSDxtDaOClR4Y4TqNqAhid7uJSFP4maApz8-bHWNoL9bEHMoxm20mzSCb2Uuu8I7tFcl_I43Yc0d4TiQLkYFV5OMD7Q0yvfycohcZYMVl-aBaaANkVG5XQJBeApNKLECL77EtlWN20PSPQvKBgODXvZafWDXCpVvDwffkyyc';

export const SOUNDTRACK_HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCNIslRfkUbhHt8gENXscHhEjAv7a6RNFH-sWusclYfjNaV3NFTJmQQXIl-xIxXTDU9LVUWevLpUl_9wzpAGYK97ASa6oYqWrXgnYBSwmKIXN1SWRZEgnpxHL2pH3Eqq7vsWjqPp0q9Zi9RB-q_LGPQ-jJ-xHQEi1eWUkRLQ-edOlkBnqQK3pkRkJsSzfGLF01Oq87biika6tEyShyr9Kq5StreActUHYx3BauS22kcVUYJalOogI1A';
