const { useState, useMemo } = React;

var recipes = [
  {
    id: 1, name: 'Classic Pancakes', category: 'Breakfast', time: 20, difficulty: 'Easy', servings: 4,
    ingredients: ['2 cups all-purpose flour', '2 eggs', '1.5 cups milk', '3 tbsp butter (melted)', '2 tbsp sugar', '2 tsp baking powder', '0.5 tsp salt', 'Maple syrup for serving'],
    instructions: ['Mix flour, sugar, baking powder, and salt in a large bowl.', 'In a separate bowl, whisk eggs, milk, and melted butter.', 'Pour wet ingredients into dry and stir until just combined (lumps are okay).', 'Heat a non-stick pan over medium heat and lightly grease.', 'Pour 1/4 cup batter per pancake and cook until bubbles form on surface.', 'Flip and cook 1-2 more minutes until golden brown.', 'Serve with maple syrup and your favorite toppings.']
  },
  {
    id: 2, name: 'Avocado Toast', category: 'Breakfast', time: 10, difficulty: 'Easy', servings: 2,
    ingredients: ['2 slices sourdough bread', '1 ripe avocado', '1 tbsp lemon juice', 'Red pepper flakes', 'Salt and pepper', '2 eggs (optional)', 'Cherry tomatoes'],
    instructions: ['Toast the bread until golden and crispy.', 'Halve the avocado, remove pit, and scoop flesh into a bowl.', 'Mash avocado with lemon juice, salt, and pepper.', 'Spread mashed avocado evenly on toast slices.', 'Top with red pepper flakes and sliced cherry tomatoes.', 'Optionally, add a poached or fried egg on top.']
  },
  {
    id: 3, name: 'Caesar Salad', category: 'Lunch', time: 15, difficulty: 'Easy', servings: 2,
    ingredients: ['1 head romaine lettuce', '0.5 cup croutons', '0.25 cup parmesan cheese (shaved)', '2 tbsp Caesar dressing', '1 lemon', 'Black pepper', 'Anchovy fillets (optional)'],
    instructions: ['Wash and chop romaine lettuce into bite-sized pieces.', 'Place lettuce in a large serving bowl.', 'Add croutons and shaved parmesan.', 'Drizzle Caesar dressing over the salad.', 'Squeeze fresh lemon juice on top.', 'Toss gently to combine.', 'Top with fresh black pepper and optional anchovy fillets.']
  },
  {
    id: 4, name: 'Grilled Chicken Wrap', category: 'Lunch', time: 25, difficulty: 'Medium', servings: 2,
    ingredients: ['2 chicken breasts', '2 large flour tortillas', '1 cup mixed greens', '1 tomato (diced)', '0.5 cup shredded cheese', 'Sour cream', 'Salt, pepper, paprika'],
    instructions: ['Season chicken with salt, pepper, and paprika.', 'Grill chicken on medium-high heat for 6-7 minutes per side.', 'Let chicken rest for 5 minutes then slice into strips.', 'Warm tortillas in a dry pan for 30 seconds each side.', 'Layer greens, chicken, tomato, and cheese on each tortilla.', 'Add a dollop of sour cream.', 'Fold sides in and roll tightly to form a wrap.']
  },
  {
    id: 5, name: 'Spaghetti Bolognese', category: 'Dinner', time: 45, difficulty: 'Medium', servings: 4,
    ingredients: ['400g spaghetti', '500g ground beef', '1 onion (diced)', '3 cloves garlic', '400g crushed tomatoes', '2 tbsp tomato paste', 'Olive oil', 'Italian seasoning', 'Salt and pepper', 'Parmesan cheese'],
    instructions: ['Cook spaghetti according to package directions. Drain and set aside.', 'Heat olive oil in a large pan. Cook onion until soft, about 5 minutes.', 'Add garlic and cook for 1 minute.', 'Add ground beef and cook until browned, breaking it apart.', 'Stir in crushed tomatoes, tomato paste, and Italian seasoning.', 'Simmer sauce on low for 20 minutes, stirring occasionally.', 'Season with salt and pepper to taste.', 'Serve sauce over spaghetti with grated parmesan.']
  },
  {
    id: 6, name: 'Teriyaki Salmon', category: 'Dinner', time: 30, difficulty: 'Medium', servings: 2,
    ingredients: ['2 salmon fillets', '3 tbsp soy sauce', '2 tbsp honey', '1 tbsp rice vinegar', '1 clove garlic (minced)', '1 tsp ginger (grated)', 'Sesame seeds', 'Green onions', 'Steamed rice for serving'],
    instructions: ['Mix soy sauce, honey, rice vinegar, garlic, and ginger for the teriyaki glaze.', 'Pat salmon fillets dry and season with salt.', 'Heat oil in a pan over medium-high heat.', 'Place salmon skin-side up and cook 4 minutes until golden.', 'Flip salmon and pour teriyaki glaze into the pan.', 'Cook 3-4 more minutes, spooning glaze over the fish.', 'Garnish with sesame seeds and sliced green onions.', 'Serve over steamed rice.']
  },
  {
    id: 7, name: 'Beef Tacos', category: 'Dinner', time: 25, difficulty: 'Easy', servings: 4,
    ingredients: ['500g ground beef', '1 packet taco seasoning', 'Small flour or corn tortillas', '1 cup shredded lettuce', '1 tomato (diced)', 'Shredded cheese', 'Sour cream', 'Salsa', 'Lime wedges'],
    instructions: ['Brown ground beef in a large skillet over medium-high heat.', 'Drain excess fat and add taco seasoning with water per packet directions.', 'Simmer for 5 minutes until sauce thickens.', 'Warm tortillas in a dry pan or microwave.', 'Assemble tacos with beef, lettuce, tomato, and cheese.', 'Top with sour cream, salsa, and a squeeze of lime.']
  },
  {
    id: 8, name: 'Chocolate Lava Cake', category: 'Dessert', time: 20, difficulty: 'Hard', servings: 2,
    ingredients: ['100g dark chocolate', '100g butter', '2 eggs', '2 egg yolks', '50g sugar', '2 tbsp flour', 'Butter and cocoa for ramekins', 'Vanilla ice cream for serving'],
    instructions: ['Preheat oven to 220C (425F). Butter and dust ramekins with cocoa powder.', 'Melt chocolate and butter together in a double boiler or microwave.', 'Whisk eggs, egg yolks, and sugar until thick and pale.', 'Fold the melted chocolate mixture into the egg mixture.', 'Gently fold in the flour until just combined.', 'Divide batter between prepared ramekins.', 'Bake for 12-14 minutes until edges are firm but center jiggles.', 'Let sit for 1 minute, then invert onto plates.', 'Serve immediately with vanilla ice cream.']
  },
  {
    id: 9, name: 'Tiramisu', category: 'Dessert', time: 40, difficulty: 'Hard', servings: 6,
    ingredients: ['250g mascarpone cheese', '3 eggs (separated)', '75g sugar', '300ml strong espresso (cooled)', '2 tbsp coffee liqueur', '200g ladyfinger biscuits', 'Cocoa powder', 'Dark chocolate shavings'],
    instructions: ['Whisk egg yolks with sugar until thick and creamy.', 'Add mascarpone and mix until smooth.', 'In a clean bowl, whisk egg whites to stiff peaks.', 'Gently fold egg whites into the mascarpone mixture.', 'Combine cooled espresso with coffee liqueur in a shallow dish.', 'Briefly dip each ladyfinger in the coffee mixture (do not soak).', 'Arrange a layer of dipped ladyfingers in a dish.', 'Spread half the mascarpone cream over the ladyfingers.', 'Repeat with another layer of ladyfingers and cream.', 'Refrigerate for at least 4 hours or overnight.', 'Dust with cocoa powder and chocolate shavings before serving.']
  },
  {
    id: 10, name: 'Mushroom Risotto', category: 'Dinner', time: 40, difficulty: 'Medium', servings: 4,
    ingredients: ['1.5 cups Arborio rice', '300g mixed mushrooms', '1 onion (diced)', '2 cloves garlic', '5 cups warm vegetable stock', '0.5 cup white wine', '0.5 cup parmesan (grated)', '2 tbsp butter', 'Fresh thyme', 'Olive oil'],
    instructions: ['Slice mushrooms and saute in olive oil until golden. Set aside.', 'In the same pan, cook onion in butter until soft.', 'Add garlic and rice, stir for 2 minutes until rice is translucent.', 'Pour in white wine and stir until absorbed.', 'Add warm stock one ladle at a time, stirring frequently.', 'Continue adding stock and stirring for about 18-20 minutes.', 'When rice is creamy and al dente, stir in mushrooms.', 'Add parmesan, remaining butter, and fresh thyme.', 'Season with salt and pepper. Serve immediately.']
  }
];

var categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];

function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [servingsMultiplier, setServingsMultiplier] = useState(1);

  var filtered = useMemo(function() {
    var q = search.toLowerCase();
    return recipes.filter(function(r) {
      var matchesCat = category === 'All' || r.category === category;
      var matchesSearch = r.name.toLowerCase().includes(q) || r.ingredients.some(function(ing) { return ing.toLowerCase().includes(q); });
      return matchesCat && matchesSearch;
    });
  }, [search, category]);

  var difficultyColor = function(d) {
    if (d === 'Easy') return '#22c55e';
    if (d === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  var categoryColor = function(c) {
    var colors = { Breakfast: '#f59e0b', Lunch: '#22c55e', Dinner: '#6366f1', Dessert: '#ec4899' };
    return colors[c] || '#8b5cf6';
  };

  var categoryIcon = function(c) {
    var icons = { Breakfast: '\u2600', Lunch: '\u2606', Dinner: '\u263D', Dessert: '\u2665' };
    return icons[c] || '\u2605';
  };

  var openRecipe = function(recipe) {
    setSelectedRecipe(recipe);
    setServingsMultiplier(1);
  };

  var styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' },
    backLink: { color: '#8888ff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' },
    title: { textAlign: 'center', fontSize: '32px', marginBottom: '10px', color: '#ffffff' },
    subtitle: { textAlign: 'center', fontSize: '16px', color: '#aaa', marginBottom: '25px' },
    controls: { maxWidth: '900px', margin: '0 auto 25px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
    searchInput: { flex: 1, minWidth: '200px', padding: '10px 16px', fontSize: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#e0e0ff', outline: 'none' },
    filterBtn: { padding: '8px 16px', fontSize: '13px', border: '2px solid transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s' },
    grid: { maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' },
    card: { background: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.3s' },
    cardIcon: { fontSize: '36px', marginBottom: '12px' },
    cardName: { fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '10px' },
    badgeRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' },
    badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
    cardIngredients: { fontSize: '12px', color: '#888', lineHeight: '1.5' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    modal: { background: 'linear-gradient(135deg, #0f0f2e, #1a1a3e)', borderRadius: '20px', padding: '30px', maxWidth: '650px', width: '100%', maxHeight: '85vh', overflow: 'auto', border: '1px solid rgba(255,255,255,0.15)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
    modalTitle: { fontSize: '26px', fontWeight: 'bold', color: '#fff' },
    closeBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#aaa', fontSize: '20px', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    servingsRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' },
    servingsLabel: { fontSize: '14px', color: '#aaa' },
    servingsBtn: { width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#ddd', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    servingsValue: { fontSize: '18px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' },
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '12px', marginTop: '20px' },
    ingredientList: { listStyle: 'none', padding: 0, margin: 0 },
    ingredientItem: { padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px', color: '#c0c0e0', display: 'flex', alignItems: 'center', gap: '8px' },
    stepList: { padding: 0, margin: 0, counterReset: 'step' },
    stepItem: { padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px', color: '#c0c0e0', lineHeight: '1.6', display: 'flex', gap: '12px' },
    stepNum: { width: '28px', height: '28px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0, marginTop: '2px' },
    count: { textAlign: 'center', color: '#666', marginBottom: '18px', fontSize: '14px' }
  };

  return React.createElement('div', { style: styles.container },
    selectedRecipe && React.createElement('div', { style: styles.overlay, onClick: function() { setSelectedRecipe(null); } },
      React.createElement('div', { style: styles.modal, onClick: function(e) { e.stopPropagation(); } },
        React.createElement('div', { style: styles.modalHeader },
          React.createElement('div', null,
            React.createElement('div', { style: styles.modalTitle }, selectedRecipe.name),
            React.createElement('div', { style: { display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' } },
              React.createElement('span', { style: Object.assign({}, styles.badge, { background: categoryColor(selectedRecipe.category) + '30', color: categoryColor(selectedRecipe.category) }) }, selectedRecipe.category),
              React.createElement('span', { style: Object.assign({}, styles.badge, { background: difficultyColor(selectedRecipe.difficulty) + '30', color: difficultyColor(selectedRecipe.difficulty) }) }, selectedRecipe.difficulty),
              React.createElement('span', { style: Object.assign({}, styles.badge, { background: 'rgba(255,255,255,0.1)', color: '#aaa' }) }, selectedRecipe.time + ' min')
            )
          ),
          React.createElement('button', { onClick: function() { setSelectedRecipe(null); }, style: styles.closeBtn }, '\u2715')
        ),

        React.createElement('div', { style: styles.servingsRow },
          React.createElement('span', { style: styles.servingsLabel }, 'Servings:'),
          React.createElement('button', {
            onClick: function() { setServingsMultiplier(function(p) { return Math.max(0.5, p - 0.5); }); },
            style: styles.servingsBtn
          }, '-'),
          React.createElement('span', { style: styles.servingsValue }, Math.round(selectedRecipe.servings * servingsMultiplier)),
          React.createElement('button', {
            onClick: function() { setServingsMultiplier(function(p) { return p + 0.5; }); },
            style: styles.servingsBtn
          }, '+'),
          servingsMultiplier !== 1 && React.createElement('span', { style: { fontSize: '12px', color: '#888' } }, '(' + servingsMultiplier + 'x original)')
        ),

        React.createElement('div', { style: styles.sectionTitle }, 'Ingredients'),
        React.createElement('ul', { style: styles.ingredientList },
          selectedRecipe.ingredients.map(function(ing, i) {
            return React.createElement('li', { key: i, style: styles.ingredientItem },
              React.createElement('span', { style: { color: '#8b5cf6' } }, '\u2022'),
              ing
            );
          })
        ),

        React.createElement('div', { style: styles.sectionTitle }, 'Instructions'),
        React.createElement('ol', { style: styles.stepList },
          selectedRecipe.instructions.map(function(step, i) {
            return React.createElement('li', { key: i, style: styles.stepItem },
              React.createElement('span', { style: styles.stepNum }, i + 1),
              React.createElement('span', null, step)
            );
          })
        )
      )
    ),

    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, 'Recipe Finder'),
    React.createElement('p', { style: styles.subtitle }, 'Search by name or ingredient, filter by category'),

    React.createElement('div', { style: styles.controls },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Search recipes or ingredients...',
        value: search,
        onChange: function(e) { setSearch(e.target.value); },
        style: styles.searchInput
      }),
      categories.map(function(cat) {
        var active = category === cat;
        var color = cat === 'All' ? '#8b5cf6' : categoryColor(cat);
        return React.createElement('button', {
          key: cat,
          onClick: function() { setCategory(cat); },
          style: Object.assign({}, styles.filterBtn, {
            background: active ? color + '30' : 'rgba(255,255,255,0.06)',
            color: active ? color : '#888',
            borderColor: active ? color : 'transparent'
          })
        }, cat);
      })
    ),

    React.createElement('div', { style: styles.count }, filtered.length + ' recipe' + (filtered.length !== 1 ? 's' : '') + ' found'),

    React.createElement('div', { style: styles.grid },
      filtered.map(function(recipe) {
        return React.createElement('div', { key: recipe.id, style: styles.card, onClick: function() { openRecipe(recipe); } },
          React.createElement('div', { style: Object.assign({}, styles.cardIcon, { color: categoryColor(recipe.category) }) }, categoryIcon(recipe.category)),
          React.createElement('div', { style: styles.cardName }, recipe.name),
          React.createElement('div', { style: styles.badgeRow },
            React.createElement('span', { style: Object.assign({}, styles.badge, { background: categoryColor(recipe.category) + '30', color: categoryColor(recipe.category) }) }, recipe.category),
            React.createElement('span', { style: Object.assign({}, styles.badge, { background: difficultyColor(recipe.difficulty) + '30', color: difficultyColor(recipe.difficulty) }) }, recipe.difficulty),
            React.createElement('span', { style: Object.assign({}, styles.badge, { background: 'rgba(255,255,255,0.08)', color: '#aaa' }) }, recipe.time + ' min'),
            React.createElement('span', { style: Object.assign({}, styles.badge, { background: 'rgba(255,255,255,0.08)', color: '#aaa' }) }, recipe.servings + ' servings')
          ),
          React.createElement('div', { style: styles.cardIngredients },
            recipe.ingredients.slice(0, 4).join(', ') + (recipe.ingredients.length > 4 ? ', +' + (recipe.ingredients.length - 4) + ' more' : '')
          )
        );
      })
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
