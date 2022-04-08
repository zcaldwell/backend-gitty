const fetch = require('cross-fetch');

module.exports = class Quote {
  static getAll() {
    const apiArray = [
      'https://programming-quotes-api.herokuapp.com/quotes/random',
      'https://futuramaapi.herokuapp.com/api/quotes/1',
      'https://api.quotable.io/random',
    ];

    const fetchArray = apiArray.map((api) => {
      return fetch(api);
    });

    return Promise.all(fetchArray)
      .then((resp) => {
        return Promise.all(resp.map((object) => object.json()));
      })
      .then((resp) =>
        resp.flat().map((object) => {
          return {
            author: object.author || object.character,
            content: object.en || object.quote || object.content,
          };
        })
      );
  }
};
