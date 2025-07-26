import { themesToSeed } from '../db/seed-data';

function generate() {
  console.log('DELETE FROM themes;');

  const values = themesToSeed
    .map((theme) => {
      const escapedTheme = theme.theme.replace(/'/g, "''");
      return `('${theme.difficulty}', '${escapedTheme}')`;
    })
    .join(',\n');

  const insertSql = `INSERT INTO themes (difficulty, theme) VALUES\n${values};`;
  console.log(insertSql);
}

generate();
