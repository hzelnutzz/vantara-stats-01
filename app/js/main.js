/**
 * Page entry point. Loads the shared chrome, then hands off to the controller
 * for the page named by <body data-page="...">.
 */

import { initNav } from './nav.js';
import { initHome } from './pages/home.js';
import { initPopulation } from './pages/population.js';
import { initEconomy } from './pages/economy.js';
import { initHealth } from './pages/health.js';
import { initEducation } from './pages/education.js';
import { initLabor } from './pages/labor.js';

const pages = {
  home: initHome,
  population: initPopulation,
  economy: initEconomy,
  health: initHealth,
  education: initEducation,
  labor: initLabor,
};

initNav();

const page = document.body.dataset.page || 'home';
if (pages[page]) pages[page]();
