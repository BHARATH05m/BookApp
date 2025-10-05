export const bookCategories = [
  {
    id: 'fiction',
    name: 'Fiction',
    description: 'Explore imaginative worlds and compelling stories',
    color: '#667eea',
    books: [
      {
        id: 1,
        title: 'The Midnight Library',
        author: 'Matt Haig',
        rating: 4.2,
        description: 'Between life and death there is a library, and within that library, the shelves go on forever.',
        cover: '📚',
        genre: 'Contemporary Fiction',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Midnight-Library-Matt-Haig/dp/0525559477',
          barnesNoble: 'https://www.barnesandnoble.com/w/the-midnight-library-matt-haig/1137144568',
          
          goodreads: 'https://www.goodreads.com/book/show/52578297-the-midnight-library'
        }
      },
      {
        id: 2,
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        rating: 4.5,
        description: 'A lone astronaut must save humanity from extinction in this thrilling space adventure.',
        cover: '🚀',
        genre: 'Science Fiction',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Project-Hail-Mary-Andy-Weir/dp/0593135202',
          barnesNoble: 'https://www.barnesandnoble.com/w/project-hail-mary-andy-weir/1137144569',
          
          goodreads: 'https://www.goodreads.com/book/show/54493401-project-hail-mary'
        }
      },
      {
        id: 3,
        title: 'The Seven Husbands of Evelyn Hugo',
        author: 'Taylor Jenkins Reid',
        rating: 4.3,
        description: 'A reclusive Hollywood legend reveals her life story to an unknown journalist.',
        cover: '🎬',
        genre: 'Historical Fiction',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Seven-Husbands-Evelyn-Hugo-Novel/dp/1501161938',
          barnesNoble: 'https://www.barnesandnoble.com/w/the-seven-husbands-of-evelyn-hugo-taylor-jenkins-reid/1123456789',
          
          goodreads: 'https://www.goodreads.com/book/show/32620332-the-seven-husbands-of-evelyn-hugo'
        }
      },
      {
        id: 4,
        title: 'The Invisible Life of Addie LaRue',
        author: 'V.E. Schwab',
        rating: 4.1,
        description: 'A young woman makes a Faustian bargain to live forever and is cursed to be forgotten by everyone.',
        cover: '👻',
        genre: 'Fantasy',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Invisible-Life-Addie-LaRue/dp/0765387561',
          barnesNoble: 'https://www.barnesandnoble.com/w/the-invisible-life-of-addie-larue-v-e-schwab/1123456790',
          
          goodreads: 'https://www.goodreads.com/book/show/50623864-the-invisible-life-of-addie-larue'
        }
      }
    ]
  },
  {
    id: 'non-fiction',
    name: 'Non-Fiction',
    description: 'Discover real stories and fascinating facts',
    color: '#764ba2',
    books: [
      {
        id: 5,
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        rating: 4.4,
        description: 'A groundbreaking narrative of humanity\'s creation and evolution.',
        cover: '🧬',
        genre: 'History',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Sapiens-Humankind-Yuval-Noah-Harari/dp/0062316095',
          barnesNoble: 'https://www.barnesandnoble.com/w/sapiens-yuval-noah-harari/1119012345',
          
          goodreads: 'https://www.goodreads.com/book/show/23692271-sapiens'
        }
      },
      {
        id: 6,
        title: 'Atomic Habits',
        author: 'James Clear',
        rating: 4.6,
        description: 'Tiny changes, remarkable results: Learn how to build good habits and break bad ones.',
        cover: '⚡',
        genre: 'Self-Help',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
          barnesNoble: 'https://www.barnesandnoble.com/w/atomic-habits-james-clear/1129201155?ean=9780735211292',
          
          goodreads: 'https://www.goodreads.com/book/show/40121378-atomic-habits'
        }
      },
      {
        id: 7,
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        rating: 4.3,
        description: 'Timeless lessons on wealth, greed, and happiness.',
        cover: '💰',
        genre: 'Psychology',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness/dp/0857197681',
          barnesNoble: 'https://www.barnesandnoble.com/w/the-psychology-of-money-morgan-housel/1123456792',
          
          goodreads: 'https://www.goodreads.com/book/show/41881472-the-psychology-of-money'
        }
      },
      {
        id: 8,
        title: 'Educated',
        author: 'Tara Westover',
        rating: 4.5,
        description: 'A memoir of family, resilience and self-invention.',
        cover: '🎓',
        genre: 'Memoir',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Educated-Memoir-Tara-Westover/dp/0399590501',
          barnesNoble: 'https://www.barnesandnoble.com/w/educated-tara-westover/1123456793',
          
          goodreads: 'https://www.goodreads.com/book/show/35133922-educated'
        }
      }
    ]
  },
  {
    id: 'mystery-thriller',
    name: 'Mystery & Thriller',
    description: 'Unravel mysteries and experience heart-pounding suspense',
    color: '#f093fb',
    books: [
      {
        id: 9,
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        rating: 4.2,
        description: 'A woman shoots her husband and then never speaks again.',
        cover: '🔇',
        genre: 'Psychological Thriller',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Silent-Patient-Alex-Michaelides/dp/1250301696',
          barnesNoble: 'https://www.barnesandnoble.com/w/the-silent-patient-alex-michaelides/1123456794',
          
          goodreads: 'https://www.goodreads.com/book/show/40097951-the-silent-patient'
        }
      },
      {
        id: 10,
        title: 'Gone Girl',
        author: 'Gillian Flynn',
        rating: 4.1,
        description: 'A woman disappears on her fifth wedding anniversary.',
        cover: '👥',
        genre: 'Thriller',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Gone-Girl-Novel-Gillian-Flynn/dp/030758836X',
          barnesNoble: 'https://www.barnesandnoble.com/w/gone-girl-gillian-flynn/1112345678',
          
          goodreads: 'https://www.goodreads.com/book/show/19288043-gone-girl'
        }
      },
      {
        id: 11,
        title: 'The Guest List',
        author: 'Lucy Foley',
        rating: 3.9,
        description: 'A wedding celebration turns deadly on a remote island.',
        cover: '💒',
        genre: 'Mystery',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Guest-List-Novel-Lucy-Foley/dp/0062868934',
          barnesNoble: 'https://www.barnesandnoble.com/w/the-guest-list-lucy-foley/1123456795',
          
          goodreads: 'https://www.goodreads.com/book/show/50196847-the-guest-list'
        }
      },
      {
        id: 12,
        title: 'Verity',
        author: 'Colleen Hoover',
        rating: 4.2,
        description: 'A struggling writer discovers a manuscript that changes everything.',
        cover: '✍️',
        genre: 'Thriller',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Verity-Colleen-Hoover/dp/1538724731',
          barnesNoble: 'https://www.barnesandnoble.com/w/verity-colleen-hoover/1123456796',
          
          goodreads: 'https://www.goodreads.com/book/show/59344312-verity'
        }
      }
    ]
  },
  {
    id: 'young-adult',
    name: 'Young Adult',
    description: 'Stories that resonate with young readers and adults alike',
    color: '#4facfe',
    books: [
      {
        id: 13,
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        rating: 4.3,
        description: 'A dystopian novel about survival and rebellion.',
        cover: '🏹',
        genre: 'Dystopian',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Hunger-Games-Suzanne-Collins/dp/0439023483',
          barnesNoble: 'https://www.barnesandnoble.com/w/hunger-games-suzanne-collins/1100172345',
          
          goodreads: 'https://www.goodreads.com/book/show/2767052-the-hunger-games'
        }
      },
      {
        id: 14,
        title: 'The Fault in Our Stars',
        author: 'John Green',
        rating: 4.2,
        description: 'A love story between two teenagers who meet at a cancer support group.',
        cover: '⭐',
        genre: 'Contemporary YA',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Fault-Our-Stars-John-Green/dp/014242417X',
          barnesNoble: 'https://www.barnesandnoble.com/w/fault-in-our-stars-john-green/1112345679',
          
          goodreads: 'https://www.goodreads.com/book/show/11870085-the-fault-in-our-stars'
        }
      },
      {
        id: 15,
        title: 'Red Queen',
        author: 'Victoria Aveyard',
        rating: 4.0,
        description: 'A world divided by blood - red or silver.',
        cover: '👑',
        genre: 'Fantasy YA',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Red-Queen-Victoria-Aveyard/dp/0062310631',
          barnesNoble: 'https://www.barnesandnoble.com/w/red-queen-victoria-aveyard/1123456797',
          
          goodreads: 'https://www.goodreads.com/book/show/22328546-red-queen'
        }
      },
      {
        id: 16,
        title: 'They Both Die at the End',
        author: 'Adam Silvera',
        rating: 4.1,
        description: 'Two strangers spend their last day together.',
        cover: '⏰',
        genre: 'Contemporary YA',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/They-Both-Die-at-End/dp/0062457799',
          barnesNoble: 'https://www.barnesandnoble.com/w/they-both-die-at-the-end-adam-silvera/1123456798',
          
          goodreads: 'https://www.goodreads.com/book/show/33385229-they-both-die-at-the-end'
        }
      }
    ]
  },
  {
    id: 'business-finance',
    name: 'Business & Finance',
    description: 'Learn from successful entrepreneurs and financial experts',
    color: '#43e97b',
    books: [
      {
        id: 17,
        title: 'Rich Dad Poor Dad',
        author: 'Robert T. Kiyosaki',
        rating: 4.1,
        description: 'What the rich teach their kids about money that the poor and middle class do not.',
        cover: '💼',
        genre: 'Personal Finance',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Rich-Dad-Poor-Teach-Money/dp/1612680194',
          barnesNoble: 'https://www.barnesandnoble.com/w/rich-dad-poor-dad-robert-t-kiyosaki/1100123456',
          
          goodreads: 'https://www.goodreads.com/book/show/69571.Rich_Dad_Poor_Dad'
        }
      },
      {
        id: 18,
        title: 'The Lean Startup',
        author: 'Eric Ries',
        rating: 4.2,
        description: 'How constant innovation creates radically successful businesses.',
        cover: '🚀',
        genre: 'Entrepreneurship',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887898',
          barnesNoble: 'https://www.barnesandnoble.com/w/lean-startup-eric-ries/1100123457',
          
          goodreads: 'https://www.goodreads.com/book/show/10127019-the-lean-startup'
        }
      },
      {
        id: 19,
        title: 'Think and Grow Rich',
        author: 'Napoleon Hill',
        rating: 4.0,
        description: 'The classic guide to success and wealth creation.',
        cover: '💭',
        genre: 'Self-Help',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Think-Grow-Rich-Napoleon-Hill/dp/1585424331',
          barnesNoble: 'https://www.barnesandnoble.com/w/think-and-grow-rich-napoleon-hill/1100123458',
          
          goodreads: 'https://www.goodreads.com/book/show/30186948-think-and-grow-rich'
        }
      },
      {
        id: 20,
        title: 'Zero to One',
        author: 'Peter Thiel',
        rating: 4.3,
        description: 'Notes on startups, or how to build the future.',
        cover: '🎯',
        genre: 'Business Strategy',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296',
          barnesNoble: 'https://www.barnesandnoble.com/w/zero-to-one-peter-thiel/1119012346',
          
          goodreads: 'https://www.goodreads.com/book/show/18050143-zero-to-one'
        }
      }
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Explore the latest in tech and digital innovation',
    color: '#fa709a',
    books: [
      {
        id: 21,
        title: 'Clean Code',
        author: 'Robert C. Martin',
        rating: 4.5,
        description: 'A handbook of agile software craftsmanship.',
        cover: '💻',
        genre: 'Programming',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350884',
          barnesNoble: 'https://www.barnesandnoble.com/w/clean-code-robert-c-martin/1100123459',
          
          goodreads: 'https://www.goodreads.com/book/show/3735293-clean-code'
        }
      },
      {
        id: 22,
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt & David Thomas',
        rating: 4.4,
        description: 'Your journey to mastery in software development.',
        cover: '🔧',
        genre: 'Software Development',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Pragmatic-Programmer-Journey-Mastery-Anniversary/dp/0135957052',
          barnesNoble: 'https://www.barnesandnoble.com/w/pragmatic-programmer-andrew-hunt/1123456799',
          
          goodreads: 'https://www.goodreads.com/book/show/4099.The_Pragmatic_Programmer'
        }
      },
      {
        id: 23,
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell & Peter Norvig',
        rating: 4.3,
        description: 'The comprehensive guide to AI concepts and techniques.',
        cover: '🤖',
        genre: 'Artificial Intelligence',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Artificial-Intelligence-Modern-Approach-3rd/dp/0136042597',
          barnesNoble: 'https://www.barnesandnoble.com/w/artificial-intelligence-stuart-russell/1123456800',
          
          goodreads: 'https://www.goodreads.com/book/show/27543.Artificial_Intelligence'
        }
      },
      {
        id: 24,
        title: 'The Art of Deception',
        author: 'Kevin Mitnick',
        rating: 4.1,
        description: 'Controlling the human element of security.',
        cover: '🔒',
        genre: 'Cybersecurity',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Art-Deception-Controlling-Element-Security/dp/076454280X',
          barnesNoble: 'https://www.barnesandnoble.com/w/art-of-deception-kevin-mitnick/1123456801',
          
          goodreads: 'https://www.goodreads.com/book/show/18160.The_Art_of_Deception'
        }
      }
    ]
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    description: 'Nurture your mind, body, and soul',
    color: '#a8edea',
    books: [
      {
        id: 25,
        title: 'The Body Keeps the Score',
        author: 'Bessel van der Kolk',
        rating: 4.6,
        description: 'Brain, mind, and body in the healing of trauma.',
        cover: '🧠',
        genre: 'Psychology',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Body-Keeps-Score-Healing-Trauma/dp/0143127748',
          barnesNoble: 'https://www.barnesandnoble.com/w/body-keeps-score-bessel-van-der-kolk/1123456802',
          
          goodreads: 'https://www.goodreads.com/book/show/18693771-the-body-keeps-the-score'
        }
      },
      {
        id: 26,
        title: 'Why We Sleep',
        author: 'Matthew Walker',
        rating: 4.4,
        description: 'Unlocking the power of sleep and dreams.',
        cover: '😴',
        genre: 'Health',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Why-We-Sleep-Unlocking-Dreams/dp/1501144316',
          barnesNoble: 'https://www.barnesandnoble.com/w/why-we-sleep-matthew-walker/1123456803',
          
          goodreads: 'https://www.goodreads.com/book/show/34466963-why-we-sleep'
        }
      },
      {
        id: 27,
        title: 'The Plant Paradox',
        author: 'Steven R. Gundry',
        rating: 4.0,
        description: 'The hidden dangers in "healthy" foods that cause disease and weight gain.',
        cover: '🥗',
        genre: 'Nutrition',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Plant-Paradox-Dangers-Healthy-Disease/dp/006242713X',
          barnesNoble: 'https://www.barnesandnoble.com/w/plant-paradox-steven-r-gundry/1123456804',
          
          goodreads: 'https://www.goodreads.com/book/show/33213342-the-plant-paradox'
        }
      },
      {
        id: 28,
        title: 'Becoming Supernatural',
        author: 'Dr. Joe Dispenza',
        rating: 4.2,
        description: 'How common people are doing the uncommon.',
        cover: '✨',
        genre: 'Spirituality',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Becoming-Supernatural-Common-People-Uncommon/dp/1401953112',
          barnesNoble: 'https://www.barnesandnoble.com/w/becoming-supernatural-dr-joe-dispenza/1123456805',
          
          goodreads: 'https://www.goodreads.com/book/show/36586695-becoming-supernatural'
        }
      }
    ]
  },
  {
    id: 'travel-adventure',
    name: 'Travel & Adventure',
    description: 'Journey to distant lands and exciting adventures',
    color: '#ffecd2',
    books: [
      {
        id: 29,
        title: 'Into the Wild',
        author: 'Jon Krakauer',
        rating: 4.3,
        description: 'The story of Christopher McCandless and his journey into the Alaskan wilderness.',
        cover: '🏔️',
        genre: 'Adventure',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Into-Wild-Jon-Krakauer/dp/0385486804',
          barnesNoble: 'https://www.barnesandnoble.com/w/into-wild-jon-krakauer/1100123460',
          
          goodreads: 'https://www.goodreads.com/book/show/1845.Into_the_Wild'
        }
      },
      {
        id: 30,
        title: 'Eat, Pray, Love',
        author: 'Elizabeth Gilbert',
        rating: 4.0,
        description: 'One woman\'s search for everything across Italy, India and Indonesia.',
        cover: '🌍',
        genre: 'Travel Memoir',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Eat-Pray-Love-Elizabeth-Gilbert/dp/0143038419',
          barnesNoble: 'https://www.barnesandnoble.com/w/eat-pray-love-elizabeth-gilbert/1100123461',
          
          goodreads: 'https://www.goodreads.com/book/show/19501.Eat_Pray_Love'
        }
      },
      {
        id: 31,
        title: 'Wild',
        author: 'Cheryl Strayed',
        rating: 4.1,
        description: 'From lost to found on the Pacific Crest Trail.',
        cover: '🥾',
        genre: 'Adventure Memoir',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Wild-From-Lost-Found-Pacific/dp/0307476073',
          barnesNoble: 'https://www.barnesandnoble.com/w/wild-cheryl-strayed/1112345680',
          
          goodreads: 'https://www.goodreads.com/book/show/12262741-wild'
        }
      },
      {
        id: 32,
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        rating: 4.2,
        description: 'A shepherd boy\'s journey to find his personal legend.',
        cover: '🧭',
        genre: 'Adventure Fiction',
        purchaseLinks: {
          amazon: 'https://www.amazon.com/Alchemist-Paulo-Coelho/dp/0062315005',
          barnesNoble: 'https://www.barnesandnoble.com/w/alchemist-paulo-coelho/1100123462',
          
          goodreads: 'https://www.goodreads.com/book/show/18144590-the-alchemist'
        }
      }
    ]
  }
];

export const getBooksByCategory = (categoryId) => {
  const category = bookCategories.find(cat => cat.id === categoryId);
  return category ? category.books : [];
};

export const getAllBooks = () => {
  return bookCategories.flatMap(category => category.books);
};

export const searchBooks = (query) => {
  const allBooks = getAllBooks();
  const lowercaseQuery = query.toLowerCase();
  
  return allBooks.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.description.toLowerCase().includes(lowercaseQuery) ||
    book.genre.toLowerCase().includes(lowercaseQuery)
  );
};

