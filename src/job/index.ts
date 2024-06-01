import Agenda from 'agenda';

import env from '@env';

const agenda = new Agenda({
  db: { address: env.DATABASE_URL, collection: 'jobs' },
});

export default agenda;
