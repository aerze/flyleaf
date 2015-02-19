#Todo

###Mock Up Static HTML

Create a basic layout of the app using the MaterialCSS Library

 - Create main panel
 - Create slide out menu
 - Create tile view for searching for manga
 - Create manga info view
 - Create manga chapters view
 - Create page view
 - Create logo?

###Decide App Flow

Because I won't be hosting, I can't have things like users, which means the beginning where a user's homescreen might go will make no sense. Although I plan to save certain settings to the device itself using something like pouch.js, at this point I'm just a proxy for other manga and comic APIs, I don't even have a "Home" page or menu to go to, we'll see maybe just a giant search with some popular choices hardcoded in for now


###Write API Abstraction Layer

In order to be able to pull from multiple sources (different APIs and RSS feeds), there needs to be an abstraction layer that the renderer can hook into

 - Decide on what the minimum information should be for the mangaInfo view.