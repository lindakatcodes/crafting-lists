# Crafting Lists

Select the item recipes you want to build or upgrade, and a list will be generated for you with all the items you'll need to build everything.

Currently only includes some Lego Fortnite recipes.

## Built With

- Astro
- Vue
- Tailwind
- Astra DB
- Netlify

Also special shout outs to some example code that helped me scrap the data I wanted and get AstraDB set up:

swiftieGPT example (to see how to load the data and generate embeddings):
https://github.com/datastax/SwiftieGPT/blob/main/scripts/loadDb.ts

web scraper example (to get the data I wanted from web pages):
https://github.com/tvanantwerp/scraper-example?tab=readme-ov-file

## Future Plans

This is a very early prototype! There's still a lot I'd like to add and improve.

### Lego Fortnite

- The recipe list is not as complete as I'd like. There's lots more recipes to add, but the format of the data isn't the same so it'll need some tweaking to get everything standardized.
- The ability to select more than one of each recipe (you might want to make multiple swords for instance).
- Some recipes need other recipes to make them, not just raw materials. So I really want to do further processing on the resulting materials list and show both the final items you need to have, as well as the full count of all raw materials to make everything.
- I'd also love to show the biome to collect each material in, and potentially show groupings by biome or type of material. Since bag space is limited, knowing where to go and what to collect in each area could help!
- Rather than just listing the  materials, I'd like to make it more interactive. Either a to-do list that you can mark off as you get each quantity, or be able to somehow add the quantity you currently have and let that value adjust.

Some Lego Fortnite reference links I still want to add:
"https://www.reddit.com/r/LEGOfortnite/wiki/index/recipes/builds/"
"https://www.reddit.com/r/LEGOfortnite/wiki/index/upgrades/"

### Other games

I'd really love to make this open to create similar lists for other games with crafting!

What I'm thinking is to add user accounts and give you the option to store/save lists for specific games. So you could still have your current Lego Fortnite list, but also create a list for Palia or Satisfactory. Or even save multiple lists per game! This part will be slow to come, but it's the ultimate end goal for this project.

I don't have a specific list of games yet, so if there are ones you think this would be helpful for let me know!
