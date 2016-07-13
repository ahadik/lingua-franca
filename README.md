#[Lingua Franca][1]
##Translation for Design
Your tool for evaluating translations for UI content

###Designing For Scale
"Software is eating the world", and that means your UI needs to stand up to translation into any number of languages. Too often, we as designers assume that English is a good middle ground. Too often, it is not. [Lingua Franca][1] is a tool to evaluate wording choices, and understand when our own perspective isn't very representative of our users.

###Data Driven Design
Usa Lingua Franca to make better design decisions that scale across languages. Lingua Franca offers three keys functionalities.

__Translation__

<img width="1020" alt="translation" src="https://cloud.githubusercontent.com/assets/3239506/16807164/05624144-48dd-11e6-858b-d27d3ab32d74.png">

Lingua Franca lets you translate any text input in any language that is supported by Google Translate - [there's 103 of them][2]! The source language will be automatically detected, but if you like - you can determine the source yourself. By default, Lingua Franca translates your text into every available language, but you can narrow down the languages to just those that you want to support.

__Ranking__

Lingua Franca displays all translations ranked by rendered length. That means that translations are ranked based on the number of pixels they take up based on a generic typeface (Open Sans) instead of counting characters. You can immediately see which translations are larger or small outliers. Your source language is highlighted for easy comparison.

<img width="756" alt="data" src="https://cloud.githubusercontent.com/assets/3239506/16807565/9332ccb8-48de-11e6-8109-c2c635a579ba.png">

__Analysis__

Lingua Franca offers basic analysis to demonstrate where your text's source language lies in the ranking of all translations. Immediately see if most translations clock in longer or shorter than your source text.

###Upcoming Releases
Some features that are in the pipes for release quite soon include:

- [ ] Improved analytics with weighted languages based on the numbers of speakers for a given language.
- [ ] Markup/CSS editing and display with translation support to see immediately how an HTML element handles different translations.
- [ ] Improved data visualization tools to condense data and make it more consumable.

###Contributing
We welcome all pull requests! If you want a sense of what to work on, check out the open issues.

###Authors
Designed and implemented by [Alex Hadik][3] and [Joshua Shiau][4]



[1]: http://linguafranca.alexhadik.com "Lingua Franca"
[2]: https://translate.google.com/about/intl/en_ALL/languages.html "Google Translate Language List"
[3]: http://www.alexhadik.com "Alex Hadik"
[4]: http://www.joshshiau.com "Josh Shiau"