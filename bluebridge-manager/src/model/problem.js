
export const config = {
  DIFFICULTY_TEXT: ['青铜Bronze', '白银Silver', '黄金Gold', '砖石Diamond', '大师Master'],
  DIFFICULTY_LIST: [1, 2, 3, 4, 5],
  LANGUAGE_LIST: ['C/C++', 'JAVA'],
  TYPE_LIST: ['省赛', '决赛', '校内选拔赛'],
  YEAR_LIST: (() => {
    let list = [];

    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    let maxYear = month >= 3 ? year : year - 1;

    for(let i = maxYear; i >= 2011; i--) {
      list.push(i);
    }

    return list;
  })(),
  LATEST_YEAR: (() => {
    const date = new Date();
    let year = date.getFullYear();
    const month = date.getMonth();

    year = parseInt(year.toString());

    return month > 2 ? year : year - 1;
  })()
};
