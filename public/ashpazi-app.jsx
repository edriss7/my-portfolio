const { useState } = React;

const CHEFS = {
  rosa: { name: 'Rosa Montazami', nameFA: 'روزا منتظمی', title: 'Mother of Persian Cooking' },
  najmieh: { name: 'Najmieh Batmanglij', nameFA: 'نجمیه بتمانگلیج', title: 'Persian Cuisine Ambassador' },
  samin: { name: 'Samin Nosrat', nameFA: 'سامین نصرت', title: 'Salt Fat Acid Heat Author' },
  louisa: { name: 'Louisa Shafia', nameFA: 'لوئیزا شفیعا', title: 'The New Persian Kitchen Author' },
  yasmin: { name: 'Yasmin Khan', nameFA: 'یاسمین خان', title: 'Saffron Tales Author' },
};

const RECIPES = [
  // === STEWS ===
  {
    id: 1, name: 'Ghormeh Sabzi', nameFA: 'قورمه سبزی',
    emoji: '🌿', category: 'stew', chef: 'rosa', calories: 350,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=60&q=60',
    time: '3 hours', servings: 6, difficulty: 'Medium',
    description: 'The king of Persian stews! A fragrant herb stew with kidney beans and dried limes.',
    descFA: 'پادشاه خورش‌های ایرانی! خورشت سبزی معطر با لوبیا و لیمو عمانی',
    ingredients: ['500g lamb or beef, cubed', '2 cups parsley, chopped', '1 cup cilantro, chopped', '1 cup chives, chopped',
      '1/2 cup fenugreek leaves', '1 cup kidney beans, soaked', '3-4 dried limes', '2 onions, diced', '1 tsp turmeric', 'Oil, salt, pepper'],
    steps: ['Soak kidney beans overnight, boil until tender.', 'Sauté onions until golden, add turmeric.',
      'Brown meat cubes on all sides, add 3 cups water, simmer 1 hour.',
      'Sauté all herbs in separate pan for 15-20 min until dark green.',
      'Add herbs, beans, and pierced dried limes to the meat.',
      'Simmer on low for 2 hours. Serve over chelow.'],
    comments: [
      { user: 'Sara', text: 'My family\'s favorite! I add extra fenugreek.', time: '2 days ago' },
      { user: 'Ali', text: 'Rosa Montazami\'s version is the best. Thank you for sharing!', time: '1 week ago' },
    ],
  },
  {
    id: 2, name: 'Fesenjaan', nameFA: 'فسنجان',
    emoji: '🌰', category: 'stew', chef: 'najmieh', calories: 480,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=60&q=60',
    time: '3 hours', servings: 5, difficulty: 'Medium',
    description: 'Rich pomegranate walnut stew with chicken. Sweet, sour, and nutty.',
    descFA: 'خورشت انار و گردو با مرغ. شیرین، ترش و خوشمزه',
    ingredients: ['6 chicken thighs', '2.5 cups walnuts, ground', '1.5 cups pomegranate paste',
      '1 onion, diced', '2-3 tbsp sugar', '1/2 tsp cinnamon', '1/4 tsp nutmeg', 'Oil, salt, pepper'],
    steps: ['Toast ground walnuts in dry pan 5 min.', 'Sauté onion, brown chicken pieces.',
      'Add walnuts + 3 cups water, bring to boil.',
      'Add pomegranate paste, sugar, cinnamon, nutmeg.',
      'Return chicken, simmer 2.5 hours until thick and dark.',
      'Garnish with pomegranate seeds. Serve over rice.'],
    comments: [
      { user: 'Maryam', text: 'The balance of sweet and sour is key. Perfection!', time: '3 days ago' },
    ],
  },
  {
    id: 3, name: 'Khoresh Bademjan', nameFA: 'خورشت بادمجان',
    emoji: '🍆', category: 'stew', chef: 'rosa', calories: 380,
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=60&q=60',
    time: '2.5 hours', servings: 5, difficulty: 'Medium',
    description: 'Tomato-based lamb stew with fried eggplant and sour grapes.',
    descFA: 'خورشت بادمجان با گوشت و آب غوره',
    ingredients: ['500g lamb, cubed', '3 eggplants', '2 onions', '3 tbsp tomato paste',
      '1/2 cup sour grape juice', 'Saffron', 'Turmeric', 'Oil, salt, pepper'],
    steps: ['Salt eggplant slices 30 min, pat dry, fry golden.',
      'Sauté onions, add turmeric and meat, brown.',
      'Add tomato paste, 2 cups water, simmer 1 hour.',
      'Add sour grape juice and saffron.',
      'Place fried eggplant on top, simmer 30 more min.',
      'Serve over steamed rice.'],
    comments: [
      { user: 'Reza', text: 'Make sure to salt the eggplant well - removes bitterness!', time: '5 days ago' },
    ],
  },
  {
    id: 4, name: 'Khoresh Karafs', nameFA: 'خورشت کرفس',
    emoji: '🥬', category: 'stew', chef: 'rosa', calories: 320,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=60&q=60',
    time: '2.5 hours', servings: 5, difficulty: 'Easy',
    description: 'Celery and herb stew with lamb. Light, herby, and comforting.',
    descFA: 'خورشت کرفس با گوشت گوسفند',
    ingredients: ['500g lamb, cubed', '4 stalks celery, chopped', '1 cup parsley', '1/2 cup mint',
      '1 onion', '2 tbsp lime juice', 'Turmeric', 'Oil, salt, pepper'],
    steps: ['Sauté onion, brown meat, add turmeric.',
      'Add water and simmer 1 hour.',
      'Sauté celery and herbs separately.',
      'Add to stew with lime juice.',
      'Simmer 45 min more. Serve with rice.'],
    comments: [],
  },
  // === KABABS ===
  {
    id: 5, name: 'Chelow Kabab Koobideh', nameFA: 'چلو کباب کوبیده',
    emoji: '🍖', category: 'kabab', chef: 'rosa', calories: 550,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=60&q=60',
    time: '1.5 hours', servings: 4, difficulty: 'Medium',
    description: 'Iran\'s national dish! Juicy ground meat kababs with saffron.',
    descFA: 'غذای ملی ایران! کباب کوبیده آبدار با زعفران',
    ingredients: ['500g ground lamb', '1 onion, grated & drained', 'Saffron', 'Salt, pepper, sumac', 'Flat skewers', 'Basmati rice'],
    steps: ['Grate onion and squeeze ALL moisture out.',
      'Knead meat with onion, salt, pepper, saffron 15 min.',
      'Refrigerate 1+ hour.',
      'Mold onto flat skewers.',
      'Grill over charcoal 4-5 min per side.',
      'Serve over saffron rice with grilled tomato and butter.'],
    comments: [
      { user: 'Dariush', text: 'The secret is kneading the meat long enough!', time: '1 day ago' },
      { user: 'Shirin', text: 'My baba\'s recipe was just like this. Merci!', time: '4 days ago' },
    ],
  },
  {
    id: 6, name: 'Joojeh Kabab', nameFA: 'جوجه کباب',
    emoji: '🐔', category: 'kabab', chef: 'samin', calories: 420,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=60&q=60',
    time: '4+ hours', servings: 4, difficulty: 'Easy',
    description: 'Saffron lemon marinated chicken kababs. Tender and charred.',
    descFA: 'جوجه کباب زعفرانی با لیمو',
    ingredients: ['1kg chicken, cubed', '1 onion, grated', '1/4 cup lemon juice', 'Saffron',
      'Olive oil', 'Tomato paste', 'Salt, pepper'],
    steps: ['Mix marinade: onion, lemon, oil, saffron, tomato paste.',
      'Marinate chicken 4+ hours (overnight best).',
      'Thread onto skewers with tomatoes and peppers.',
      'Grill, basting with butter + marinade.',
      'Serve with saffron rice and sabzi khordan.'],
    comments: [
      { user: 'Neda', text: 'Overnight marinade makes all the difference!', time: '2 days ago' },
    ],
  },
  {
    id: 7, name: 'Kabab Barg', nameFA: 'کباب برگ',
    emoji: '🥩', category: 'kabab', chef: 'najmieh', calories: 490,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=60&q=60',
    time: '6+ hours', servings: 4, difficulty: 'Hard',
    description: 'Thin slices of marinated lamb or beef tenderloin, grilled to perfection.',
    descFA: 'کباب برگ فیله گوسفند یا گوساله',
    ingredients: ['500g beef tenderloin, thinly sliced', '1 onion, grated', 'Saffron', 'Lemon juice',
      'Olive oil', 'Butter', 'Salt, pepper'],
    steps: ['Pound fillets thin with meat mallet.',
      'Marinate in onion, saffron, lemon juice, oil overnight.',
      'Thread onto wide flat skewers.',
      'Grill on very hot charcoal, basting with saffron butter.',
      'Serve immediately with chelow and grilled tomato.'],
    comments: [],
  },
  // === RICE ===
  {
    id: 8, name: 'Tahdig', nameFA: 'ته‌دیگ',
    emoji: '🍚', category: 'rice', chef: 'samin', calories: 380,
    image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=60&q=60',
    time: '1.5 hours', servings: 6, difficulty: 'Hard',
    description: 'The golden crispy rice crust. The most prized part of any Persian rice!',
    descFA: 'ته‌دیگ طلایی و ترد. بهترین بخش پلو!',
    ingredients: ['3 cups basmati rice', 'Saffron', 'Yogurt', 'Oil or butter', 'Salt'],
    steps: ['Rinse rice, soak 1 hour.', 'Parboil 6-7 min in salted water, drain.',
      'Mix 2 cups rice with saffron + yogurt.',
      'Heat oil in pot, spread saffron rice on bottom.',
      'Layer remaining rice in pyramid, poke holes.',
      'Wrap lid in towel, steam on low 50 min.',
      'Rest on cold wet towel 2 min, flip onto plate!'],
    comments: [
      { user: 'Leila', text: 'The yogurt trick gives the best crunch!', time: '6 hours ago' },
      { user: 'Kaveh', text: 'Patience is the key ingredient here', time: '2 days ago' },
    ],
  },
  {
    id: 9, name: 'Zereshk Polo ba Morgh', nameFA: 'زرشک پلو با مرغ',
    emoji: '🍗', category: 'rice', chef: 'rosa', calories: 520,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=60&q=60',
    time: '2 hours', servings: 5, difficulty: 'Medium',
    description: 'Jeweled barberry rice with saffron chicken. A festive celebration dish.',
    descFA: 'زرشک پلو با مرغ زعفرانی. غذای جشنی',
    ingredients: ['3 cups basmati rice', '1 chicken', '1 cup barberries', 'Saffron', 'Butter',
      '2 tbsp sugar', 'Onion', 'Turmeric', 'Salt, pepper'],
    steps: ['Sauté onion, add turmeric, brown chicken.',
      'Add water + saffron, cook chicken 45 min.',
      'Parboil and steam rice with tahdig.',
      'Sauté barberries in butter with sugar + saffron.',
      'Top rice with barberries and chicken.'],
    comments: [
      { user: 'Parisa', text: 'My wedding dish! Always brings back memories.', time: '1 week ago' },
    ],
  },
  {
    id: 10, name: 'Baghali Polo', nameFA: 'باقالی پلو',
    emoji: '🫘', category: 'rice', chef: 'louisa', calories: 450,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=60&q=60',
    time: '2 hours', servings: 6, difficulty: 'Medium',
    description: 'Dill and fava bean rice, served with lamb shank.',
    descFA: 'باقالی پلو با شوید و ماهیچه',
    ingredients: ['3 cups basmati rice', '2 cups fava beans', '1 cup dill', 'Saffron', 'Oil or butter', 'Salt'],
    steps: ['Soak rice 1 hour.', 'Blanch fava beans, remove skins.',
      'Parboil rice, add favas last minute, drain.',
      'Mix in chopped dill.',
      'Steam with tahdig on bottom, 50 min.',
      'Serve with saffron and braised lamb shanks.'],
    comments: [],
  },
  {
    id: 11, name: 'Sabzi Polo ba Mahi', nameFA: 'سبزی پلو با ماهی',
    emoji: '🐟', category: 'rice', chef: 'yasmin', calories: 410,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=60&q=60',
    time: '2 hours', servings: 6, difficulty: 'Medium',
    description: 'Herb rice with fried fish. The traditional Nowruz dish.',
    descFA: 'سبزی پلو با ماهی. غذای سنتی نوروز',
    ingredients: ['3 cups basmati rice', '4 fish fillets', 'Parsley, cilantro, dill, chives',
      'Turmeric', 'Lime juice', 'Saffron', 'Oil, salt, pepper'],
    steps: ['Soak rice, season fish with turmeric and lime.',
      'Parboil rice, mix in all chopped herbs.',
      'Steam herbed rice with tahdig.',
      'Pan-fry fish until golden.',
      'Serve with saffron drizzle and lime wedges.'],
    comments: [
      { user: 'Nooshin', text: 'Every Nowruz without fail! 🍽️', time: '3 days ago' },
    ],
  },
  {
    id: 12, name: 'Tahchin', nameFA: 'ته‌چین',
    emoji: '🍰', category: 'rice', chef: 'najmieh', calories: 480,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=60&q=60',
    time: '2.5 hours', servings: 6, difficulty: 'Hard',
    description: 'Crispy saffron rice cake with yogurt-marinated chicken.',
    descFA: 'ته‌چین مرغ با زعفران و ماست',
    ingredients: ['3 cups rice', 'Chicken', 'Yogurt', 'Egg yolks', 'Saffron', 'Butter', 'Salt, pepper'],
    steps: ['Cook and shred chicken.', 'Parboil rice.',
      'Mix rice with yogurt, egg yolks, saffron, butter.',
      'Layer half in oiled dish, add chicken, top with rest.',
      'Cover and bake 350°F for 1.5-2 hours.',
      'Flip onto plate for crispy golden bottom!'],
    comments: [],
  },
  // === SOUPS ===
  {
    id: 13, name: 'Ash Reshteh', nameFA: 'آش رشته',
    emoji: '🍜', category: 'soup', chef: 'rosa', calories: 320,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=60&q=60',
    time: '2.5 hours', servings: 8, difficulty: 'Medium',
    description: 'Hearty noodle soup with herbs, beans, and kashk topping.',
    descFA: 'آش رشته با کشک و نعناع داغ',
    ingredients: ['Chickpeas, kidney beans, lentils', 'Reshteh noodles', 'Parsley, cilantro, dill, spinach',
      'Onions', 'Kashk', 'Dried mint', 'Turmeric', 'Oil, salt'],
    steps: ['Boil chickpeas and kidney beans until tender.',
      'Add lentils, cook 20 more min.',
      'Sauté onion + turmeric, add all herbs.',
      'Combine with beans, add 8 cups water, simmer 30 min.',
      'Add noodles, cook 15 min.',
      'Top with kashk, fried onions, and mint oil.'],
    comments: [
      { user: 'Fatemeh', text: 'The kashk topping is everything!', time: '1 day ago' },
    ],
  },
  {
    id: 14, name: 'Aash-e Doogh', nameFA: 'آش دوغ',
    emoji: '🥣', category: 'soup', chef: 'yasmin', calories: 280,
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=60&q=60',
    time: '2 hours', servings: 6, difficulty: 'Easy',
    description: 'Yogurt-based soup from Tabriz with herbs and tiny meatballs.',
    descFA: 'آش دوغ تبریزی با کوفته ریز',
    ingredients: ['Yogurt + water', 'Rice', 'Chickpeas', 'Ground meat', 'Parsley, cilantro, mint, dill', 'Onion', 'Turmeric'],
    steps: ['Cook chickpeas. Form tiny meatballs from seasoned meat.',
      'Whisk yogurt with water until smooth.',
      'Add rice and chickpeas, bring to gentle boil.',
      'Add herbs and meatballs.',
      'Simmer 45 min. Serve with dried mint.'],
    comments: [],
  },
  {
    id: 15, name: 'Aash-e Anar', nameFA: 'آش انار',
    emoji: '🍎', category: 'soup', chef: 'louisa', calories: 310,
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=60&q=60',
    time: '2 hours', servings: 6, difficulty: 'Medium',
    description: 'Pomegranate soup with meatballs. A sweet and sour winter warmer from Isfahan.',
    descFA: 'آش انار اصفهانی با کوفته',
    ingredients: ['Pomegranate juice', 'Rice', 'Split peas, lentils', 'Ground meat', 'Herbs', 'Pomegranate paste',
      'Sugar', 'Mint', 'Salt, pepper'],
    steps: ['Cook split peas and lentils.',
      'Form small meatballs with seasoned ground meat.',
      'Sauté herbs, add to bean pot with pomegranate juice.',
      'Add rice and meatballs.',
      'Simmer 45 min. Balance sweet/sour with sugar and pomegranate paste.',
      'Garnish with mint, fried onion, pomegranate seeds.'],
    comments: [],
  },
  // === APPETIZERS ===
  {
    id: 16, name: 'Kuku Sabzi', nameFA: 'کوکو سبزی',
    emoji: '🥚', category: 'appetizer', chef: 'rosa', calories: 220,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&q=60',
    time: '45 min', servings: 4, difficulty: 'Easy',
    description: 'Vibrant Persian herb frittata. A Nowruz tradition.',
    descFA: 'کوکو سبزی. غذای سنتی نوروز',
    ingredients: ['6 eggs', 'Parsley, cilantro, dill, chives', 'Flour', 'Baking powder',
      'Turmeric', 'Barberries, walnuts (optional)', 'Oil, salt, pepper'],
    steps: ['Finely chop all herbs, pat dry.',
      'Beat eggs with turmeric, flour, baking powder.',
      'Fold in herbs, barberries, walnuts.',
      'Cook in oiled skillet on low 10 min.',
      'Bake at 350°F 15-20 min until firm.',
      'Serve in wedges with yogurt and bread.'],
    comments: [
      { user: 'Zahra', text: 'The barberries add such a nice pop of color and flavor!', time: '3 days ago' },
    ],
  },
  {
    id: 17, name: 'Dolmeh Barg Mo', nameFA: 'دلمه برگ مو',
    emoji: '🍃', category: 'appetizer', chef: 'najmieh', calories: 290,
    image: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=60&q=60',
    time: '2.5 hours', servings: 6, difficulty: 'Hard',
    description: 'Grape leaves stuffed with fragrant rice, meat, and herbs.',
    descFA: 'دلمه برگ مو با برنج و گوشت',
    ingredients: ['40-50 grape leaves', 'Rice', 'Ground meat', 'Split peas', 'Herbs',
      'Tomato paste', 'Sugar, lemon juice', 'Cinnamon', 'Salt, pepper'],
    steps: ['Blanch grape leaves. Half-cook rice.',
      'Mix rice, meat, split peas, herbs, spices for filling.',
      'Place filling on leaf, fold sides, roll tightly.',
      'Pack seam-down in pot.',
      'Pour tomato-lemon-sugar sauce over.',
      'Simmer 2 hours with plate weight on top.'],
    comments: [],
  },
  {
    id: 18, name: 'Mirza Ghasemi', nameFA: 'میرزا قاسمی',
    emoji: '🍅', category: 'appetizer', chef: 'yasmin', calories: 250,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=60&q=60',
    time: '45 min', servings: 4, difficulty: 'Easy',
    description: 'Smoky eggplant and tomato dip from Gilan. Incredible with bread.',
    descFA: 'میرزا قاسمی گیلانی',
    ingredients: ['3 eggplants', '4 tomatoes', '4 eggs', '6 cloves garlic', 'Turmeric', 'Oil, salt, pepper'],
    steps: ['Char eggplants over flame or broiler until skin is black.',
      'Peel and mash the smoky flesh.',
      'Sauté garlic and turmeric in oil.',
      'Add chopped tomatoes, cook until soft.',
      'Add mashed eggplant, mix well.',
      'Crack eggs in, stir until just set.',
      'Serve with sangak or lavash bread.'],
    comments: [
      { user: 'Hooman', text: 'Best appetizer ever. The smoky flavor is unreal!', time: '5 hours ago' },
    ],
  },
  {
    id: 19, name: 'Kashk-e Bademjan', nameFA: 'کشک بادمجان',
    emoji: '🍆', category: 'appetizer', chef: 'rosa', calories: 280,
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=60&q=60',
    time: '1 hour', servings: 4, difficulty: 'Easy',
    description: 'Creamy eggplant and kashk dip with fried mint and walnuts.',
    descFA: 'کشک بادمجان با نعناع داغ',
    ingredients: ['3 eggplants', 'Kashk', 'Onions', 'Garlic', 'Dried mint', 'Walnuts', 'Turmeric', 'Oil'],
    steps: ['Peel and dice eggplant, fry until golden.',
      'Sauté onion and garlic, add turmeric.',
      'Mash eggplant, combine with onion mixture.',
      'Stir in kashk, simmer 10 min.',
      'Garnish with fried mint, fried onion, walnuts, kashk drizzle.'],
    comments: [],
  },
  // === DESSERTS ===
  {
    id: 20, name: 'Sholeh Zard', nameFA: 'شله زرد',
    emoji: '🍮', category: 'dessert', chef: 'rosa', calories: 350,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=60&q=60',
    time: '2 hours', servings: 8, difficulty: 'Easy',
    description: 'Saffron rice pudding decorated with cinnamon and almonds.',
    descFA: 'شله زرد با زعفران و گلاب',
    ingredients: ['1 cup rice', '8 cups water', '2 cups sugar', 'Rose water',
      'Saffron', 'Oil or butter', 'Almonds', 'Cinnamon', 'Cardamom'],
    steps: ['Soak rice 1 hour. Boil until very soft.',
      'Add sugar, stir to dissolve.',
      'Add saffron, rose water, oil.',
      'Simmer 40 min, stirring often.',
      'Pour into bowls, decorate with cinnamon patterns and almonds.',
      'Serve chilled. A traditional nazri offering.'],
    comments: [
      { user: 'Mahsa', text: 'Made this for Ramadan. Everyone loved it!', time: '1 week ago' },
    ],
  },
  {
    id: 21, name: 'Faloodeh Shirazi', nameFA: 'فالوده شیرازی',
    emoji: '🧊', category: 'dessert', chef: 'louisa', calories: 260,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=60&q=60',
    time: '4+ hours', servings: 6, difficulty: 'Medium',
    description: 'Rose water ice with thin vermicelli noodles. Ancient Persian frozen treat.',
    descFA: 'فالوده شیرازی با گلاب',
    ingredients: ['2 cups sugar', '4 cups water', '1/4 cup rose water', '1 cup thin vermicelli',
      'Lime juice', 'Pistachios for garnish'],
    steps: ['Boil sugar and water to make syrup. Add rose water.',
      'Cook vermicelli, cut into 2-inch pieces.',
      'Mix noodles into cooled syrup.',
      'Pour into shallow pan, freeze.',
      'Stir every 30 min for 3-4 hours to break crystals.',
      'Serve with lime juice and crushed pistachios.'],
    comments: [],
  },
  {
    id: 22, name: 'Bastani Sonnati', nameFA: 'بستنی سنتی',
    emoji: '🍨', category: 'dessert', chef: 'samin', calories: 320,
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=60&q=60',
    time: '5+ hours', servings: 8, difficulty: 'Medium',
    description: 'Traditional Persian ice cream with saffron, rose water, and pistachios.',
    descFA: 'بستنی سنتی زعفرانی',
    ingredients: ['2 cups heavy cream', '1 cup whole milk', '1 cup sugar', 'Saffron', 'Rose water',
      '1/2 cup pistachios', 'Salep powder (or cornstarch)', 'Frozen clotted cream chunks'],
    steps: ['Dissolve saffron in hot water.',
      'Heat milk, add sugar and salep, stir until thick.',
      'Cool, add cream, saffron, rose water.',
      'Churn in ice cream maker (or freeze + stir method).',
      'Fold in pistachios and frozen cream chunks.',
      'Freeze until firm. Serve between wafers (bastani sandwich!).'],
    comments: [
      { user: 'Arash', text: 'The salep makes it so stretchy and unique!', time: '4 days ago' },
    ],
  },
  {
    id: 23, name: 'Ranginak', nameFA: 'رانگینک',
    emoji: '🍋', category: 'dessert', chef: 'najmieh', calories: 380,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=60&q=60',
    time: '1 hour', servings: 8, difficulty: 'Easy',
    description: 'Date and walnut confection from southern Iran. No-bake and incredibly rich.',
    descFA: 'رانگینک خرمایی با گردو',
    ingredients: ['500g pitted dates', '1 cup walnuts', '1/2 cup butter', '1 cup flour',
      'Cinnamon', 'Cardamom', 'Pistachios for garnish'],
    steps: ['Stuff each date with a walnut half.',
      'Toast flour in butter until golden and fragrant.',
      'Add cinnamon and cardamom to the flour mixture.',
      'Press stuffed dates into a dish.',
      'Spread toasted flour mixture over the top.',
      'Chill, cut into pieces. Garnish with pistachios.'],
    comments: [],
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All Recipes', labelFA: 'همه دستورها', icon: '📖' },
  { key: 'stew', label: 'Stews', labelFA: 'خورشت‌ها', icon: '🍲' },
  { key: 'kabab', label: 'Kababs', labelFA: 'کباب‌ها', icon: '🍖' },
  { key: 'rice', label: 'Rice Dishes', labelFA: 'پلوها', icon: '🍚' },
  { key: 'soup', label: 'Soups', labelFA: 'آش‌ها و سوپ‌ها', icon: '🍜' },
  { key: 'appetizer', label: 'Appetizers', labelFA: 'پیش غذا', icon: '🥗' },
  { key: 'dessert', label: 'Desserts', labelFA: 'دسرها', icon: '🍮' },
];

function AshpaziApp() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [search, setSearch] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [allRecipes, setAllRecipes] = useState(RECIPES);
  const [imgErrors, setImgErrors] = useState({});

  const filtered = allRecipes.filter((r) => {
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.nameFA.includes(search) || r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleImgError = (id) => setImgErrors({ ...imgErrors, [id]: true });

  const addComment = (recipeId) => {
    const text = (commentInputs[recipeId] || '').trim();
    if (!text) return;
    setAllRecipes(allRecipes.map((r) =>
      r.id === recipeId
        ? { ...r, comments: [...r.comments, { user: 'You', text, time: 'Just now' }] }
        : r
    ));
    setCommentInputs({ ...commentInputs, [recipeId]: '' });
  };

  // Detail view
  if (selectedRecipe) {
    const r = allRecipes.find((x) => x.id === selectedRecipe);
    if (!r) { setSelectedRecipe(null); return null; }
    const chef = CHEFS[r.chef];

    return (
      <div style={s.layout}>
        <Sidebar activeCategory={activeCategory} setActiveCategory={(c) => { setActiveCategory(c); setSelectedRecipe(null); }} allRecipes={allRecipes} imgErrors={imgErrors} handleImgError={handleImgError} onSelectRecipe={setSelectedRecipe} selectedRecipe={selectedRecipe} />
        <div style={s.main}>
          <button style={s.backBtn} onClick={() => setSelectedRecipe(null)}>{'←'} Back to recipes</button>

          <div style={s.detailHero}>
            {!imgErrors[r.id + '_detail'] ? (
              <img src={r.image} alt={r.name} style={s.detailImg} onError={() => handleImgError(r.id + '_detail')} />
            ) : (
              <div style={{ ...s.detailImgFallback, background: 'linear-gradient(135deg, #e91e63, #ff5722)' }}>
                <span style={{ fontSize: 80 }}>{r.emoji}</span>
              </div>
            )}
          </div>

          <div style={s.detailContent}>
            <div style={s.detailTitleRow}>
              <div>
                <h1 style={s.detailTitle}>{r.emoji} {r.name}</h1>
                <div style={s.detailTitleFA}>{r.nameFA}</div>
              </div>
              <div style={s.diffBadge(r.difficulty)}>{r.difficulty}</div>
            </div>

            <p style={s.detailDesc}>{r.description}</p>
            <p style={s.detailDescFA}>{r.descFA}</p>

            {chef && (
              <div style={s.chefCard}>
                <div style={s.chefAvatar}>{chef.name[0]}</div>
                <div>
                  <div style={s.chefName}>Recipe by {chef.name}</div>
                  <div style={s.chefNameFA}>{chef.nameFA} — {chef.title}</div>
                </div>
              </div>
            )}

            <div style={s.metaRow}>
              <div style={s.metaBox}><div style={s.metaLabel}>Time</div><div style={s.metaVal}>{r.time}</div></div>
              <div style={s.metaBox}><div style={s.metaLabel}>Servings</div><div style={s.metaVal}>{r.servings}</div></div>
              <div style={s.metaBox}><div style={s.metaLabel}>Category</div><div style={s.metaVal}>{r.category}</div></div>
            </div>

            <h2 style={s.secTitle}>{'🧂'} Ingredients / مواد لازم</h2>
            <div style={s.ingGrid}>
              {r.ingredients.map((ing, i) => (
                <div key={i} style={s.ingItem}>{ing}</div>
              ))}
            </div>

            <h2 style={s.secTitle}>{'👨‍🍳'} Steps / مراحل پخت</h2>
            <div style={s.stepsList}>
              {r.steps.map((step, i) => (
                <div key={i} style={s.stepRow}>
                  <div style={s.stepNum}>{i + 1}</div>
                  <div style={s.stepText}>{step}</div>
                </div>
              ))}
            </div>

            <h2 style={s.secTitle}>{'💬'} Comments / نظرات ({r.comments.length})</h2>
            <div style={s.commentBox}>
              {r.comments.length === 0 && <p style={s.noComments}>No comments yet. Be the first!</p>}
              {r.comments.map((c, i) => (
                <div key={i} style={s.comment}>
                  <div style={s.commentAvatar}>{c.user[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={s.commentHeader}>
                      <span style={s.commentUser}>{c.user}</span>
                      <span style={s.commentTime}>{c.time}</span>
                    </div>
                    <div style={s.commentText}>{c.text}</div>
                  </div>
                </div>
              ))}
              <div style={s.commentInputRow}>
                <input
                  style={s.commentInput}
                  placeholder="Add a comment..."
                  value={commentInputs[r.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [r.id]: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') addComment(r.id); }}
                />
                <button style={s.commentBtn} onClick={() => addComment(r.id)}>Post</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div style={s.layout}>
      <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} allRecipes={allRecipes} imgErrors={imgErrors} handleImgError={handleImgError} onSelectRecipe={setSelectedRecipe} selectedRecipe={selectedRecipe} />
      <div style={s.main}>
        <div style={s.topBar}>
          <div>
            <h1 style={s.pageTitle}>
              {CATEGORIES.find((c) => c.key === activeCategory)?.icon}{' '}
              {CATEGORIES.find((c) => c.key === activeCategory)?.label}
            </h1>
            <div style={s.pageTitleFA}>
              {CATEGORIES.find((c) => c.key === activeCategory)?.labelFA}
            </div>
          </div>
          <input
            style={s.searchInput}
            placeholder="Search / جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={s.grid}>
          {filtered.map((r) => (
            <div key={r.id} style={s.card} onClick={() => setSelectedRecipe(r.id)}>
              <div style={s.cardImg}>
                {!imgErrors[r.id] ? (
                  <img src={r.image} alt={r.name} style={s.img} onError={() => handleImgError(r.id)} />
                ) : (
                  <div style={{ ...s.imgFallback, background: 'linear-gradient(135deg, #e91e63, #9c27b0)' }}>
                    <span style={{ fontSize: 40 }}>{r.emoji}</span>
                  </div>
                )}
                <div style={s.cardBadge}>{r.category}</div>
              </div>
              <div style={s.cardBody}>
                <div style={s.cardTitle}>{r.emoji} {r.name}</div>
                <div style={s.cardFA}>{r.nameFA}</div>
                <div style={s.cardDesc}>{r.description}</div>
                <div style={s.cardFooter}>
                  <span>{'⏱'} {r.time}</span>
                  <span style={{ color: CHEFS[r.chef] ? '#ff9800' : '#777' }}>
                    {CHEFS[r.chef]?.name}
                  </span>
                  <span style={s.diffColor(r.difficulty)}>{r.difficulty}</span>
                </div>
                {r.comments.length > 0 && (
                  <div style={s.cardComments}>{'💬'} {r.comments.length} comment{r.comments.length > 1 ? 's' : ''}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <div style={s.empty}>No recipes found.</div>}

        <div style={s.chefsSection}>
          <h2 style={s.secTitle}>{'👨‍🍳'} Featured Chefs / سرآشپزهای برجسته</h2>
          <div style={s.chefsGrid}>
            {Object.values(CHEFS).map((chef) => (
              <div key={chef.name} style={s.chefGridCard}>
                <div style={s.chefGridAvatar}>{chef.name[0]}</div>
                <div style={s.chefGridName}>{chef.name}</div>
                <div style={s.chefGridFA}>{chef.nameFA}</div>
                <div style={s.chefGridTitle}>{chef.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={s.footer}>Nooshe jaan! ❤️ / نوش جان!</div>
      </div>
    </div>
  );
}

function Sidebar({ activeCategory, setActiveCategory, allRecipes, imgErrors, handleImgError, onSelectRecipe, selectedRecipe }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (key) => setExpanded({ ...expanded, [key]: !expanded[key] });

  return (
    <div style={s.sidebar}>
      <div style={s.sidebarHeader}>
        <a href="/" style={s.homeLink}>{'←'}</a>
        <div>
          <div style={s.sidebarTitle}>{'🍽️'} Ashpazi</div>
          <div style={s.sidebarSub}>آشپزی ایرانی</div>
        </div>
      </div>

      <div
        style={{ ...s.sideItem, background: activeCategory === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
        onClick={() => setActiveCategory('all')}
      >
        {'📖'} All Recipes
      </div>

      {CATEGORIES.filter((c) => c.key !== 'all').map((cat) => {
        const catRecipes = allRecipes.filter((r) => r.category === cat.key);
        const isOpen = expanded[cat.key];

        return (
          <div key={cat.key}>
            <div
              style={{
                ...s.sideItem,
                background: activeCategory === cat.key && !selectedRecipe ? 'rgba(255,255,255,0.1)' : 'transparent',
                fontWeight: 600,
              }}
            >
              <span onClick={() => toggle(cat.key)} style={{ cursor: 'pointer', marginRight: 4, fontSize: 10 }}>
                {isOpen ? '▼' : '▶'}
              </span>
              <span onClick={() => setActiveCategory(cat.key)} style={{ cursor: 'pointer', flex: 1 }}>
                {cat.icon} {cat.label}
              </span>
              <span style={s.catCount}>{catRecipes.length}</span>
            </div>

            {isOpen && catRecipes.map((r) => (
              <div
                key={r.id}
                style={{
                  ...s.sideSubItem,
                  background: selectedRecipe === r.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                }}
                onClick={() => onSelectRecipe(r.id)}
              >
                <div style={s.sideThumb}>
                  {!imgErrors['side_' + r.id] ? (
                    <img src={r.thumb} alt="" style={s.sideThumbImg} onError={() => handleImgError('side_' + r.id)} />
                  ) : (
                    <span style={{ fontSize: 14 }}>{r.emoji}</span>
                  )}
                </div>
                <span style={s.sideSubText}>{r.name}</span>
                <span style={{ fontSize: 10, color: '#ff9800', marginLeft: 'auto', flexShrink: 0 }}>{r.calories} kcal</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

const s = {
  layout: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', Arial, sans-serif" },
  // Sidebar
  sidebar: { width: 250, background: '#150d28', borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', flexShrink: 0 },
  sidebarHeader: { padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 },
  homeLink: { color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 18, padding: '4px 8px' },
  sidebarTitle: { color: '#fff', fontSize: 17, fontWeight: 700 },
  sidebarSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12, direction: 'rtl' },
  sideItem: { padding: '8px 14px', fontSize: 13, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, borderRadius: 4, margin: '1px 6px' },
  catCount: { marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', padding: '1px 7px', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  sideSubItem: { padding: '5px 14px 5px 30px', fontSize: 12, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 4, margin: '1px 6px' },
  sideThumb: { width: 24, height: 24, borderRadius: 4, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)' },
  sideThumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  sideSubText: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  // Main
  main: { flex: 1, overflowY: 'auto', padding: '24px 28px', color: '#fff', maxHeight: '100vh' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  pageTitle: { fontSize: 26, fontWeight: 700, margin: 0, color: '#fff' },
  pageTitleFA: { fontSize: 14, color: 'rgba(255,255,255,0.4)', direction: 'rtl' },
  searchInput: { padding: '10px 14px', fontSize: 14, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', outline: 'none', width: 250 },
  // Grid
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 },
  card: { background: 'rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' },
  cardImg: { height: 160, overflow: 'hidden', position: 'relative' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgFallback: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBadge: { position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', padding: '3px 9px', borderRadius: 10, fontSize: 10, color: '#fff', textTransform: 'uppercase', fontWeight: 600 },
  cardBody: { padding: '12px 14px 14px' },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#fff' },
  cardFA: { fontSize: 13, color: 'rgba(255,255,255,0.35)', direction: 'rtl', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  cardComments: { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6 },
  diffColor: (d) => ({ color: d === 'Easy' ? '#66bb6a' : d === 'Medium' ? '#ffa726' : '#ef5350' }),
  // Detail
  backBtn: { background: 'none', border: 'none', color: '#66bb6a', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 16 },
  detailHero: { height: 300, borderRadius: 14, overflow: 'hidden', marginBottom: 24 },
  detailImg: { width: '100%', height: '100%', objectFit: 'cover' },
  detailImgFallback: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  detailContent: { maxWidth: 700 },
  detailTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  detailTitle: { fontSize: 28, fontWeight: 700, margin: 0 },
  detailTitleFA: { fontSize: 18, color: 'rgba(255,255,255,0.4)', direction: 'rtl' },
  diffBadge: (d) => ({ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: d === 'Easy' ? '#1b5e20' : d === 'Medium' ? '#e65100' : '#b71c1c', color: '#fff' }),
  detailDesc: { fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 4 },
  detailDescFA: { fontSize: 14, color: 'rgba(255,255,255,0.4)', direction: 'rtl', marginBottom: 16 },
  chefCard: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 10, marginBottom: 20, border: '1px solid rgba(255,255,255,0.06)' },
  chefAvatar: { width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #ff9800, #e91e63)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#fff' },
  chefName: { fontSize: 14, fontWeight: 600, color: '#fff' },
  chefNameFA: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  metaRow: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  metaBox: { background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: 8, textAlign: 'center', flex: 1, minWidth: 80 },
  metaLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 2 },
  metaVal: { fontSize: 14, fontWeight: 600, color: '#fff', textTransform: 'capitalize' },
  secTitle: { fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.08)', marginTop: 24 },
  ingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6, marginBottom: 8 },
  ingItem: { fontSize: 13, color: 'rgba(255,255,255,0.65)', padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, borderLeft: '3px solid #ff9800' },
  stepsList: { marginBottom: 8 },
  stepRow: { display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  stepNum: { width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #e91e63, #ff5722)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  stepText: { fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, paddingTop: 3 },
  // Comments
  commentBox: { background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 16, border: '1px solid rgba(255,255,255,0.06)' },
  noComments: { color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', margin: '10px 0' },
  comment: { display: 'flex', gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.05)' },
  commentAvatar: { width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13, color: '#fff', flexShrink: 0 },
  commentHeader: { display: 'flex', gap: 8, alignItems: 'baseline' },
  commentUser: { fontWeight: 600, fontSize: 13, color: '#fff' },
  commentTime: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  commentText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, marginTop: 2 },
  commentInputRow: { display: 'flex', gap: 8, marginTop: 12 },
  commentInput: { flex: 1, padding: '8px 12px', fontSize: 13, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', outline: 'none' },
  commentBtn: { padding: '8px 16px', fontSize: 13, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 },
  // Chefs section
  chefsSection: { marginTop: 40 },
  chefsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 },
  chefGridCard: { background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 16, textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' },
  chefGridAvatar: { width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #ff9800, #e91e63)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#fff', margin: '0 auto 8px' },
  chefGridName: { fontSize: 13, fontWeight: 600, color: '#fff' },
  chefGridFA: { fontSize: 11, color: 'rgba(255,255,255,0.4)', direction: 'rtl' },
  chefGridTitle: { fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 },
  empty: { textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' },
  footer: { textAlign: 'center', marginTop: 40, padding: 20, fontSize: 14, color: 'rgba(255,255,255,0.25)' },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AshpaziApp />);
