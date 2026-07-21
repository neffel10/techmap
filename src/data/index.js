import categories from './categories.json';
import comparisons from './comparisons.json';

import frontendTech from './technologies/frontend.json';
import stylingTech from './technologies/styling.json';
import stateTech from './technologies/state.json';
import backendTech from './technologies/backend.json';
import databaseTech from './technologies/databases.json';
import apiTech from './technologies/apis.json';
import devopsTech from './technologies/devops.json';
import testingTech from './technologies/testing.json';
import securityTech from './technologies/security.json';
import aiTech from './technologies/ai.json';

export const technologies = [
  ...frontendTech,
  ...stylingTech,
  ...stateTech,
  ...backendTech,
  ...databaseTech,
  ...apiTech,
  ...devopsTech,
  ...testingTech,
  ...securityTech,
  ...aiTech
];

export { categories, comparisons };