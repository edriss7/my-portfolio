const { useState, useMemo, useCallback, useRef, useEffect } = React;

var recipes = [
  {id:1,name:"Paneer Tikka Masala Bites",category:"Paneer & Cheese",prepTime:4,cookTime:8,emoji:"\uD83C\uDF5B",gradient:["#f6d365","#fda085"],ingredients:["200g paneer cubed","2 tbsp Greek yogurt","1 tsp tikka masala spice","1/2 tsp turmeric","1 tbsp ghee","1/4 cup diced bell pepper"],steps:["Cut paneer into bite-sized cubes.","Mix yogurt with tikka masala spice and turmeric.","Coat paneer cubes in the marinade.","Heat ghee in a skillet over medium-high heat.","Add paneer and bell pepper, cook 4 minutes per side.","Serve hot with a squeeze of lemon."],nutrition:{calories:310,protein:22,carbs:6,fat:22,sodium:340,sugar:3,fiber:1}},
  {id:2,name:"Cottage Cheese Spinach Skillet",category:"Paneer & Cheese",prepTime:3,cookTime:5,emoji:"\uD83C\uDF73",gradient:["#a8e063","#56ab2f"],ingredients:["1 cup low-fat cottage cheese","1 cup fresh spinach","1/2 cup sliced mushrooms","1 tbsp butter","1 tbsp nutritional yeast","Black pepper to taste"],steps:["Melt butter in a skillet over medium heat.","Add mushrooms and cook 2 minutes until soft.","Add spinach and stir until wilted, about 1 minute.","Add cottage cheese and nutritional yeast to the pan.","Stir gently for 2 minutes until warmed through.","Season with pepper and serve immediately."],nutrition:{calories:280,protein:28,carbs:8,fat:14,sodium:350,sugar:4,fiber:1}},
  {id:3,name:"Broccoli Cheddar Paneer Bake",category:"Paneer & Cheese",prepTime:4,cookTime:8,emoji:"\uD83E\uDD58",gradient:["#f7971e","#ffd200"],ingredients:["150g paneer cubed small","1 cup broccoli florets chopped small","3 tbsp shredded cheddar","1 tbsp olive oil","1/4 tsp garlic powder","Salt and pepper to taste"],steps:["Preheat broiler on high.","Heat olive oil in oven-safe skillet over medium heat.","Add broccoli and cook 2 minutes.","Add paneer cubes with garlic powder, salt and pepper.","Cook 4 minutes, stirring occasionally until paneer is golden.","Top with cheddar, broil 2 minutes until melted and golden."],nutrition:{calories:320,protein:24,carbs:6,fat:22,sodium:370,sugar:2,fiber:2}},
  {id:4,name:"Ricotta Stuffed Pepper Cups",category:"Paneer & Cheese",prepTime:3,cookTime:7,emoji:"\uD83C\uDF7D",gradient:["#ff5858","#f09819"],ingredients:["3/4 cup part-skim ricotta","2 bell pepper halves","2 tbsp diced tomato","1 tbsp chopped chives","1/2 tsp smoked paprika","Cooking spray"],steps:["Preheat oven to 400F.","Place pepper halves cut-side up on a baking sheet.","Mix ricotta with paprika until smooth.","Spoon ricotta mixture into pepper cups.","Top with diced tomato and chives.","Bake 7 minutes until peppers are tender."],nutrition:{calories:195,protein:16,carbs:8,fat:11,sodium:300,sugar:5,fiber:2}},
  {id:5,name:"Herbed Paneer Muffin Bites",category:"Paneer & Cheese",prepTime:4,cookTime:10,emoji:"\uD83C\uDF71",gradient:["#56ab2f","#a8e063"],ingredients:["150g paneer grated","1/4 cup diced zucchini","2 tbsp fresh basil chopped","2 tbsp sun-dried tomatoes chopped","1 tbsp parmesan","Cooking spray"],steps:["Preheat oven to 375F and spray muffin tin.","Mix grated paneer with basil and parmesan.","Divide zucchini and sun-dried tomatoes among 4 muffin cups.","Press paneer mixture evenly into cups over vegetables.","Bake 10 minutes until golden on top.","Let cool 1 minute before removing."],nutrition:{calories:270,protein:21,carbs:5,fat:18,sodium:350,sugar:3,fiber:1}},
  {id:6,name:"Avocado Paneer Scramble",category:"Paneer & Cheese",prepTime:3,cookTime:4,emoji:"\uD83C\uDF73",gradient:["#11998e","#38ef7d"],ingredients:["150g paneer crumbled","1/4 medium avocado diced","1 tbsp chopped cilantro","1/2 tsp cumin","1 tbsp coconut oil","Pinch of red pepper flakes"],steps:["Crumble paneer and season with cumin and red pepper flakes.","Heat coconut oil in a skillet over medium heat.","Add paneer crumbles and stir gently as they warm.","When paneer is golden, fold in diced avocado.","Remove from heat and top with cilantro.","Serve immediately while warm."],nutrition:{calories:310,protein:20,carbs:4,fat:24,sodium:280,sugar:1,fiber:2}},
  {id:7,name:"Swiss Chard Cheese Wrap",category:"Paneer & Cheese",prepTime:3,cookTime:5,emoji:"\uD83C\uDF2F",gradient:["#fc4a1a","#f7b733"],ingredients:["100g paneer crumbled","2 large Swiss chard leaves","1 tbsp cream cheese","1/2 tsp everything bagel seasoning","1 tbsp olive oil","1 tbsp diced red onion"],steps:["Heat olive oil in a pan over medium heat.","Saute red onion for 1 minute.","Add Swiss chard leaves and wilt for 30 seconds, remove.","Cook paneer crumbles with everything seasoning for 2 minutes.","Spread cream cheese on chard leaves.","Fill chard leaves with seasoned paneer and roll up."],nutrition:{calories:280,protein:19,carbs:4,fat:21,sodium:340,sugar:1,fiber:1}},
  {id:8,name:"Halloumi Tomato Skillet",category:"Paneer & Cheese",prepTime:2,cookTime:5,emoji:"\uD83E\uDD58",gradient:["#f5af19","#f12711"],ingredients:["150g halloumi sliced","3 tbsp cottage cheese","1/4 cup diced tomato","1 tbsp fresh dill","1 tbsp butter","Black pepper to taste"],steps:["Slice halloumi into thin pieces.","Melt butter in a non-stick pan over medium heat.","Cook halloumi slices 2 minutes per side until golden.","Add cottage cheese and diced tomato to the pan.","Stir gently for 1 minute until warmed through.","Garnish with fresh dill, season with pepper and serve."],nutrition:{calories:320,protein:24,carbs:4,fat:23,sodium:390,sugar:2,fiber:0}},
  {id:9,name:"Pesto Mozzarella Stack",category:"Paneer & Cheese",prepTime:3,cookTime:5,emoji:"\uD83C\uDF7D",gradient:["#2af598","#009efd"],ingredients:["100g fresh mozzarella sliced","1 tbsp basil pesto","2 thick tomato slices","1 tbsp parmesan shaved","1 tbsp olive oil","Fresh basil leaves"],steps:["Heat olive oil in a pan and warm mozzarella slices for 1 minute.","Place tomato slices on a plate.","Stack mozzarella on top of tomato slices.","Drizzle pesto over the cheese.","Top with shaved parmesan.","Garnish with fresh basil leaves."],nutrition:{calories:295,protein:18,carbs:5,fat:23,sodium:360,sugar:3,fiber:1}},
  {id:10,name:"Turmeric Paneer Crumble",category:"Paneer & Cheese",prepTime:2,cookTime:4,emoji:"\uD83C\uDF5B",gradient:["#f7971e","#ffd200"],ingredients:["150g paneer crumbled","1/2 tsp turmeric","1 tbsp coconut milk","1 tbsp ghee","1/4 tsp black pepper","1 tbsp chopped scallions"],steps:["Crumble paneer and mix with turmeric, coconut milk and black pepper.","Heat ghee in a non-stick pan over medium-low heat.","Add paneer mixture to the pan.","Stir slowly with a spatula as paneer warms, about 3 minutes.","Remove from heat while still soft and creamy.","Top with chopped scallions and serve."],nutrition:{calories:290,protein:20,carbs:3,fat:22,sodium:280,sugar:1,fiber:0}},
  {id:11,name:"Jalapeno Cheese Bites",category:"Paneer & Cheese",prepTime:4,cookTime:10,emoji:"\uD83C\uDF71",gradient:["#00b09b","#96c93d"],ingredients:["150g paneer grated","2 tbsp diced jalapeno","2 tbsp cream cheese","1/4 tsp onion powder","Cooking spray","Pinch of cayenne"],steps:["Preheat oven to 375F and spray a mini muffin tin.","Mix grated paneer with cream cheese, onion powder and cayenne.","Divide diced jalapeno among 8 muffin cups.","Press paneer mixture evenly into cups.","Bake 10 minutes until golden on top.","Let cool 2 minutes before removing."],nutrition:{calories:275,protein:20,carbs:3,fat:20,sodium:310,sugar:1,fiber:0}},
  {id:12,name:"Mediterranean Halloumi Skillet",category:"Paneer & Cheese",prepTime:3,cookTime:7,emoji:"\uD83C\uDF73",gradient:["#667eea","#764ba2"],ingredients:["150g halloumi cubed","1/4 cup artichoke hearts chopped","2 tbsp kalamata olives sliced","1 tbsp sun-dried tomatoes","1 tbsp olive oil","1/2 tsp oregano"],steps:["Heat olive oil in a skillet over medium heat.","Add artichoke hearts and sun-dried tomatoes, cook 1 minute.","Add olives and oregano, stir briefly.","Add halloumi cubes to the skillet.","Cook 3 minutes per side until golden and crispy.","Serve directly from the skillet."],nutrition:{calories:330,protein:21,carbs:7,fat:25,sodium:390,sugar:2,fiber:2}},
  {id:13,name:"Crispy Tofu Stir-Fry",category:"Tofu & Tempeh",prepTime:5,cookTime:8,emoji:"\uD83E\uDD58",gradient:["#f093fb","#f5576c"],ingredients:["200g extra-firm tofu cubed","1 cup snap peas","1 tbsp soy sauce (low sodium)","1 tsp sesame oil","1 tbsp avocado oil","1/2 tsp ginger grated"],steps:["Press tofu and cut into small cubes.","Heat avocado oil in a wok over high heat.","Add tofu cubes and cook 4 minutes until golden on all sides.","Add snap peas and ginger, stir-fry 2 minutes.","Drizzle soy sauce and sesame oil.","Toss to coat and serve immediately."],nutrition:{calories:280,protein:22,carbs:10,fat:18,sodium:350,sugar:4,fiber:3}},
  {id:14,name:"Sesame Tempeh Strips",category:"Tofu & Tempeh",prepTime:4,cookTime:7,emoji:"\uD83C\uDF73",gradient:["#a18cd1","#fbc2eb"],ingredients:["200g tempeh sliced thin","1 tbsp sesame seeds","1 tbsp tamari","1 tsp rice vinegar","1 tbsp coconut oil","1/2 tsp garlic powder"],steps:["Slice tempeh into thin strips.","Mix tamari, rice vinegar and garlic powder.","Heat coconut oil in a pan over medium-high heat.","Add tempeh strips and cook 3 minutes per side.","Pour sauce over tempeh in the last minute.","Sprinkle with sesame seeds and serve."],nutrition:{calories:310,protein:24,carbs:12,fat:20,sodium:380,sugar:2,fiber:4}},
  {id:15,name:"Tofu Scramble Bowl",category:"Tofu & Tempeh",prepTime:4,cookTime:6,emoji:"\uD83C\uDF5B",gradient:["#ffecd2","#fcb69f"],ingredients:["200g firm tofu crumbled","1/2 cup spinach","2 tbsp nutritional yeast","1/2 tsp turmeric","1 tbsp olive oil","1/4 tsp black salt"],steps:["Heat olive oil in a skillet over medium heat.","Crumble tofu into the pan.","Add turmeric and black salt, stir well.","Cook 3 minutes, stirring occasionally.","Add spinach and nutritional yeast, cook 2 minutes.","Serve hot as a breakfast bowl."],nutrition:{calories:260,protein:22,carbs:6,fat:17,sodium:320,sugar:1,fiber:2}},
  {id:16,name:"Spicy Tempeh Crumble",category:"Tofu & Tempeh",prepTime:3,cookTime:7,emoji:"\uD83C\uDF5B",gradient:["#ff6a00","#ee0979"],ingredients:["200g tempeh crumbled","1 tsp chili flakes","1 tbsp tomato paste","1 tsp cumin","1 tbsp olive oil","2 tbsp water"],steps:["Crumble tempeh into small pieces.","Heat olive oil in a skillet over medium-high heat.","Add tempeh crumbles and cook 3 minutes.","Add tomato paste, chili flakes, cumin and water.","Stir well and cook 3 more minutes.","Serve hot over greens or as a side."],nutrition:{calories:290,protein:23,carbs:11,fat:18,sodium:280,sugar:2,fiber:4}},
  {id:17,name:"Garlic Tofu Bites",category:"Tofu & Tempeh",prepTime:4,cookTime:8,emoji:"\uD83C\uDF71",gradient:["#d299c2","#fef9d7"],ingredients:["200g extra-firm tofu cubed","3 cloves garlic minced","1 tbsp soy sauce (low sodium)","1 tsp cornstarch","1 tbsp avocado oil","1/4 tsp white pepper"],steps:["Cut tofu into bite-sized cubes and toss with cornstarch.","Heat avocado oil in a pan over high heat.","Add tofu and cook 5 minutes, turning for even browning.","Add minced garlic, cook 1 minute until fragrant.","Drizzle soy sauce and white pepper.","Toss to coat evenly and serve."],nutrition:{calories:250,protein:20,carbs:8,fat:16,sodium:350,sugar:1,fiber:1}},
  {id:18,name:"Tempeh Lettuce Wraps",category:"Tofu & Tempeh",prepTime:4,cookTime:6,emoji:"\uD83C\uDF2F",gradient:["#96fbc4","#f9f586"],ingredients:["150g tempeh diced small","4 butter lettuce leaves","1 tbsp hoisin sauce","1 tsp sesame oil","1 tbsp peanuts crushed","1/4 cup diced cucumber"],steps:["Dice tempeh into small pieces.","Heat sesame oil in a pan over medium-high heat.","Cook tempeh 4 minutes until browned.","Toss with hoisin sauce.","Spoon tempeh into lettuce cups.","Top with cucumber and crushed peanuts."],nutrition:{calories:285,protein:21,carbs:14,fat:17,sodium:350,sugar:5,fiber:3}},
  {id:19,name:"Lemon Herb Tofu Steaks",category:"Tofu & Tempeh",prepTime:4,cookTime:8,emoji:"\uD83C\uDF7D",gradient:["#f6d365","#fda085"],ingredients:["250g extra-firm tofu sliced thick","1 tbsp lemon juice","1 tsp dried herbs de provence","1 tbsp olive oil","1 clove garlic minced","Zest of half a lemon"],steps:["Slice tofu into 2 thick steaks and pat dry.","Mix lemon juice, herbs, garlic and zest.","Heat olive oil in a pan over medium-high heat.","Cook tofu steaks 3 minutes per side until golden.","Pour lemon herb sauce over tofu.","Cook 1 more minute and serve."],nutrition:{calories:245,protein:20,carbs:4,fat:17,sodium:220,sugar:1,fiber:1}},
  {id:20,name:"BBQ Tempeh Sliders",category:"Tofu & Tempeh",prepTime:4,cookTime:7,emoji:"\uD83C\uDF54",gradient:["#c94b4b","#4b134f"],ingredients:["200g tempeh sliced into rounds","2 tbsp sugar-free BBQ sauce","1 tbsp avocado oil","4 large romaine leaves","2 tbsp pickled jalapenos","1/4 tsp smoked paprika"],steps:["Slice tempeh into round patty shapes.","Heat avocado oil in a pan over medium-high heat.","Cook tempeh rounds 3 minutes per side.","Brush BBQ sauce on each side, cook 30 seconds more.","Place each tempeh round on a romaine leaf.","Top with pickled jalapenos and serve."],nutrition:{calories:295,protein:22,carbs:13,fat:18,sodium:370,sugar:4,fiber:3}},
  {id:21,name:"Coconut Curry Tofu",category:"Tofu & Tempeh",prepTime:4,cookTime:8,emoji:"\uD83C\uDF5B",gradient:["#f7971e","#ffd200"],ingredients:["200g firm tofu cubed","3 tbsp coconut cream","1 tsp curry powder","1/2 cup baby spinach","1 tbsp coconut oil","1/4 tsp turmeric"],steps:["Cube tofu and pat dry.","Heat coconut oil in a pan over medium-high heat.","Cook tofu 4 minutes until golden.","Add curry powder and turmeric, stir 30 seconds.","Pour in coconut cream and add spinach.","Simmer 2 minutes until spinach wilts, serve."],nutrition:{calories:310,protein:20,carbs:7,fat:23,sodium:250,sugar:2,fiber:2}},
  {id:22,name:"Teriyaki Tempeh Bowl",category:"Tofu & Tempeh",prepTime:4,cookTime:7,emoji:"\uD83C\uDF71",gradient:["#ee9ca7","#ffdde1"],ingredients:["200g tempeh sliced","1 tbsp low-sodium teriyaki sauce","1 cup shredded cabbage","1 tsp sesame seeds","1 tbsp avocado oil","1/4 cup edamame shelled"],steps:["Slice tempeh into thin strips.","Heat avocado oil in a pan over medium-high heat.","Cook tempeh strips 3 minutes per side.","Add teriyaki sauce and toss to coat.","Arrange shredded cabbage in a bowl, top with tempeh.","Garnish with edamame and sesame seeds."],nutrition:{calories:320,protein:26,carbs:14,fat:19,sodium:380,sugar:5,fiber:4}},
  {id:23,name:"Smoked Tofu Medallions",category:"Tofu & Tempeh",prepTime:3,cookTime:6,emoji:"\uD83C\uDF73",gradient:["#b79891","#94716b"],ingredients:["200g smoked tofu sliced","1 tsp smoked paprika","1 tbsp olive oil","1 tbsp balsamic vinegar","1/2 tsp garlic powder","Fresh parsley for garnish"],steps:["Slice smoked tofu into medallion rounds.","Mix smoked paprika and garlic powder.","Heat olive oil in pan over medium-high heat.","Cook tofu medallions 2 minutes per side.","Drizzle balsamic vinegar over medallions.","Garnish with fresh parsley."],nutrition:{calories:240,protein:20,carbs:5,fat:16,sodium:290,sugar:2,fiber:1}},
  {id:24,name:"Peanut Tempeh Satay",category:"Tofu & Tempeh",prepTime:4,cookTime:7,emoji:"\uD83E\uDD58",gradient:["#c2e59c","#64b3f4"],ingredients:["200g tempeh cut into strips","1 tbsp natural peanut butter","1 tsp tamari","1 tsp lime juice","1 tbsp coconut oil","Pinch of cayenne pepper"],steps:["Cut tempeh into strips.","Mix peanut butter, tamari, lime juice and cayenne.","Heat coconut oil over medium-high heat.","Cook tempeh strips 3 minutes per side.","Pour peanut sauce over tempeh.","Toss to coat and serve hot."],nutrition:{calories:330,protein:25,carbs:11,fat:22,sodium:360,sugar:3,fiber:3}},
  {id:25,name:"Quick Lentil Soup",category:"Legume/Bean-based",prepTime:3,cookTime:12,emoji:"\uD83C\uDF72",gradient:["#f2994a","#f2c94c"],ingredients:["1/2 cup red lentils rinsed","1 cup vegetable broth low sodium","1/4 cup diced onion","1 clove garlic minced","1 tsp cumin","1 tbsp olive oil"],steps:["Heat olive oil in a pot over medium heat.","Saute onion and garlic 2 minutes.","Add cumin and stir 30 seconds.","Add lentils and broth, bring to a boil.","Reduce heat and simmer 8-9 minutes until tender.","Season to taste and serve."],nutrition:{calories:280,protein:18,carbs:24,fat:9,sodium:350,sugar:3,fiber:7}},
  {id:26,name:"Chickpea Spinach Saute",category:"Legume/Bean-based",prepTime:3,cookTime:6,emoji:"\uD83E\uDD58",gradient:["#a8e063","#56ab2f"],ingredients:["1 cup canned chickpeas drained","2 cups fresh spinach","2 cloves garlic minced","1 tbsp olive oil","1/2 tsp smoked paprika","1 tbsp lemon juice"],steps:["Heat olive oil in a skillet over medium heat.","Add garlic and cook 30 seconds.","Add chickpeas and smoked paprika, cook 3 minutes.","Add spinach and stir until wilted, about 2 minutes.","Squeeze lemon juice over the dish.","Serve hot as a quick protein bowl."],nutrition:{calories:265,protein:15,carbs:24,fat:12,sodium:320,sugar:4,fiber:7}},
  {id:27,name:"Black Bean Stuffed Peppers",category:"Legume/Bean-based",prepTime:5,cookTime:10,emoji:"\uD83C\uDF7D",gradient:["#f5576c","#ff6a00"],ingredients:["1 cup canned black beans drained","2 bell pepper halves","2 tbsp salsa","1 tbsp nutritional yeast","1/2 tsp cumin","1/4 cup diced tomato"],steps:["Preheat oven to 400F.","Mix black beans, salsa, cumin and diced tomato.","Fill bell pepper halves with the bean mixture.","Top with nutritional yeast.","Bake 10 minutes until peppers are tender.","Serve immediately."],nutrition:{calories:250,protein:16,carbs:24,fat:4,sodium:380,sugar:6,fiber:9}},
  {id:28,name:"Edamame Hummus Bowl",category:"Legume/Bean-based",prepTime:5,cookTime:0,emoji:"\uD83C\uDF5B",gradient:["#11998e","#38ef7d"],ingredients:["1 cup shelled edamame","1 tbsp tahini","1 tbsp lemon juice","1 clove garlic","1 tbsp olive oil","1/4 cup cucumber sliced"],steps:["Blend edamame, tahini, lemon juice and garlic until smooth.","Add olive oil and blend again until creamy.","Transfer hummus to a bowl.","Arrange sliced cucumber around the hummus.","Drizzle a little extra olive oil on top.","Serve with veggie sticks."],nutrition:{calories:290,protein:19,carbs:14,fat:19,sodium:200,sugar:3,fiber:5}},
  {id:29,name:"Lentil Taco Filling",category:"Legume/Bean-based",prepTime:3,cookTime:10,emoji:"\uD83C\uDF2E",gradient:["#fc4a1a","#f7b733"],ingredients:["1/2 cup brown lentils cooked","1 tsp chili powder","1/2 tsp cumin","1/4 cup diced onion","1 tbsp tomato paste","1 tbsp olive oil"],steps:["Heat olive oil in a skillet over medium heat.","Saute onion 2 minutes until soft.","Add cooked lentils, chili powder and cumin.","Stir in tomato paste and 2 tbsp water.","Cook 5 minutes, mashing slightly.","Use as taco filling with lettuce wraps."],nutrition:{calories:255,protein:16,carbs:22,fat:9,sodium:280,sugar:4,fiber:8}},
  {id:30,name:"White Bean Rosemary Mash",category:"Legume/Bean-based",prepTime:3,cookTime:5,emoji:"\uD83C\uDF71",gradient:["#d299c2","#fef9d7"],ingredients:["1 cup canned cannellini beans drained","1 tbsp olive oil","1 tsp fresh rosemary chopped","1 clove garlic minced","2 tbsp vegetable broth","Black pepper to taste"],steps:["Heat olive oil in a pot over medium heat.","Add garlic and rosemary, cook 30 seconds.","Add drained beans and broth.","Mash beans with a fork to desired consistency.","Season with black pepper.","Serve warm as a side or base."],nutrition:{calories:245,protein:15,carbs:22,fat:9,sodium:310,sugar:1,fiber:6}},
  {id:31,name:"Chickpea Avocado Smash",category:"Legume/Bean-based",prepTime:5,cookTime:0,emoji:"\uD83E\uDD57",gradient:["#56ab2f","#a8e063"],ingredients:["1 cup canned chickpeas drained","1/4 medium avocado","1 tbsp lemon juice","1/4 tsp cumin","2 tbsp hemp seeds","1/4 cup diced celery"],steps:["Drain and rinse chickpeas.","In a bowl, mash chickpeas and avocado with a fork.","Add lemon juice and cumin, mix well.","Fold in diced celery and hemp seeds.","Season with salt and pepper.","Serve on lettuce leaves or as a dip."],nutrition:{calories:305,protein:18,carbs:22,fat:16,sodium:300,sugar:3,fiber:7}},
  {id:32,name:"Spiced Kidney Bean Bowl",category:"Legume/Bean-based",prepTime:3,cookTime:7,emoji:"\uD83C\uDF5B",gradient:["#b91d73","#f953c6"],ingredients:["1 cup canned kidney beans drained","1/2 tsp garam masala","1/4 cup diced tomato","1 tbsp coconut oil","1/4 tsp turmeric","2 tbsp chopped cilantro"],steps:["Heat coconut oil in a skillet over medium heat.","Add drained kidney beans and garam masala.","Stir in turmeric and cook 3 minutes.","Add diced tomato and cook 3 more minutes.","Remove from heat.","Garnish with fresh cilantro and serve."],nutrition:{calories:260,protein:15,carbs:24,fat:10,sodium:330,sugar:3,fiber:8}},
  {id:33,name:"Lupini Bean Salad",category:"Legume/Bean-based",prepTime:5,cookTime:0,emoji:"\uD83E\uDD57",gradient:["#667eea","#764ba2"],ingredients:["1 cup lupini beans drained","1/4 cup diced red onion","1/4 cup cherry tomatoes halved","1 tbsp olive oil","1 tbsp red wine vinegar","1/2 tsp Italian seasoning"],steps:["Drain and rinse lupini beans.","Combine beans, red onion and cherry tomatoes in a bowl.","Whisk olive oil, vinegar and Italian seasoning.","Pour dressing over bean mixture.","Toss gently to combine.","Serve chilled or at room temperature."],nutrition:{calories:230,protein:18,carbs:15,fat:11,sodium:290,sugar:3,fiber:5}},
  {id:34,name:"Lentil Walnut Pate",category:"Legume/Bean-based",prepTime:5,cookTime:0,emoji:"\uD83C\uDF7D",gradient:["#c94b4b","#4b134f"],ingredients:["1/2 cup cooked green lentils","2 tbsp walnuts","1 tsp miso paste","1 tsp lemon juice","1/4 tsp thyme","1 tbsp olive oil"],steps:["Combine cooked lentils and walnuts in a food processor.","Add miso paste, lemon juice and thyme.","Drizzle in olive oil while blending.","Pulse until chunky-smooth consistency.","Transfer to a bowl.","Serve with cucumber slices."],nutrition:{calories:270,protein:15,carbs:18,fat:16,sodium:280,sugar:2,fiber:6}},
  {id:35,name:"Quick Dal Tadka",category:"Legume/Bean-based",prepTime:3,cookTime:12,emoji:"\uD83C\uDF72",gradient:["#f7971e","#ffd200"],ingredients:["1/2 cup red lentils rinsed","1 cup water","1/2 tsp mustard seeds","1 dried red chili","1 tbsp ghee","1/4 tsp turmeric"],steps:["Boil lentils with water and turmeric for 8 minutes until soft.","Heat ghee in a small pan over medium heat.","Add mustard seeds and let them pop.","Add dried red chili and cook 30 seconds.","Pour the tempering over the cooked dal.","Stir and serve hot."],nutrition:{calories:265,protein:17,carbs:23,fat:10,sodium:200,sugar:2,fiber:7}},
  {id:36,name:"Black-Eyed Pea Stew",category:"Legume/Bean-based",prepTime:3,cookTime:10,emoji:"\uD83C\uDF72",gradient:["#2af598","#009efd"],ingredients:["1 cup canned black-eyed peas drained","1/4 cup diced tomato","1/4 cup diced onion","1 clove garlic minced","1 tbsp olive oil","1/2 tsp smoked paprika"],steps:["Heat olive oil in a pot over medium heat.","Saute onion and garlic 2 minutes.","Add black-eyed peas and diced tomato.","Stir in smoked paprika and 1/4 cup water.","Simmer 6 minutes until flavors meld.","Serve hot as a hearty bowl."],nutrition:{calories:250,protein:15,carbs:24,fat:9,sodium:340,sugar:4,fiber:6}},
  {id:37,name:"Vanilla Protein Yogurt Bowl",category:"Greek Yogurt & Cottage Cheese",prepTime:3,cookTime:0,emoji:"\uD83C\uDF68",gradient:["#a18cd1","#fbc2eb"],ingredients:["1 cup plain Greek yogurt (2%)","1 scoop vanilla protein powder","1 tbsp chia seeds","1 tbsp sliced almonds","1/4 tsp cinnamon","5 drops liquid stevia"],steps:["Add Greek yogurt to a bowl.","Stir in vanilla protein powder until smooth.","Add stevia and cinnamon, mix well.","Top with chia seeds.","Sprinkle sliced almonds on top.","Serve immediately chilled."],nutrition:{calories:310,protein:35,carbs:14,fat:12,sodium:250,sugar:7,fiber:4}},
  {id:38,name:"Savory Cottage Cheese Bowl",category:"Greek Yogurt & Cottage Cheese",prepTime:3,cookTime:0,emoji:"\uD83C\uDF5B",gradient:["#ffecd2","#fcb69f"],ingredients:["1 cup low-fat cottage cheese","1/4 cup cherry tomatoes halved","1/4 cup cucumber diced","1 tbsp everything bagel seasoning","1 tbsp olive oil","Fresh dill for garnish"],steps:["Scoop cottage cheese into a bowl.","Arrange cherry tomatoes and cucumber around the edge.","Drizzle with olive oil.","Sprinkle everything bagel seasoning on top.","Garnish with fresh dill.","Serve chilled as a savory breakfast."],nutrition:{calories:250,protein:28,carbs:10,fat:11,sodium:390,sugar:5,fiber:1}},
  {id:39,name:"Peanut Butter Yogurt Dip",category:"Greek Yogurt & Cottage Cheese",prepTime:3,cookTime:0,emoji:"\uD83C\uDF7D",gradient:["#b79891","#94716b"],ingredients:["3/4 cup plain Greek yogurt (2%)","1 tbsp natural peanut butter","1/4 tsp cinnamon","3 drops liquid stevia","1/4 cup celery sticks","2 tbsp hemp seeds"],steps:["Combine Greek yogurt and peanut butter in a bowl.","Stir in cinnamon and stevia until smooth.","Top with hemp seeds.","Arrange celery sticks for dipping.","Mix well before eating.","Enjoy as a protein-rich snack."],nutrition:{calories:280,protein:24,carbs:12,fat:16,sodium:230,sugar:6,fiber:2}},
  {id:40,name:"Berry Cottage Cheese Whip",category:"Greek Yogurt & Cottage Cheese",prepTime:4,cookTime:0,emoji:"\uD83C\uDF68",gradient:["#ff6a00","#ee0979"],ingredients:["1 cup low-fat cottage cheese","1/4 cup frozen mixed berries","1 tbsp flaxseed ground","1/4 tsp vanilla extract","3 drops liquid stevia","1 tbsp walnuts chopped"],steps:["Blend cottage cheese in a blender until smooth and whipped.","Stir in vanilla extract and stevia.","Thaw berries briefly in microwave for 30 seconds.","Transfer whipped cottage cheese to a bowl.","Top with berries, flaxseed and walnuts.","Serve immediately."],nutrition:{calories:245,protein:26,carbs:14,fat:10,sodium:350,sugar:7,fiber:3}},
  {id:41,name:"Tzatziki Yogurt Bowl",category:"Greek Yogurt & Cottage Cheese",prepTime:4,cookTime:0,emoji:"\uD83C\uDF5B",gradient:["#11998e","#38ef7d"],ingredients:["1 cup plain Greek yogurt (2%)","1/4 cup grated cucumber squeezed dry","1 clove garlic minced","1 tbsp olive oil","1 tbsp fresh dill","1 tsp lemon juice"],steps:["Add Greek yogurt to a bowl.","Mix in grated cucumber and minced garlic.","Add lemon juice and olive oil, stir.","Sprinkle fresh dill on top.","Let sit 2 minutes for flavors to meld.","Serve chilled with veggie sticks."],nutrition:{calories:210,protein:20,carbs:8,fat:11,sodium:200,sugar:6,fiber:0}},
  {id:42,name:"Cottage Cheese Stuffed Avocado",category:"Greek Yogurt & Cottage Cheese",prepTime:4,cookTime:0,emoji:"\uD83C\uDF7D",gradient:["#56ab2f","#a8e063"],ingredients:["1/2 medium avocado","1/2 cup low-fat cottage cheese","1 tbsp sunflower seeds","1/4 tsp smoked paprika","1 tsp lemon juice","Pinch of black pepper"],steps:["Halve avocado and remove pit.","Fill avocado cavity with cottage cheese.","Squeeze lemon juice over the top.","Sprinkle smoked paprika and black pepper.","Top with sunflower seeds.","Serve immediately as a balanced snack."],nutrition:{calories:260,protein:17,carbs:10,fat:18,sodium:310,sugar:3,fiber:4}},
  {id:43,name:"Chocolate Protein Yogurt",category:"Greek Yogurt & Cottage Cheese",prepTime:3,cookTime:0,emoji:"\uD83C\uDF68",gradient:["#4b134f","#c94b4b"],ingredients:["1 cup plain Greek yogurt (2%)","1 tbsp unsweetened cocoa powder","1 scoop chocolate protein powder","5 drops liquid stevia","1 tbsp hemp seeds","1 tbsp almond butter"],steps:["Combine Greek yogurt, cocoa powder and protein powder.","Stir until completely smooth.","Add stevia and mix in.","Transfer to a serving bowl.","Drizzle almond butter on top.","Sprinkle hemp seeds and serve."],nutrition:{calories:330,protein:38,carbs:15,fat:14,sodium:270,sugar:7,fiber:3}},
  {id:44,name:"Herbed Ricotta Dip",category:"Greek Yogurt & Cottage Cheese",prepTime:4,cookTime:0,emoji:"\uD83C\uDF71",gradient:["#96fbc4","#f9f586"],ingredients:["3/4 cup part-skim ricotta","2 tbsp fresh basil chopped","1 tbsp olive oil","1/2 tsp lemon zest","1/4 tsp garlic powder","1 tbsp pine nuts"],steps:["Place ricotta in a bowl.","Add chopped basil and lemon zest.","Stir in garlic powder.","Drizzle olive oil on top.","Toast pine nuts in a dry pan 1 minute.","Sprinkle pine nuts over ricotta and serve."],nutrition:{calories:270,protein:16,carbs:7,fat:20,sodium:220,sugar:3,fiber:1}},
  {id:45,name:"Cinnamon Yogurt Parfait",category:"Greek Yogurt & Cottage Cheese",prepTime:4,cookTime:0,emoji:"\uD83C\uDF6F",gradient:["#f6d365","#fda085"],ingredients:["3/4 cup plain Greek yogurt (2%)","1 tbsp pecans chopped","1/2 tsp cinnamon","1 tbsp ground flaxseed","3 drops liquid stevia","1 tbsp unsweetened coconut flakes"],steps:["Layer half the yogurt in a glass.","Sprinkle half the cinnamon and flaxseed.","Add remaining yogurt on top.","Top with pecans and coconut flakes.","Drizzle stevia over the parfait.","Serve immediately."],nutrition:{calories:235,protein:18,carbs:11,fat:14,sodium:180,sugar:6,fiber:3}},
  {id:46,name:"Cottage Cheese Veggie Dip",category:"Greek Yogurt & Cottage Cheese",prepTime:4,cookTime:0,emoji:"\uD83E\uDD57",gradient:["#f093fb","#f5576c"],ingredients:["1 cup low-fat cottage cheese","2 tbsp chives chopped","1/4 tsp onion powder","1/4 tsp garlic powder","1/4 cup bell pepper strips","1/4 cup celery sticks"],steps:["Blend cottage cheese until slightly smooth but still chunky.","Mix in chives, onion powder and garlic powder.","Transfer to a serving bowl.","Arrange bell pepper strips and celery around the dip.","Chill for 5 minutes if desired.","Serve as a protein-rich snack."],nutrition:{calories:180,protein:25,carbs:8,fat:4,sodium:380,sugar:5,fiber:1}},
  {id:47,name:"Protein Greek Salad",category:"Salads with protein",prepTime:5,cookTime:0,emoji:"\uD83E\uDD57",gradient:["#667eea","#764ba2"],ingredients:["2 cups mixed greens","1/2 cup canned chickpeas drained","2 tbsp feta cheese crumbled","1/4 cup cucumber diced","6 kalamata olives","1 tbsp olive oil and lemon dressing"],steps:["Arrange mixed greens on a plate.","Top with chickpeas and diced cucumber.","Add kalamata olives.","Crumble feta cheese over the salad.","Drizzle olive oil and lemon dressing.","Toss gently and serve."],nutrition:{calories:290,protein:15,carbs:20,fat:17,sodium:390,sugar:4,fiber:5}},
  {id:48,name:"Edamame Kale Power Salad",category:"Salads with protein",prepTime:5,cookTime:0,emoji:"\uD83E\uDD57",gradient:["#00b09b","#96c93d"],ingredients:["2 cups chopped kale","1/2 cup shelled edamame","1 tbsp sesame seeds","1 tbsp rice vinegar","1 tsp sesame oil","1/4 cup shredded carrot"],steps:["Massage kale with a pinch of salt for 1 minute.","Add shelled edamame to the kale.","Toss in shredded carrot.","Whisk rice vinegar and sesame oil for dressing.","Pour dressing over salad and toss.","Top with sesame seeds and serve."],nutrition:{calories:235,protein:16,carbs:15,fat:13,sodium:280,sugar:3,fiber:5}},
  {id:49,name:"Caprese Chickpea Salad",category:"Salads with protein",prepTime:5,cookTime:0,emoji:"\uD83C\uDF7D",gradient:["#f5576c","#ff6a00"],ingredients:["1/2 cup canned chickpeas drained","1/2 cup cherry tomatoes halved","4 fresh basil leaves","2 oz fresh mozzarella diced","1 tbsp balsamic glaze","1 tbsp olive oil"],steps:["Drain and rinse chickpeas.","Halve cherry tomatoes and dice mozzarella.","Combine chickpeas, tomatoes and mozzarella in a bowl.","Tear basil leaves over the salad.","Drizzle with olive oil and balsamic glaze.","Toss gently and serve."],nutrition:{calories:310,protein:18,carbs:20,fat:18,sodium:370,sugar:5,fiber:4}},
  {id:50,name:"Hemp Seed Caesar Salad",category:"Salads with protein",prepTime:5,cookTime:0,emoji:"\uD83E\uDD57",gradient:["#a18cd1","#fbc2eb"],ingredients:["2 cups chopped romaine","3 tbsp hemp seeds","1 tbsp parmesan shaved","1 tbsp caesar dressing (light)","1/4 cup marinated tofu cubes","Black pepper to taste"],steps:["Chop romaine and place in a bowl.","Add marinated tofu cubes.","Sprinkle hemp seeds generously.","Add shaved parmesan.","Drizzle light caesar dressing.","Toss and season with black pepper."],nutrition:{calories:275,protein:20,carbs:8,fat:19,sodium:350,sugar:2,fiber:3}},
  {id:51,name:"Lentil Arugula Salad",category:"Salads with protein",prepTime:5,cookTime:0,emoji:"\uD83C\uDF3F",gradient:["#2af598","#009efd"],ingredients:["2 cups arugula","1/2 cup cooked green lentils","2 tbsp goat cheese crumbled","1 tbsp walnuts chopped","1 tbsp lemon vinaigrette","1/4 cup roasted red pepper diced"],steps:["Spread arugula on a plate.","Top with cooked lentils.","Add diced roasted red pepper.","Crumble goat cheese over the salad.","Sprinkle chopped walnuts.","Drizzle lemon vinaigrette and serve."],nutrition:{calories:280,protein:17,carbs:18,fat:16,sodium:290,sugar:3,fiber:5}},
  {id:52,name:"Spinach Almond Feta Salad",category:"Salads with protein",prepTime:5,cookTime:0,emoji:"\uD83C\uDF71",gradient:["#ffecd2","#fcb69f"],ingredients:["2 cups baby spinach","3 tbsp sliced almonds","3 tbsp feta cheese","1/4 cup red onion thinly sliced","1/2 cup paneer cubes","1 tbsp olive oil"],steps:["Place baby spinach in a large bowl.","Add sliced red onion and paneer cubes.","Sprinkle sliced almonds and crumbled feta.","Drizzle olive oil over the salad.","Toss gently to combine.","Serve immediately."],nutrition:{calories:330,protein:22,carbs:7,fat:25,sodium:350,sugar:3,fiber:3}},
  {id:53,name:"Tempeh Taco Salad",category:"Salads with protein",prepTime:4,cookTime:6,emoji:"\uD83E\uDD57",gradient:["#fc4a1a","#f7b733"],ingredients:["2 cups shredded lettuce","100g tempeh crumbled","1 tsp taco seasoning","1/4 cup diced tomato","2 tbsp sour cream","1 tbsp olive oil"],steps:["Heat olive oil in a pan over medium heat.","Cook crumbled tempeh with taco seasoning for 5 minutes.","Arrange shredded lettuce in a bowl.","Top with seasoned tempeh.","Add diced tomato.","Dollop sour cream on top and serve."],nutrition:{calories:295,protein:20,carbs:12,fat:20,sodium:350,sugar:3,fiber:4}},
  {id:54,name:"Cottage Cheese Garden Salad",category:"Salads with protein",prepTime:5,cookTime:0,emoji:"\uD83C\uDF7D",gradient:["#96fbc4","#f9f586"],ingredients:["2 cups mixed greens","1/2 cup low-fat cottage cheese","1/4 cup cherry tomatoes","1/4 cup cucumber slices","1 tbsp pumpkin seeds","1 tbsp lemon olive oil dressing"],steps:["Arrange mixed greens on a plate.","Place a mound of cottage cheese in the center.","Surround with cherry tomatoes and cucumber.","Sprinkle pumpkin seeds over everything.","Drizzle lemon olive oil dressing.","Serve chilled."],nutrition:{calories:220,protein:20,carbs:10,fat:11,sodium:350,sugar:4,fiber:2}},
  {id:55,name:"Chickpea Walnut Cobb Salad",category:"Salads with protein",prepTime:5,cookTime:0,emoji:"\uD83E\uDD57",gradient:["#b91d73","#f953c6"],ingredients:["2 cups chopped romaine","1/2 cup canned chickpeas drained","2 tbsp walnuts","1/4 avocado sliced","2 tbsp blue cheese crumbled","1 tbsp red wine vinaigrette"],steps:["Arrange romaine on a plate.","Scatter chickpeas across the salad.","Add avocado slices beside the chickpeas.","Crumble blue cheese on one section.","Add walnuts on another section.","Drizzle red wine vinaigrette and serve."],nutrition:{calories:330,protein:16,carbs:22,fat:21,sodium:370,sugar:3,fiber:6}},
  {id:56,name:"Tofu Broccoli Stir-Fry",category:"Stir-fries & Sautees",prepTime:4,cookTime:8,emoji:"\uD83E\uDD58",gradient:["#11998e","#38ef7d"],ingredients:["200g extra-firm tofu cubed","1 cup broccoli florets","1 tbsp soy sauce (low sodium)","1 tsp ginger grated","1 tbsp sesame oil","1/2 tsp garlic powder"],steps:["Press and cube tofu.","Heat sesame oil in a wok over high heat.","Add tofu and stir-fry 4 minutes until crispy.","Add broccoli and ginger, cook 3 minutes.","Drizzle soy sauce and garlic powder.","Toss well and serve hot."],nutrition:{calories:275,protein:22,carbs:10,fat:18,sodium:360,sugar:3,fiber:3}},
  {id:57,name:"Mushroom Spinach Saute",category:"Stir-fries & Sautees",prepTime:3,cookTime:6,emoji:"\uD83C\uDF73",gradient:["#b79891","#94716b"],ingredients:["2 cups sliced mushrooms","2 cups fresh spinach","150g firm tofu crumbled","1 tbsp butter","2 cloves garlic minced","1/4 tsp red pepper flakes"],steps:["Melt butter in a large skillet over medium-high heat.","Add mushrooms and cook 3 minutes until browned.","Add garlic and red pepper flakes, stir 30 seconds.","Add crumbled tofu and cook 2 minutes until golden.","Add spinach and stir everything together.","Cook until spinach wilts and serve."],nutrition:{calories:240,protein:20,carbs:8,fat:15,sodium:300,sugar:3,fiber:3}},
  {id:58,name:"Zucchini Noodle Stir-Fry",category:"Stir-fries & Sautees",prepTime:4,cookTime:5,emoji:"\uD83C\uDF5C",gradient:["#a8e063","#56ab2f"],ingredients:["2 medium zucchini spiralized","100g firm tofu cubed","1 tbsp peanut sauce","1 tsp sesame oil","1/4 cup shredded carrot","1 tbsp scallions chopped"],steps:["Spiralize zucchini into noodles.","Heat sesame oil in a wok over high heat.","Add tofu and cook 3 minutes until golden.","Add zucchini noodles and shredded carrot.","Stir-fry 1 minute, add peanut sauce.","Top with scallions and serve."],nutrition:{calories:230,protein:16,carbs:12,fat:14,sodium:340,sugar:6,fiber:3}},
  {id:59,name:"Bell Pepper Tofu Scramble",category:"Stir-fries & Sautees",prepTime:3,cookTime:5,emoji:"\uD83C\uDF73",gradient:["#f7971e","#ffd200"],ingredients:["200g firm tofu crumbled","1 cup mixed bell peppers diced","1/4 cup onion diced","1 tbsp olive oil","1/2 tsp cumin","Fresh cilantro for garnish"],steps:["Heat olive oil in a skillet over medium heat.","Add bell peppers and onion, saute 2 minutes.","Crumble tofu and mix with cumin.","Add tofu over the vegetables.","Stir gently until tofu is golden, about 2 minutes.","Garnish with cilantro and serve."],nutrition:{calories:250,protein:20,carbs:9,fat:15,sodium:290,sugar:5,fiber:3}},
  {id:60,name:"Garlic Edamame Saute",category:"Stir-fries & Sautees",prepTime:2,cookTime:5,emoji:"\uD83E\uDD58",gradient:["#d299c2","#fef9d7"],ingredients:["1 cup shelled edamame","3 cloves garlic sliced","1 tbsp sesame oil","1/2 tsp chili flakes","1 tsp tamari","1 tsp sesame seeds"],steps:["Heat sesame oil in a pan over medium-high heat.","Add sliced garlic and cook 30 seconds.","Add edamame and chili flakes.","Stir-fry 3 minutes until edamame is hot.","Drizzle tamari and toss.","Sprinkle sesame seeds and serve."],nutrition:{calories:225,protein:17,carbs:10,fat:14,sodium:310,sugar:3,fiber:4}},
  {id:61,name:"Asparagus Tofu Stir-Fry",category:"Stir-fries & Sautees",prepTime:4,cookTime:7,emoji:"\uD83C\uDF5C",gradient:["#667eea","#764ba2"],ingredients:["150g firm tofu cubed","1 cup asparagus cut into pieces","1 tbsp hoisin sauce","1 tsp ginger grated","1 tbsp avocado oil","1/4 cup water chestnuts sliced"],steps:["Cut asparagus into 2-inch pieces.","Heat avocado oil in a wok over high heat.","Add tofu and cook 3 minutes until golden.","Add asparagus and ginger, stir-fry 2 minutes.","Add water chestnuts and hoisin sauce.","Toss together and serve hot."],nutrition:{calories:250,protein:18,carbs:14,fat:14,sodium:370,sugar:5,fiber:3}},
  {id:62,name:"Cauliflower Tofu Fried Rice",category:"Stir-fries & Sautees",prepTime:4,cookTime:6,emoji:"\uD83C\uDF5A",gradient:["#ffecd2","#fcb69f"],ingredients:["2 cups cauliflower rice","150g firm tofu crumbled","1/4 cup peas","1 tbsp soy sauce (low sodium)","1 tbsp sesame oil","1 tbsp scallions chopped"],steps:["Heat sesame oil in a wok over high heat.","Add cauliflower rice and cook 3 minutes.","Push to the side and cook crumbled tofu until golden.","Mix tofu with cauliflower rice.","Add peas and soy sauce, stir-fry 1 minute.","Top with scallions and serve."],nutrition:{calories:230,protein:18,carbs:10,fat:14,sodium:380,sugar:4,fiber:3}},
  {id:63,name:"Cabbage Tempeh Stir-Fry",category:"Stir-fries & Sautees",prepTime:4,cookTime:7,emoji:"\uD83C\uDF5C",gradient:["#f093fb","#f5576c"],ingredients:["150g tempeh sliced thin","2 cups shredded cabbage","1 tbsp tamari","1 tsp rice vinegar","1 tbsp coconut oil","1/2 tsp five-spice powder"],steps:["Slice tempeh into thin strips.","Heat coconut oil in a wok over high heat.","Add tempeh and cook 3 minutes until browned.","Add shredded cabbage and five-spice powder.","Stir-fry 3 minutes until cabbage softens.","Drizzle tamari and rice vinegar, toss and serve."],nutrition:{calories:290,protein:21,carbs:13,fat:18,sodium:370,sugar:4,fiber:4}},
  {id:64,name:"Bok Choy Silken Tofu Soup",category:"Stir-fries & Sautees",prepTime:3,cookTime:5,emoji:"\uD83C\uDF72",gradient:["#00b09b","#96c93d"],ingredients:["2 cups bok choy chopped","150g silken tofu cubed","1 cup vegetable broth low sodium","1 tsp sesame oil","1/2 tsp ginger grated","1 tsp cornstarch mixed with water"],steps:["Bring vegetable broth to a simmer with ginger.","Add chopped bok choy and cook 2 minutes.","Stir in cornstarch slurry to thicken.","Gently add silken tofu cubes and simmer 1 minute.","Remove from heat carefully.","Drizzle sesame oil and serve."],nutrition:{calories:165,protein:15,carbs:8,fat:9,sodium:340,sugar:2,fiber:1}},
  {id:65,name:"Green Bean Almond Saute",category:"Stir-fries & Sautees",prepTime:3,cookTime:6,emoji:"\uD83C\uDF71",gradient:["#2af598","#009efd"],ingredients:["1.5 cups green beans trimmed","2 tbsp sliced almonds","1/2 cup chickpeas drained","1 tbsp olive oil","1 clove garlic minced","Zest of half a lemon"],steps:["Heat olive oil in a skillet over medium-high heat.","Add green beans and cook 4 minutes until crisp-tender.","Add garlic and almonds, cook 1 minute.","Add chickpeas and toss in the pan for 1 minute.","Add lemon zest and toss everything.","Serve immediately."],nutrition:{calories:255,protein:15,carbs:18,fat:14,sodium:260,sugar:4,fiber:6}},
  {id:66,name:"Thai Basil Tofu Saute",category:"Stir-fries & Sautees",prepTime:4,cookTime:7,emoji:"\uD83C\uDF5B",gradient:["#c94b4b","#4b134f"],ingredients:["200g firm tofu cubed","1 cup Thai basil leaves","2 cloves garlic minced","1 Thai chili sliced","1 tbsp soy sauce (low sodium)","1 tbsp avocado oil"],steps:["Heat avocado oil in a wok over high heat.","Add tofu cubes and fry 4 minutes until crispy.","Add garlic and Thai chili, stir 30 seconds.","Add soy sauce and toss.","Throw in Thai basil leaves.","Stir until basil just wilts and serve."],nutrition:{calories:255,protein:20,carbs:6,fat:17,sodium:360,sugar:2,fiber:1}},
  {id:67,name:"Chocolate Peanut Butter Shake",category:"Smoothies & Protein shakes",prepTime:3,cookTime:0,emoji:"\uD83E\uDD64",gradient:["#4b134f","#c94b4b"],ingredients:["1 cup unsweetened almond milk","1 scoop chocolate protein powder","1 tbsp natural peanut butter","1 tbsp unsweetened cocoa powder","1/2 cup ice","3 drops liquid stevia"],steps:["Add almond milk and ice to blender.","Add protein powder and cocoa powder.","Add peanut butter and stevia.","Blend on high for 30 seconds until smooth.","Pour into a tall glass.","Serve immediately."],nutrition:{calories:280,protein:30,carbs:12,fat:14,sodium:250,sugar:4,fiber:4}},
  {id:68,name:"Green Power Smoothie",category:"Smoothies & Protein shakes",prepTime:3,cookTime:0,emoji:"\uD83E\uDD64",gradient:["#56ab2f","#a8e063"],ingredients:["1 cup unsweetened almond milk","1 scoop vanilla protein powder","1 cup raw spinach","1 tbsp almond butter","1/2 cup ice","1/4 small avocado"],steps:["Add almond milk and spinach to blender.","Add protein powder and almond butter.","Add avocado and ice.","Blend on high for 45 seconds until smooth.","Pour into a glass.","Drink immediately for best nutrition."],nutrition:{calories:310,protein:28,carbs:11,fat:18,sodium:270,sugar:3,fiber:5}},
  {id:69,name:"Vanilla Chai Protein Shake",category:"Smoothies & Protein shakes",prepTime:3,cookTime:0,emoji:"\uD83C\uDF75",gradient:["#f6d365","#fda085"],ingredients:["1 cup unsweetened almond milk","1 scoop vanilla protein powder","1/2 tsp cinnamon","1/4 tsp cardamom","1/4 tsp ginger powder","1/2 cup ice"],steps:["Add almond milk and ice to blender.","Add protein powder and all spices.","Blend on high for 30 seconds.","Pour into a mug or glass.","Dust extra cinnamon on top.","Serve cold or slightly warmed."],nutrition:{calories:180,protein:25,carbs:8,fat:5,sodium:230,sugar:2,fiber:2}},
  {id:70,name:"Berry Protein Blast",category:"Smoothies & Protein shakes",prepTime:3,cookTime:0,emoji:"\uD83E\uDD64",gradient:["#ee9ca7","#ffdde1"],ingredients:["1 cup unsweetened almond milk","1 scoop vanilla protein powder","1/4 cup frozen mixed berries","1 tbsp chia seeds","1/2 cup ice","1 tbsp hemp seeds"],steps:["Add almond milk and frozen berries to blender.","Add protein powder, chia seeds and hemp seeds.","Add ice.","Blend on high for 45 seconds until smooth.","Pour into a tall glass.","Serve immediately."],nutrition:{calories:275,protein:30,carbs:14,fat:12,sodium:240,sugar:5,fiber:6}},
  {id:71,name:"Matcha Protein Smoothie",category:"Smoothies & Protein shakes",prepTime:3,cookTime:0,emoji:"\uD83C\uDF75",gradient:["#a8e063","#56ab2f"],ingredients:["1 cup unsweetened coconut milk","1 scoop vanilla protein powder","1 tsp matcha powder","1 tbsp cashew butter","1/2 cup ice","3 drops liquid stevia"],steps:["Add coconut milk and matcha powder to blender.","Add protein powder and cashew butter.","Add ice and stevia.","Blend on high for 30 seconds until frothy.","Pour into a glass.","Enjoy immediately."],nutrition:{calories:290,protein:27,carbs:10,fat:16,sodium:210,sugar:3,fiber:2}},
  {id:72,name:"Cinnamon Roll Protein Shake",category:"Smoothies & Protein shakes",prepTime:3,cookTime:0,emoji:"\uD83E\uDD64",gradient:["#b79891","#94716b"],ingredients:["1 cup unsweetened almond milk","1 scoop vanilla protein powder","1 tsp cinnamon","1 tbsp cream cheese","1/2 cup ice","1/4 tsp vanilla extract"],steps:["Add almond milk, ice and cream cheese to blender.","Add protein powder, cinnamon and vanilla extract.","Blend on high for 30 seconds.","Blend again if cream cheese chunks remain.","Pour into a glass.","Dust with extra cinnamon on top."],nutrition:{calories:235,protein:26,carbs:9,fat:10,sodium:280,sugar:3,fiber:2}},
  {id:73,name:"Coconut Almond Shake",category:"Smoothies & Protein shakes",prepTime:3,cookTime:0,emoji:"\uD83E\uDD65",gradient:["#ffecd2","#fcb69f"],ingredients:["1 cup unsweetened coconut milk","1 scoop vanilla protein powder","1 tbsp almond butter","1 tbsp unsweetened shredded coconut","1/2 cup ice","1/4 tsp almond extract"],steps:["Add coconut milk and ice to blender.","Add protein powder and almond butter.","Add almond extract.","Blend on high for 30 seconds until creamy.","Pour into a glass.","Top with shredded coconut."],nutrition:{calories:305,protein:27,carbs:10,fat:18,sodium:220,sugar:3,fiber:3}},
  {id:74,name:"Coffee Protein Shake",category:"Smoothies & Protein shakes",prepTime:3,cookTime:0,emoji:"\u2615",gradient:["#c94b4b","#4b134f"],ingredients:["1 cup cold brew coffee","1 scoop chocolate protein powder","1 tbsp MCT oil","1/2 cup ice","1/4 tsp cinnamon","3 drops liquid stevia"],steps:["Add cold brew coffee and ice to blender.","Add protein powder and MCT oil.","Add cinnamon and stevia.","Blend on high for 30 seconds.","Pour into a tall glass.","Serve immediately for a morning boost."],nutrition:{calories:250,protein:25,carbs:6,fat:14,sodium:200,sugar:2,fiber:1}},
  {id:75,name:"Strawberry Cheesecake Shake",category:"Smoothies & Protein shakes",prepTime:3,cookTime:0,emoji:"\uD83E\uDD64",gradient:["#f5576c","#ff6a00"],ingredients:["1 cup unsweetened almond milk","1 scoop vanilla protein powder","2 tbsp cream cheese","3 frozen strawberries","1/2 cup ice","3 drops liquid stevia"],steps:["Add almond milk and frozen strawberries to blender.","Add protein powder and cream cheese.","Add ice and stevia.","Blend on high for 45 seconds until smooth.","Pour into a glass.","Serve immediately."],nutrition:{calories:260,protein:27,carbs:11,fat:12,sodium:290,sugar:5,fiber:2}},
  {id:76,name:"Pumpkin Spice Protein Shake",category:"Smoothies & Protein shakes",prepTime:3,cookTime:0,emoji:"\uD83E\uDD64",gradient:["#f7971e","#ffd200"],ingredients:["1 cup unsweetened almond milk","1 scoop vanilla protein powder","2 tbsp pumpkin puree","1/2 tsp pumpkin pie spice","1/2 cup ice","3 drops liquid stevia"],steps:["Add almond milk and pumpkin puree to blender.","Add protein powder and pumpkin pie spice.","Add ice and stevia.","Blend on high for 30 seconds.","Pour into a glass.","Dust with extra pumpkin pie spice on top."],nutrition:{calories:200,protein:26,carbs:10,fat:6,sodium:260,sugar:4,fiber:3}},
  {id:77,name:"Mint Chocolate Smoothie",category:"Smoothies & Protein shakes",prepTime:3,cookTime:0,emoji:"\uD83E\uDD64",gradient:["#11998e","#38ef7d"],ingredients:["1 cup unsweetened almond milk","1 scoop chocolate protein powder","1/4 cup fresh spinach","1/4 tsp peppermint extract","1/2 cup ice","1 tbsp cacao nibs"],steps:["Add almond milk, spinach and ice to blender.","Add protein powder and peppermint extract.","Blend on high for 30 seconds.","Pour into a glass.","Top with cacao nibs.","Serve immediately."],nutrition:{calories:230,protein:26,carbs:10,fat:10,sodium:240,sugar:3,fiber:4}},
  {id:78,name:"Chickpea Salad Lettuce Wraps",category:"Wraps & Quick bites",prepTime:5,cookTime:0,emoji:"\uD83C\uDF2F",gradient:["#a8e063","#56ab2f"],ingredients:["1 cup canned chickpeas drained and mashed","1 tbsp Greek yogurt","1 tsp Dijon mustard","4 large butter lettuce leaves","1/4 cup diced celery","Paprika for garnish"],steps:["Drain chickpeas and mash with a fork until chunky.","Mix mashed chickpeas with Greek yogurt and Dijon mustard.","Fold in diced celery.","Spoon chickpea salad into lettuce leaves.","Sprinkle paprika on top.","Serve as hand-held wraps."],nutrition:{calories:240,protein:15,carbs:24,fat:8,sodium:350,sugar:4,fiber:6}},
  {id:79,name:"Tofu Nori Roll-Ups",category:"Wraps & Quick bites",prepTime:5,cookTime:3,emoji:"\uD83C\uDF63",gradient:["#2af598","#009efd"],ingredients:["150g firm tofu sliced thin","2 nori sheets","1/4 cup cucumber julienned","1/4 avocado sliced thin","1 tsp tamari","1 tsp sesame seeds"],steps:["Slice tofu into thin strips.","Briefly pan-fry tofu strips 1 minute each side.","Lay nori sheets on a flat surface.","Arrange tofu, cucumber and avocado across each sheet.","Roll up tightly and seal edge with water.","Slice each roll into pieces, sprinkle sesame seeds."],nutrition:{calories:240,protein:18,carbs:10,fat:15,sodium:330,sugar:2,fiber:3}},
  {id:80,name:"Cottage Cheese Stuffed Celery",category:"Wraps & Quick bites",prepTime:5,cookTime:0,emoji:"\uD83C\uDF7D",gradient:["#96fbc4","#f9f586"],ingredients:["6 celery stalks","1/2 cup low-fat cottage cheese","1 tbsp everything bagel seasoning","1 tbsp chives chopped","1 tsp lemon juice","Pinch of black pepper"],steps:["Wash and trim celery stalks.","Mix cottage cheese with lemon juice and pepper.","Fill celery stalks with cottage cheese mixture.","Sprinkle everything bagel seasoning on top.","Garnish with chopped chives.","Serve as a crunchy protein snack."],nutrition:{calories:130,protein:15,carbs:6,fat:4,sodium:380,sugar:3,fiber:2}},
  {id:81,name:"Tempeh Collard Green Wraps",category:"Wraps & Quick bites",prepTime:5,cookTime:5,emoji:"\uD83C\uDF2F",gradient:["#f093fb","#f5576c"],ingredients:["150g tempeh sliced thin","2 large collard green leaves","2 tbsp hummus","1/4 cup shredded carrot","1/4 cup cucumber sliced","1 tbsp olive oil"],steps:["Heat olive oil and cook tempeh slices 2 minutes per side.","Blanch collard green leaves 30 seconds in hot water.","Spread hummus on each collard green leaf.","Layer tempeh, carrot and cucumber.","Roll up tightly tucking in the sides.","Slice in half and serve."],nutrition:{calories:310,protein:22,carbs:14,fat:19,sodium:320,sugar:3,fiber:5}},
  {id:82,name:"Greek Yogurt Stuffed Cucumbers",category:"Wraps & Quick bites",prepTime:5,cookTime:0,emoji:"\uD83C\uDF71",gradient:["#f6d365","#fda085"],ingredients:["1 large cucumber halved and seeded","1/2 cup Greek yogurt","2 tbsp paneer crumbled","1/4 tsp turmeric","Paprika for garnish","Fresh chives for garnish"],steps:["Cut cucumber in half lengthwise and scoop out seeds.","Mix Greek yogurt with crumbled paneer and turmeric.","Spoon the yogurt mixture into cucumber halves.","Sprinkle paprika on top.","Garnish with fresh chives.","Slice into pieces and serve."],nutrition:{calories:160,protein:16,carbs:8,fat:7,sodium:280,sugar:5,fiber:1}},
  {id:83,name:"Edamame Hummus Cups",category:"Wraps & Quick bites",prepTime:5,cookTime:0,emoji:"\uD83E\uDDC6",gradient:["#00b09b","#96c93d"],ingredients:["1/2 cup edamame hummus","4 mini bell peppers halved","1 tbsp hemp seeds","8 cucumber rounds","1/4 cup cherry tomatoes halved","Smoked paprika for garnish"],steps:["Halve mini bell peppers and remove seeds.","Fill each pepper half with edamame hummus.","Top each with hemp seeds.","Arrange cucumber rounds on a plate with tomatoes.","Add a small dollop of hummus on each cucumber.","Dust with smoked paprika and serve."],nutrition:{calories:210,protein:15,carbs:14,fat:12,sodium:290,sugar:5,fiber:4}},
  {id:84,name:"Cheese and Seed Crackers",category:"Wraps & Quick bites",prepTime:3,cookTime:5,emoji:"\uD83C\uDF73",gradient:["#f7971e","#ffd200"],ingredients:["4 tbsp shredded parmesan","2 tbsp mixed seeds (pumpkin and sunflower)","1/4 tsp Italian seasoning","1/4 tsp garlic powder","1/2 cup paneer cubes","Cracked black pepper"],steps:["Place small mounds of parmesan on parchment-lined baking sheet.","Flatten into thin circles.","Sprinkle seeds, Italian seasoning and garlic powder on each.","Bake at 400F for 4-5 minutes until golden and crispy.","Let cool 2 minutes until firm.","Serve alongside paneer cubes with cracked pepper."],nutrition:{calories:260,protein:21,carbs:4,fat:18,sodium:350,sugar:1,fiber:1}},
  {id:85,name:"Almond Butter Celery Boats",category:"Wraps & Quick bites",prepTime:4,cookTime:0,emoji:"\uD83C\uDF7D",gradient:["#b79891","#94716b"],ingredients:["4 large celery stalks","2 tbsp almond butter","1 tbsp hemp seeds","1/4 tsp cinnamon","1/4 cup paneer cubes","Pinch of sea salt"],steps:["Wash and cut celery stalks.","Spread almond butter into each celery stalk.","Sprinkle hemp seeds and cinnamon on top.","Add a pinch of sea salt.","Arrange paneer cubes alongside on the plate.","Enjoy as a balanced quick bite."],nutrition:{calories:270,protein:17,carbs:8,fat:20,sodium:280,sugar:3,fiber:3}},
  {id:86,name:"Ricotta Stuffed Mushrooms",category:"Wraps & Quick bites",prepTime:5,cookTime:8,emoji:"\uD83C\uDF71",gradient:["#667eea","#764ba2"],ingredients:["8 button mushroom caps","1/3 cup part-skim ricotta","1 tbsp parmesan grated","1 clove garlic minced","1 tbsp fresh parsley chopped","1 tbsp olive oil"],steps:["Preheat oven to 400F.","Remove mushroom stems and brush caps with olive oil.","Mix ricotta, parmesan, garlic and parsley.","Fill each mushroom cap with ricotta mixture.","Place on a baking sheet.","Bake 8 minutes until mushrooms are tender."],nutrition:{calories:210,protein:15,carbs:7,fat:14,sodium:270,sugar:3,fiber:1}},
  {id:87,name:"Cucumber Cream Cheese Bites",category:"Wraps & Quick bites",prepTime:5,cookTime:0,emoji:"\uD83E\uDD57",gradient:["#a18cd1","#fbc2eb"],ingredients:["1 large cucumber sliced thick","3 tbsp cream cheese","1 tbsp everything bagel seasoning","1 tbsp dill chopped","1/2 cup paneer cubes","Cracked black pepper"],steps:["Slice cucumber into thick rounds.","Spread cream cheese on each cucumber round.","Sprinkle everything bagel seasoning on top.","Garnish with chopped dill.","Arrange paneer cubes alongside.","Season with cracked pepper and serve."],nutrition:{calories:240,protein:17,carbs:6,fat:17,sodium:360,sugar:3,fiber:1}},
  {id:88,name:"Spicy Chickpea Lettuce Cups",category:"Wraps & Quick bites",prepTime:4,cookTime:5,emoji:"\uD83C\uDF2F",gradient:["#fc4a1a","#f7b733"],ingredients:["1 cup canned chickpeas drained","4 butter lettuce leaves","1 tsp sriracha","1 tbsp olive oil","2 tbsp hemp seeds","2 tbsp diced red onion"],steps:["Heat olive oil in a pan over medium-high heat.","Add chickpeas and smash slightly with a fork.","Cook 3 minutes until crispy on edges.","Add sriracha and hemp seeds, toss.","Spoon into lettuce cups.","Top with diced red onion and serve."],nutrition:{calories:290,protein:17,carbs:21,fat:16,sodium:350,sugar:4,fiber:6}},
  {id:89,name:"Feta Walnut Endive Boats",category:"Wraps & Quick bites",prepTime:5,cookTime:0,emoji:"\uD83C\uDF7D",gradient:["#ee9ca7","#ffdde1"],ingredients:["8 endive leaves","3 tbsp feta cheese crumbled","3 tbsp walnuts chopped","1/2 cup cottage cheese","1 tbsp olive oil","1 tsp balsamic glaze"],steps:["Separate endive into individual boat-shaped leaves.","Mix cottage cheese and feta in a small bowl.","Spoon cheese mixture into each endive boat.","Top with chopped walnuts.","Drizzle olive oil and balsamic glaze.","Serve immediately as protein-rich bites."],nutrition:{calories:295,protein:19,carbs:7,fat:22,sodium:350,sugar:3,fiber:3}},
  {id:90,name:"Protein Packed Trail Mix",category:"Wraps & Quick bites",prepTime:3,cookTime:0,emoji:"\uD83C\uDF71",gradient:["#c2e59c","#64b3f4"],ingredients:["2 tbsp pumpkin seeds","2 tbsp almonds","2 tbsp roasted edamame","1 tbsp sunflower seeds","1 tbsp coconut flakes unsweetened","1 tbsp cacao nibs"],steps:["Measure out all ingredients.","Combine pumpkin seeds and almonds in a bowl.","Add roasted edamame and sunflower seeds.","Toss in coconut flakes and cacao nibs.","Mix everything together.","Store in a small container for on-the-go snacking."],nutrition:{calories:290,protein:16,carbs:12,fat:22,sodium:120,sugar:2,fiber:5}},
  {id:91,name:"Paneer Tikka Bites",category:"Stir-fries & Sautees",prepTime:4,cookTime:6,emoji:"\uD83C\uDF5B",gradient:["#f12711","#f5af19"],ingredients:["150g paneer cubed","1 tbsp Greek yogurt","1 tsp tikka masala paste","1/2 tsp turmeric","1 tbsp ghee","1/4 cup diced bell pepper"],steps:["Cube paneer into bite-sized pieces.","Mix yogurt, tikka paste and turmeric.","Toss paneer cubes in the marinade.","Heat ghee in a pan over medium-high heat.","Cook paneer and bell pepper 3 minutes per side.","Serve hot with a squeeze of lemon."],nutrition:{calories:310,protein:22,carbs:6,fat:22,sodium:350,sugar:3,fiber:1}},
  {id:92,name:"Halloumi Veggie Skewers",category:"Stir-fries & Sautees",prepTime:5,cookTime:6,emoji:"\uD83C\uDF7D",gradient:["#ff6a00","#ee0979"],ingredients:["100g halloumi cubed","1/2 cup cherry tomatoes","1/2 cup zucchini chunks","1 tbsp olive oil","1/2 tsp oregano","1/2 tsp lemon zest"],steps:["Cut halloumi and zucchini into even cubes.","Thread halloumi, tomatoes and zucchini onto skewers.","Brush with olive oil and sprinkle oregano.","Cook on a hot grill pan 3 minutes per side.","Squeeze lemon zest over the skewers.","Serve immediately while halloumi is warm."],nutrition:{calories:280,protein:18,carbs:8,fat:20,sodium:380,sugar:4,fiber:1}},
  {id:93,name:"Seitan Pepper Steak",category:"Stir-fries & Sautees",prepTime:4,cookTime:7,emoji:"\uD83E\uDD58",gradient:["#b91d73","#f953c6"],ingredients:["150g seitan sliced","1 cup sliced bell peppers","1 tbsp soy sauce (low sodium)","1 tsp black pepper cracked","1 tbsp sesame oil","1 clove garlic minced"],steps:["Slice seitan into thin strips.","Heat sesame oil in a wok over high heat.","Add seitan and cook 3 minutes until browned.","Add bell peppers and garlic, stir-fry 2 minutes.","Add soy sauce and cracked black pepper.","Toss to combine and serve hot."],nutrition:{calories:255,protein:28,carbs:10,fat:11,sodium:380,sugar:4,fiber:2}},
  {id:94,name:"Queso Fresco Zucchini Rounds",category:"Wraps & Quick bites",prepTime:4,cookTime:5,emoji:"\uD83C\uDF73",gradient:["#d299c2","#fef9d7"],ingredients:["2 medium zucchini sliced into rounds","1/4 cup queso fresco crumbled","1/2 cup paneer cubes","1 tbsp olive oil","1/4 tsp chili powder","1 tbsp fresh cilantro"],steps:["Slice zucchini into thick rounds.","Heat olive oil in a pan over medium-high heat.","Cook zucchini rounds 2 minutes per side until golden.","Transfer to a plate and top with paneer cubes.","Crumble queso fresco and sprinkle chili powder over.","Garnish with cilantro and serve."],nutrition:{calories:285,protein:20,carbs:8,fat:20,sodium:310,sugar:4,fiber:2}},
  {id:95,name:"Cheese Quesadilla Wrap",category:"Paneer & Cheese",prepTime:3,cookTime:5,emoji:"\uD83C\uDF2F",gradient:["#f6d365","#fda085"],ingredients:["100g shredded mozzarella","2 large lettuce leaves","2 tbsp diced bell pepper","1 tbsp olive oil","1/4 tsp cumin","2 tbsp salsa"],steps:["Heat olive oil in a skillet over medium heat.","Place shredded mozzarella in a thin layer in the pan.","Cook 2 minutes until cheese melts and edges crisp.","Sprinkle cumin and diced bell pepper on top.","Fold the cheese crisp in half like a taco.","Serve wrapped in lettuce with salsa on the side."],nutrition:{calories:270,protein:18,carbs:5,fat:20,sodium:350,sugar:2,fiber:1}},
  {id:96,name:"Pesto Ricotta Baked Cup",category:"Paneer & Cheese",prepTime:3,cookTime:8,emoji:"\uD83C\uDF73",gradient:["#56ab2f","#a8e063"],ingredients:["1/2 cup part-skim ricotta","2 tbsp paneer crumbled","1 tbsp basil pesto","1/4 cup spinach chopped","Cooking spray","Pinch of red pepper flakes"],steps:["Preheat oven to 375F and spray ramekins.","Place spinach at the bottom of each ramekin.","Mix ricotta with crumbled paneer and red pepper flakes.","Spoon ricotta mixture into each ramekin.","Dollop pesto on top of each cup.","Bake 8 minutes until golden on top."],nutrition:{calories:260,protein:19,carbs:5,fat:18,sodium:330,sugar:1,fiber:1}},
  {id:97,name:"Tahini Lemon Lentil Bowl",category:"Legume/Bean-based",prepTime:3,cookTime:10,emoji:"\uD83C\uDF5B",gradient:["#ffecd2","#fcb69f"],ingredients:["1/2 cup red lentils rinsed","1 cup water","1 tbsp tahini","1 tbsp lemon juice","1/4 tsp cumin","1 tbsp chopped parsley"],steps:["Boil lentils in water for 8 minutes until tender.","Drain any excess water.","Stir in tahini and lemon juice.","Season with cumin.","Transfer to a bowl.","Top with chopped parsley and serve."],nutrition:{calories:270,protein:17,carbs:24,fat:10,sodium:180,sugar:2,fiber:7}},
  {id:98,name:"Smoked Paprika Yogurt Dip",category:"Greek Yogurt & Cottage Cheese",prepTime:3,cookTime:0,emoji:"\uD83C\uDF5B",gradient:["#ff5858","#f09819"],ingredients:["1 cup plain Greek yogurt (2%)","1 tsp smoked paprika","1 tbsp olive oil","1 clove garlic minced","1 tsp lemon juice","1/4 cup celery and carrot sticks"],steps:["Add Greek yogurt to a bowl.","Stir in smoked paprika and minced garlic.","Add lemon juice and mix well.","Drizzle olive oil on top.","Arrange celery and carrot sticks for dipping.","Serve chilled."],nutrition:{calories:195,protein:18,carbs:9,fat:10,sodium:200,sugar:6,fiber:1}},
  {id:99,name:"Tofu Avocado Collard Wrap",category:"Wraps & Quick bites",prepTime:5,cookTime:4,emoji:"\uD83C\uDF2F",gradient:["#11998e","#38ef7d"],ingredients:["100g firm tofu sliced","1 large collard green leaf","1/4 avocado sliced","2 tbsp shredded carrot","1 tsp tamari","1 tsp sesame oil"],steps:["Heat sesame oil and cook tofu slices 2 minutes per side.","Drizzle tamari over tofu.","Blanch collard green leaf 30 seconds.","Lay leaf flat and arrange tofu, avocado and carrot.","Roll up tightly, tucking in sides.","Slice in half and serve."],nutrition:{calories:230,protein:16,carbs:8,fat:16,sodium:310,sugar:2,fiber:4}},
  {id:100,name:"Protein Power Snack Plate",category:"Wraps & Quick bites",prepTime:5,cookTime:0,emoji:"\uD83C\uDF7D",gradient:["#667eea","#764ba2"],ingredients:["1/2 cup paneer cubes","2 tbsp almonds","2 tbsp pumpkin seeds","1 oz cheddar cheese cubed","1/4 cup cucumber slices","1/4 cup cherry tomatoes"],steps:["Cut paneer into bite-sized cubes.","Cube cheddar cheese.","Arrange paneer, almonds, pumpkin seeds and cheese on a plate.","Add cucumber slices and cherry tomatoes.","Season with a pinch of black pepper.","Serve as a balanced protein snack plate."],nutrition:{calories:340,protein:24,carbs:8,fat:24,sodium:370,sugar:3,fiber:2}}
];

var categories = ["All","Paneer & Cheese","Tofu & Tempeh","Legume/Bean-based","Greek Yogurt & Cottage Cheese","Salads with protein","Stir-fries & Sautees","Smoothies & Protein shakes","Wraps & Quick bites"];

var categoryEmojis = {
  "Paneer & Cheese": "\uD83E\uDDC0",
  "Tofu & Tempeh": "\uD83C\uDF31",
  "Legume/Bean-based": "\uD83C\uDF5C",
  "Greek Yogurt & Cottage Cheese": "\uD83E\uDDC0",
  "Salads with protein": "\uD83E\uDD57",
  "Stir-fries & Sautees": "\uD83C\uDF73",
  "Smoothies & Protein shakes": "\uD83E\uDD64",
  "Wraps & Quick bites": "\uD83C\uDF2F"
};

var categoryColors = {
  "Paneer & Cheese": "#ffb74d",
  "Tofu & Tempeh": "#a18cd1",
  "Legume/Bean-based": "#f2994a",
  "Greek Yogurt & Cottage Cheese": "#fbc2eb",
  "Salads with protein": "#96c93d",
  "Stir-fries & Sautees": "#38ef7d",
  "Smoothies & Protein shakes": "#ee9ca7",
  "Wraps & Quick bites": "#56ab2f"
};

function TreeNode(props) {
  var cat = props.category;
  var isExpanded = props.isExpanded;
  var onToggle = props.onToggle;
  var catRecipes = props.recipes;
  var selectedRecipeId = props.selectedRecipeId;
  var onSelectRecipe = props.onSelectRecipe;
  var isActiveCategory = props.isActiveCategory;
  var color = categoryColors[cat] || '#4caf50';
  var emoji = categoryEmojis[cat] || '';

  var nodeStyle = {
    cursor: 'pointer',
    userSelect: 'none',
    marginBottom: '2px'
  };

  var headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: '8px',
    background: isActiveCategory ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
    transition: 'background 0.2s ease',
    cursor: 'pointer'
  };

  var arrowStyle = {
    fontSize: '10px',
    color: '#888',
    transition: 'transform 0.2s ease',
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    width: '12px',
    textAlign: 'center',
    flexShrink: 0
  };

  var dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0
  };

  var catNameStyle = {
    fontSize: '13px',
    fontWeight: isActiveCategory ? '600' : '400',
    color: isActiveCategory ? '#4caf50' : '#ccc',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  var countBadgeStyle = {
    fontSize: '11px',
    color: '#888',
    background: 'rgba(255,255,255,0.06)',
    padding: '1px 6px',
    borderRadius: '8px',
    flexShrink: 0
  };

  var childrenContainerStyle = {
    overflow: 'hidden',
    maxHeight: isExpanded ? (catRecipes.length * 32 + 4) + 'px' : '0px',
    transition: 'max-height 0.3s ease',
    paddingLeft: '20px'
  };

  return React.createElement('div', { style: nodeStyle },
    React.createElement('div', {
      style: headerStyle,
      onClick: onToggle,
      onMouseEnter: function(e) { if (!isActiveCategory) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; },
      onMouseLeave: function(e) { if (!isActiveCategory) e.currentTarget.style.background = 'transparent'; }
    },
      React.createElement('span', { style: arrowStyle }, '\u25B6'),
      React.createElement('span', { style: dotStyle }),
      React.createElement('span', { style: { fontSize: '14px', flexShrink: 0 } }, emoji),
      React.createElement('span', { style: catNameStyle }, cat),
      React.createElement('span', { style: countBadgeStyle }, catRecipes.length)
    ),
    React.createElement('div', { style: childrenContainerStyle },
      catRecipes.map(function(r) {
        var isSelected = selectedRecipeId === r.id;
        var childStyle = {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 10px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          color: isSelected ? '#4caf50' : '#aaa',
          fontWeight: isSelected ? '600' : '400',
          background: isSelected ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        };
        var childDotStyle = {
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, ' + r.gradient[0] + ', ' + r.gradient[1] + ')',
          flexShrink: 0
        };
        return React.createElement('div', {
          key: r.id,
          style: childStyle,
          onClick: function(e) { e.stopPropagation(); onSelectRecipe(r); },
          onMouseEnter: function(e) { if (!isSelected) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#ddd'; } },
          onMouseLeave: function(e) { if (!isSelected) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#aaa'; } }
        },
          React.createElement('span', { style: childDotStyle }),
          React.createElement('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, r.name)
        );
      })
    )
  );
}

function App() {
  var _s1 = useState('');
  var search = _s1[0];
  var setSearch = _s1[1];

  var _s2 = useState('All');
  var activeCategory = _s2[0];
  var setActiveCategory = _s2[1];

  var _s3 = useState('default');
  var sortBy = _s3[0];
  var setSortBy = _s3[1];

  var _s4 = useState(null);
  var selectedRecipe = _s4[0];
  var setSelectedRecipe = _s4[1];

  var _s5 = useState({});
  var expandedCategories = _s5[0];
  var setExpandedCategories = _s5[1];

  var _s6 = useState(window.innerWidth < 768);
  var isMobile = _s6[0];
  var setIsMobile = _s6[1];

  var _s7 = useState(false);
  var sidebarOpen = _s7[0];
  var setSidebarOpen = _s7[1];

  var mainContentRef = useRef(null);

  useEffect(function() {
    function handleResize() {
      var mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return function() { window.removeEventListener('resize', handleResize); };
  }, []);

  var recipesByCategory = useMemo(function() {
    var map = {};
    categories.forEach(function(cat) {
      if (cat !== 'All') {
        map[cat] = recipes.filter(function(r) { return r.category === cat; });
      }
    });
    return map;
  }, []);

  var filteredRecipes = useMemo(function() {
    var result = recipes.filter(function(r) {
      var matchesCategory = activeCategory === 'All' || r.category === activeCategory;
      var searchLower = search.toLowerCase();
      var matchesSearch = !search || r.name.toLowerCase().indexOf(searchLower) !== -1 || r.ingredients.some(function(ing) { return ing.toLowerCase().indexOf(searchLower) !== -1; });
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'calories') {
      result.sort(function(a, b) { return a.nutrition.calories - b.nutrition.calories; });
    } else if (sortBy === 'protein') {
      result.sort(function(a, b) { return b.nutrition.protein - a.nutrition.protein; });
    } else if (sortBy === 'time') {
      result.sort(function(a, b) { return (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime); });
    }

    return result;
  }, [search, activeCategory, sortBy]);

  var toggleCategory = useCallback(function(cat) {
    setExpandedCategories(function(prev) {
      var next = {};
      for (var k in prev) { next[k] = prev[k]; }
      next[cat] = !prev[cat];
      return next;
    });
    setActiveCategory(cat);
    setSelectedRecipe(null);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, []);

  var closeSidebarOnMobile = useCallback(function() {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  var handleSelectAllRecipes = useCallback(function() {
    setActiveCategory('All');
    setSelectedRecipe(null);
    setSidebarOpen(false);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, []);

  var handleSelectRecipe = useCallback(function(r) {
    setSelectedRecipe(r);
    setSidebarOpen(false);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, []);

  var handleBackToGrid = useCallback(function() {
    setSelectedRecipe(null);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, []);

  // ===== STYLES =====

  var SIDEBAR_WIDTH = isMobile ? 280 : 280;

  var pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    position: 'relative'
  };

  var sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: isMobile ? (sidebarOpen ? '0' : '-300px') : '0',
    bottom: 0,
    width: SIDEBAR_WIDTH + 'px',
    background: isMobile ? 'rgba(10,10,26,0.98)' : 'rgba(0,0,0,0.3)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'left 0.3s ease',
    boxShadow: isMobile && sidebarOpen ? '4px 0 20px rgba(0,0,0,0.5)' : 'none'
  };

  var overlayBgStyle = {
    display: isMobile && sidebarOpen ? 'block' : 'none',
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 90
  };

  var hamburgerStyle = {
    display: isMobile ? 'flex' : 'none',
    position: 'fixed',
    top: '14px',
    left: '14px',
    zIndex: 80,
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(76,175,80,0.2)',
    border: '1px solid rgba(76,175,80,0.3)',
    color: '#4caf50',
    fontSize: '20px',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)'
  };

  var sidebarHeaderStyle = {
    padding: '20px 16px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  };

  var appTitleStyle = {
    fontSize: '22px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #4caf50, #81c784)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px'
  };

  var homeLinkStyle = {
    color: '#888',
    textDecoration: 'none',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '12px',
    transition: 'color 0.2s ease'
  };

  var searchInputStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(76, 175, 80, 0.25)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  var treeContainerStyle = {
    flex: 1,
    padding: '8px 8px',
    overflowY: 'auto'
  };

  var allRecipesNodeStyle = function(isActive) {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 10px',
      borderRadius: '8px',
      cursor: 'pointer',
      background: isActive ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
      marginBottom: '4px',
      transition: 'background 0.2s ease'
    };
  };

  var sidebarFooterStyle = {
    padding: '12px 16px',
    borderTop: '1px solid rgba(255,255,255,0.06)'
  };

  var sortSelectStyle = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(76, 175, 80, 0.25)',
    background: 'rgba(255,255,255,0.05)',
    color: '#ccc',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none'
  };

  var mainContentStyle = {
    marginLeft: isMobile ? '0' : SIDEBAR_WIDTH + 'px',
    flex: 1,
    minHeight: '100vh',
    overflowY: 'auto',
    padding: isMobile ? '60px 14px 24px' : '24px 28px'
  };

  var recipeCountStyle = {
    color: '#888',
    fontSize: '14px',
    marginBottom: '20px'
  };

  var gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: isMobile ? '14px' : '18px'
  };

  var cardStyle = {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  function cardImageStyle(gradient) {
    return {
      height: isMobile ? '120px' : '140px',
      background: 'linear-gradient(135deg, ' + gradient[0] + ', ' + gradient[1] + ')',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '44px' : '52px',
      position: 'relative'
    };
  }

  var calorieBadgeOnCardStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(6px)',
    color: '#ff9800',
    fontWeight: '700',
    fontSize: '13px',
    padding: '4px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,152,0,0.3)'
  };

  var cardBodyStyle = {
    padding: '14px'
  };

  var cardTitleStyle = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '8px',
    lineHeight: '1.3'
  };

  var cardStatsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '6px',
    flexWrap: 'wrap'
  };

  function statBadgeStyle(color) {
    return {
      padding: '3px 7px',
      borderRadius: '6px',
      background: 'rgba(' + color + ', 0.15)',
      color: 'rgb(' + color + ')',
      fontSize: '11px',
      fontWeight: '500'
    };
  }

  // Detail view styles
  var detailContainerStyle = {
    maxWidth: isMobile ? '100%' : '750px'
  };

  var backBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(76, 175, 80, 0.3)',
    background: 'rgba(76, 175, 80, 0.1)',
    color: '#4caf50',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'all 0.2s ease'
  };

  function detailImageStyle(gradient) {
    return {
      height: isMobile ? '160px' : '220px',
      background: 'linear-gradient(135deg, ' + gradient[0] + ', ' + gradient[1] + ')',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '60px' : '80px',
      borderRadius: '16px',
      marginBottom: '20px',
      position: 'relative'
    };
  }

  var detailCalorieBadgeStyle = {
    position: 'absolute',
    bottom: '-18px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(10,10,26,0.9)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255,152,0,0.4)',
    borderRadius: '12px',
    padding: isMobile ? '6px 16px' : '8px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap'
  };

  var detailTitleStyle = {
    fontSize: isMobile ? '22px' : '28px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '6px',
    marginTop: '10px'
  };

  var detailCategoryBadgeStyle = {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    background: 'rgba(76, 175, 80, 0.15)',
    color: '#4caf50',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '16px'
  };

  var timeRowStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  };

  var timeBadgeStyle = {
    padding: '6px 14px',
    borderRadius: '8px',
    background: 'rgba(76, 175, 80, 0.1)',
    border: '1px solid rgba(76, 175, 80, 0.2)',
    color: '#81c784',
    fontSize: '13px'
  };

  var sectionTitleStyle = {
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: '600',
    color: '#4caf50',
    marginBottom: '12px',
    marginTop: isMobile ? '18px' : '24px'
  };

  var ingredientItemStyle = {
    padding: '7px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: '14px',
    color: '#ccc',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  var stepItemStyle = {
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: '14px',
    color: '#ccc',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  };

  var stepNumberStyle = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(76, 175, 80, 0.2)',
    color: '#4caf50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0
  };

  var nutritionContainerStyle = {
    marginTop: '12px'
  };

  function nutritionBarRow(label, value, unit, color, maxVal) {
    var pct = Math.min((value / maxVal) * 100, 100);
    return React.createElement('div', {
      key: label,
      style: { marginBottom: '12px' }
    },
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }
      },
        React.createElement('span', { style: { fontSize: '13px', color: '#aaa' } }, label),
        React.createElement('span', { style: { fontSize: '13px', color: '#fff', fontWeight: '600' } }, value + ' ' + unit)
      ),
      label !== 'Calories' ? React.createElement('div', {
        style: { height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }
      },
        React.createElement('div', {
          style: { height: '100%', width: pct + '%', background: color, borderRadius: '3px', transition: 'width 0.5s ease' }
        })
      ) : null
    );
  }

  // ===== RENDER =====

  // Sidebar
  var sidebar = React.createElement('div', { style: sidebarStyle },
    React.createElement('div', { style: sidebarHeaderStyle },
      React.createElement('div', { style: appTitleStyle }, '\uD83E\uDD66 Veggie Recipes'),
      React.createElement('a', {
        href: '/',
        style: homeLinkStyle,
        onMouseEnter: function(e) { e.currentTarget.style.color = '#4caf50'; },
        onMouseLeave: function(e) { e.currentTarget.style.color = '#888'; }
      }, '\u2190 Home'),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Search recipes...',
        value: search,
        onChange: function(e) { setSearch(e.target.value); },
        style: searchInputStyle,
        onFocus: function(e) { e.target.style.borderColor = 'rgba(76,175,80,0.5)'; },
        onBlur: function(e) { e.target.style.borderColor = 'rgba(76,175,80,0.25)'; }
      })
    ),
    React.createElement('div', { style: treeContainerStyle },
      // All Recipes node
      React.createElement('div', {
        style: allRecipesNodeStyle(activeCategory === 'All' && !selectedRecipe),
        onClick: handleSelectAllRecipes,
        onMouseEnter: function(e) { if (!(activeCategory === 'All' && !selectedRecipe)) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; },
        onMouseLeave: function(e) { if (!(activeCategory === 'All' && !selectedRecipe)) e.currentTarget.style.background = 'transparent'; }
      },
        React.createElement('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50', flexShrink: 0 } }),
        React.createElement('span', {
          style: {
            fontSize: '13px',
            fontWeight: (activeCategory === 'All' && !selectedRecipe) ? '600' : '400',
            color: (activeCategory === 'All' && !selectedRecipe) ? '#4caf50' : '#ccc'
          }
        }, 'All Recipes'),
        React.createElement('span', {
          style: { fontSize: '11px', color: '#888', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '8px', marginLeft: 'auto' }
        }, '100')
      ),
      // Category tree nodes
      categories.filter(function(c) { return c !== 'All'; }).map(function(cat) {
        return React.createElement(TreeNode, {
          key: cat,
          category: cat,
          isExpanded: !!expandedCategories[cat],
          onToggle: function() { toggleCategory(cat); },
          recipes: recipesByCategory[cat] || [],
          selectedRecipeId: selectedRecipe ? selectedRecipe.id : null,
          onSelectRecipe: handleSelectRecipe,
          isActiveCategory: activeCategory === cat
        });
      })
    ),
    React.createElement('div', { style: sidebarFooterStyle },
      React.createElement('div', { style: { fontSize: '11px', color: '#666', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' } }, 'Sort by'),
      React.createElement('select', {
        style: sortSelectStyle,
        value: sortBy,
        onChange: function(e) { setSortBy(e.target.value); }
      },
        React.createElement('option', { value: 'default' }, 'Default'),
        React.createElement('option', { value: 'calories' }, 'Calories (low to high)'),
        React.createElement('option', { value: 'protein' }, 'Protein (high to low)'),
        React.createElement('option', { value: 'time' }, 'Total time (fastest)')
      )
    )
  );

  // Main content - detail view
  var detailView = null;
  if (selectedRecipe) {
    var r = selectedRecipe;
    var totalTime = r.prepTime + r.cookTime;
    var n = r.nutrition;

    detailView = React.createElement('div', { style: detailContainerStyle },
      React.createElement('button', {
        style: backBtnStyle,
        onClick: handleBackToGrid,
        onMouseEnter: function(e) { e.currentTarget.style.background = 'rgba(76,175,80,0.2)'; },
        onMouseLeave: function(e) { e.currentTarget.style.background = 'rgba(76,175,80,0.1)'; }
      }, '\u2190 Back to grid'),
      React.createElement('div', { style: detailImageStyle(r.gradient) },
        React.createElement('span', { style: { filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' } }, r.emoji),
        React.createElement('div', { style: detailCalorieBadgeStyle },
          React.createElement('span', { style: { color: '#ff9800', fontWeight: '700', fontSize: isMobile ? '20px' : '26px' } }, n.calories),
          React.createElement('span', { style: { color: '#aaa', fontSize: '13px' } }, 'kcal')
        )
      ),
      React.createElement('div', { style: detailTitleStyle }, r.name),
      React.createElement('div', { style: detailCategoryBadgeStyle }, r.category),
      React.createElement('div', { style: timeRowStyle },
        React.createElement('span', { style: timeBadgeStyle }, '\u23F1 Prep: ' + r.prepTime + ' min'),
        React.createElement('span', { style: timeBadgeStyle }, '\uD83D\uDD25 Cook: ' + r.cookTime + ' min'),
        React.createElement('span', { style: timeBadgeStyle }, '\u23F0 Total: ' + totalTime + ' min')
      ),
      React.createElement('div', { style: sectionTitleStyle }, 'Ingredients'),
      React.createElement('ul', { style: { listStyle: 'none', padding: 0, margin: 0 } },
        r.ingredients.map(function(ing, i) {
          return React.createElement('li', { key: i, style: ingredientItemStyle },
            React.createElement('span', { style: { color: '#4caf50', fontSize: '16px' } }, '\u2022'),
            ing
          );
        })
      ),
      React.createElement('div', { style: sectionTitleStyle }, 'Instructions'),
      r.steps.map(function(step, i) {
        return React.createElement('div', { key: i, style: stepItemStyle },
          React.createElement('div', { style: stepNumberStyle }, String(i + 1)),
          React.createElement('span', null, step)
        );
      }),
      React.createElement('div', { style: sectionTitleStyle }, 'Nutrition'),
      React.createElement('div', { style: nutritionContainerStyle },
        nutritionBarRow('Calories', n.calories, 'kcal', '#ff9800', 500),
        nutritionBarRow('Protein', n.protein, 'g', '#4caf50', 40),
        nutritionBarRow('Carbs', n.carbs, 'g', '#2196f3', 30),
        nutritionBarRow('Fat', n.fat, 'g', '#ff9800', 30),
        nutritionBarRow('Sodium', n.sodium, 'mg', '#f44336', 500),
        nutritionBarRow('Sugar', n.sugar, 'g', '#e91e63', 15),
        nutritionBarRow('Fiber', n.fiber, 'g', '#009688', 10)
      )
    );
  }

  // Compute total/avg calories for filtered recipes
  var totalCalories = filteredRecipes.reduce(function(sum, r) { return sum + r.nutrition.calories; }, 0);
  var avgCalories = filteredRecipes.length > 0 ? Math.round(totalCalories / filteredRecipes.length) : 0;
  var totalProtein = filteredRecipes.reduce(function(sum, r) { return sum + r.nutrition.protein; }, 0);
  var avgProtein = filteredRecipes.length > 0 ? Math.round(totalProtein / filteredRecipes.length) : 0;

  var summaryBarStyle = {
    display: 'flex',
    gap: isMobile ? '8px' : '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: '20px',
    padding: isMobile ? '12px' : '14px 18px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.06)'
  };

  var summaryStatStyle = function(color) {
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '6px 10px' : '8px 16px',
      borderRadius: '10px',
      background: 'rgba(' + color + ', 0.08)',
      border: '1px solid rgba(' + color + ', 0.15)',
      minWidth: isMobile ? '70px' : '90px'
    };
  };

  var summaryNumStyle = function(color) {
    return {
      fontSize: isMobile ? '18px' : '22px',
      fontWeight: '700',
      color: 'rgb(' + color + ')',
      lineHeight: '1.2'
    };
  };

  var summaryLabelStyle = {
    fontSize: '10px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    marginTop: '2px'
  };

  // Main content - grid view
  var gridView = React.createElement('div', null,
    React.createElement('div', { style: recipeCountStyle },
      'Showing ' + filteredRecipes.length + ' of 100 recipes'
    ),
    React.createElement('div', { style: summaryBarStyle },
      React.createElement('div', { style: summaryStatStyle('255, 152, 0') },
        React.createElement('span', { style: summaryNumStyle('255, 152, 0') }, avgCalories),
        React.createElement('span', { style: summaryLabelStyle }, 'Avg Cal')
      ),
      React.createElement('div', { style: summaryStatStyle('76, 175, 80') },
        React.createElement('span', { style: summaryNumStyle('76, 175, 80') }, avgProtein + 'g'),
        React.createElement('span', { style: summaryLabelStyle }, 'Avg Protein')
      ),
      React.createElement('div', { style: summaryStatStyle('100, 181, 246') },
        React.createElement('span', { style: summaryNumStyle('100, 181, 246') }, totalCalories.toLocaleString()),
        React.createElement('span', { style: summaryLabelStyle }, 'Total Cal')
      ),
      React.createElement('div', { style: summaryStatStyle('76, 175, 80') },
        React.createElement('span', { style: summaryNumStyle('76, 175, 80') }, totalProtein + 'g'),
        React.createElement('span', { style: summaryLabelStyle }, 'Total Protein')
      )
    ),
    React.createElement('div', { style: gridStyle },
      filteredRecipes.map(function(r) {
        var totalTime = r.prepTime + r.cookTime;
        return React.createElement('div', {
          key: r.id,
          style: cardStyle,
          onClick: function() { handleSelectRecipe(r); },
          onMouseEnter: function(e) {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(76,175,80,0.15)';
            e.currentTarget.style.borderColor = 'rgba(76,175,80,0.3)';
          },
          onMouseLeave: function(e) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }
        },
          React.createElement('div', { style: cardImageStyle(r.gradient) },
            React.createElement('span', { style: { filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' } }, r.emoji),
            React.createElement('span', { style: calorieBadgeOnCardStyle }, r.nutrition.calories + ' kcal')
          ),
          React.createElement('div', { style: cardBodyStyle },
            React.createElement('div', { style: cardTitleStyle }, r.name),
            React.createElement('div', { style: cardStatsStyle },
              React.createElement('span', { style: statBadgeStyle('255, 152, 0') }, r.nutrition.calories + ' cal'),
              React.createElement('span', { style: statBadgeStyle('76, 175, 80') }, r.nutrition.protein + 'g protein'),
              React.createElement('span', { style: statBadgeStyle('100, 181, 246') }, totalTime + ' min')
            )
          )
        );
      })
    )
  );

  // Main content area
  var mainContent = React.createElement('div', {
    ref: mainContentRef,
    style: mainContentStyle
  },
    selectedRecipe ? detailView : gridView
  );

  return React.createElement('div', { style: pageStyle },
    // Mobile hamburger button
    React.createElement('div', {
      style: hamburgerStyle,
      onClick: function() { setSidebarOpen(!sidebarOpen); }
    }, sidebarOpen ? '\u2715' : '\u2630'),
    // Mobile overlay backdrop
    React.createElement('div', {
      style: overlayBgStyle,
      onClick: function() { setSidebarOpen(false); }
    }),
    sidebar,
    mainContent
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
