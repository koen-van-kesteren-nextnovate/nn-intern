# nextnovator2-frontend

(8 maart 2022)
Het huidige ontwerp is op een aantal plekken nog niet helemaal consistent. Dit heeft te maken met nieuwe inzichten die tijdens de implementatie  ontstonden. Een aantal veranderingen zijn nog niet op alle componenten toegepast. Dit heeft onder andere betrekking op het gebruik van de verschillende style display methodes (flexbox, grid etc). In eerste instantie is er gebruik gemaakt van CSS Grid maar toen ik tegen bepaalde beperkingen aanliep ben ik overgestapt op Flexbox. Door beperkte tijd lopen deze methodes nu soms wat rommelig door elkaar heen.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### deploy to firebase
npm run build
firebase deploy --only hosting --project nextnovate-services-dev
npm start

### testen
test user: test2@test.nl, wachtwoord: 123456